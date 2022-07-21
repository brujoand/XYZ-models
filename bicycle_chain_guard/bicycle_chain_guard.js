const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { rotateZ } = jscad.transforms
const { degToRad } = jscad.utils

const mainCircleRadius = 82.5
const mainCircleWidth = 20
const mainCircleThickness = 3

const rimWidth = 3
const rimThickness = 9
const rimRadius = mainCircleRadius - mainCircleWidth + rimWidth

const toothCount = 5
const toothRadius = 10
const toothConnectorLength = 10
const toothThickness = 9
const toothConnectorPositionX = (mainCircleRadius - mainCircleWidth) - (toothRadius / 2 )
const toothPositionX = toothConnectorPositionX - (toothConnectorLength / 2) - 2

const nutClearingRadius = 3.75
const nutRadius = 2


function generateMainCircle() {
  const mainCircleOuter = cylinder({radius: mainCircleRadius, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})
  const mainCircleInner = cylinder({radius: mainCircleRadius - mainCircleWidth, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})
  return subtract(mainCircleOuter, mainCircleInner)
}


function generateRim() {
  const rimOuter = cylinder({radius: rimRadius, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})
  const rimInner = cylinder({radius: rimRadius - rimWidth, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})
  return subtract(rimOuter, rimInner)
}

function generateTooth() {
  const toothCircle = cylinder({radius: toothRadius, height: toothThickness, center: [toothPositionX,0,toothThickness/2], segments: 24})
  const toothConnector = cuboid({size: [toothConnectorLength, toothRadius * 2, toothThickness], center: [toothConnectorPositionX,0,toothThickness/2]})

  const toothNutClearingHole = cylinder({radius: nutClearingRadius, height: toothThickness/2, center: [toothPositionX,0,toothThickness/4], segments: 12})
  const toothNutHole = cylinder({radius: nutRadius, height: toothThickness-2, center: [toothPositionX,0,toothThickness - (toothThickness/4)], segments: 64})

  const tooth = union(toothCircle, toothConnector)
  const nut = union(toothNutClearingHole, toothNutHole)

  return subtract(tooth, nut)
}


function main (){
  const mainCircle = generateMainCircle()
  const rim = generateRim()

  const tooth = generateTooth()

  const single_tooth_chain_guard = union(union(mainCircle, rim), tooth)

  const toothAngle = degToRad(360/toothCount)

  var full_chain_guard = single_tooth_chain_guard

  for (let i = 0; i < toothCount; i++) {
    const rotated_chain_guard = rotateZ(toothAngle, full_chain_guard)
    full_chain_guard = union(full_chain_guard, rotated_chain_guard)
  }

  return full_chain_guard

}

module.exports = { main }
