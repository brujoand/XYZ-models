const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { mirrorX, mirrorY, rotateX, rotateY, rotateZ } = jscad.transforms
const { degToRad } = jscad.utils


function main (){

  const mainCircleRadius = 90
  const mainCircleWidth = 20
  const mainCircleThickness = 3

  const rimWidth = 3
  const rimThickness = 9
  const rimRadius = mainCircleRadius - mainCircleWidth + rimWidth

  const toothRadius = 10
  const toothConnectorLength = 10
  const toothThickness = 9

  const nutClearingRadius = 3.75
  const nutRadius = 2

  const mainCircleOuter = cylinder({radius: mainCircleRadius, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})
  const mainCircleInner = cylinder({radius: mainCircleRadius - mainCircleWidth, height: mainCircleThickness, center: [0,0,mainCircleThickness/2], segments: 64})

  const rimOuter = cylinder({radius: rimRadius, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})
  const rimInner = cylinder({radius: rimRadius - rimWidth, height: rimThickness, center: [0,0,rimThickness/2], segments: 64})

  const toothCircle = cylinder({radius: toothRadius, height: toothThickness, center: [60,0,toothThickness/2], segments: 24})
  const toothConnector = cuboid({size: [toothConnectorLength, toothRadius * 2, toothThickness], center: [65,0,toothThickness/2]})

  const toothNutClearingHole = cylinder({radius: nutClearingRadius, height: toothThickness/2, center: [60,0,toothThickness/4], segments: 12})
  const toothNutHole = cylinder({radius: nutRadius, height: toothThickness-2, center: [60,0,toothThickness - (toothThickness/4)], segments: 64})

  const tooth = union(toothCircle, toothConnector)
  const nut = union(toothNutClearingHole, toothNutHole)

  const toothNut = subtract(tooth, nut)


  const mainCircle = subtract(mainCircleOuter, mainCircleInner)
  const rim = subtract(rimOuter, rimInner)

  const single_tooth = union(union(mainCircle, rim), toothNut) // men isteden bruker vi denne

  const angle = degToRad(72)

  const double_tooth = rotateZ(angle, single_tooth)
  const tripple_tooth = rotateZ(angle, double_tooth)
  const quadruple_tooth = rotateZ(angle, tripple_tooth)
  const pentagon = rotateZ(angle, quadruple_tooth)

  const one = union(single_tooth, double_tooth)
  const two = union(one, tripple_tooth)
  const three = union(two, quadruple_tooth)
  const four = union(three, pentagon)

  return four

}

module.exports = { main }
