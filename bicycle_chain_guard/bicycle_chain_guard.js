const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { rotateZ } = jscad.transforms
const { degToRad } = jscad.utils


function main (){

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
  const toothConnectorPositionZ = (mainCircleRadius - mainCircleWidth) - (toothRadius / 2 )
  const toothPositionZ = toothConnectorPositionZ - (toothConnectorLength / 2)

  const nutClearingRadius = 3.75
  const nutRadius = 2

  const mainCircleOuter = cylinder({radius: mainCircleRadius, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})
  const mainCircleInner = cylinder({radius: mainCircleRadius - mainCircleWidth, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})

  const rimOuter = cylinder({radius: rimRadius, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})
  const rimInner = cylinder({radius: rimRadius - rimWidth, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})

  const toothCircle = cylinder({radius: toothRadius, height: toothThickness, center: [toothPositionZ,0,toothThickness/2], segments: 24})
  const toothConnector = cuboid({size: [toothConnectorLength, toothRadius * 2, toothThickness], center: [toothConnectorPositionZ,0,toothThickness/2]})

  const toothNutClearingHole = cylinder({radius: nutClearingRadius, height: toothThickness/2, center: [toothPositionZ,0,toothThickness/4], segments: 12})
  const toothNutHole = cylinder({radius: nutRadius, height: toothThickness-2, center: [toothPositionZ,0,toothThickness - (toothThickness/4)], segments: 64})

  const tooth = union(toothCircle, toothConnector)
  const nut = union(toothNutClearingHole, toothNutHole)

  const toothNut = subtract(tooth, nut)

  const mainCircle = subtract(mainCircleOuter, mainCircleInner)
  const rim = subtract(rimOuter, rimInner)

  const single_tooth = union(union(mainCircle, rim), toothNut)

  const toothAngle = degToRad(360/toothCount)

  var full_chain_guard = single_tooth

  for (let i = 0; i < toothCount; i++) {
    const rotated_chain_guard = rotateZ(toothAngle, full_chain_guard)
    full_chain_guard = union(full_chain_guard, rotated_chain_guard)
  }

  return full_chain_guard

}

module.exports = { main }
