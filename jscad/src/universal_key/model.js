const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateX, translateZ, center, centerZ, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const doorDepth = 45
const stemWidth = 5
const stemBuffer = 10
const stemHeight = doorDepth + stemBuffer
const knobSkirtRadius = 16
const knobHandleRadius = 14
const knobHandleHeight = 10
const knobSkirtHeight = 3
const knobHeight = 15
const screwRadius = 2
const screwHeight = 20
const screwChamberRadius = screwRadius * 1.8
const screwChamberHeight = 5

function createKnob(){
  const knobCenterHeight = (knobSkirtHeight + stemHeight)
  const knobSkirt = cylinder({radius: knobSkirtRadius, height: knobSkirtHeight, segments: 32, center: [0,0, knobCenterHeight - knobSkirtHeight/2]})
  const outerSkirt = center({relativeTo: [0,0,knobSkirtHeight/2]}, knobSkirt)
  const knobRangeRadius = [knobHandleRadius, knobHandleRadius]
  const knobHandle = center({relativeTo: [0,0,knobCenterHeight + knobHandleRadius/2]}, rotateX(degToRad(90),
    cylinderElliptic({startRadius: knobRangeRadius, endRadius: knobRangeRadius, height: knobHandleHeight, segments: 32, startAngle: 0, endAngle: degToRad(180)})
  ))

  const stem = cuboid({size: [stemWidth, stemWidth, stemHeight], center: [0, 0, knobSkirtHeight + (stemHeight/2), 0]})
  const stemScrewHole = cuboid({size: [stemWidth+0.2, stemWidth+0.2, stemBuffer], center: [0, 0, knobCenterHeight]})
  const screwChamber = cylinder({radius: screwChamberRadius, height: screwChamberHeight, segments: 32, center: [0,0,knobCenterHeight+(screwChamberHeight/2) + 10]})
  const screwHole = cylinder({radius: screwRadius, height: screwHeight, segments: 32, center: [0,0,knobCenterHeight]})
  const outerPart = translateX(doorDepth, subtract(union(outerSkirt, stem), screwHole))
  const innerPart = center({relativeTo: [0,0,(knobSkirtHeight/2)+knobHandleRadius/2]}, subtract(union(knobSkirt, knobHandle), stemScrewHole, screwChamber, screwHole))
  return union(outerPart, innerPart)

}


function main () {
  return union(createKnob())
}

module.exports = { main }
