const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateY, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const doorDepth = 40
const stemWidth = 5
const stemBuffer = 10
const stemHeight = doorDepth + (stemBuffer * 2)
const knobSkirtRadius = 16
const knobHandleRadius = 14
const knobHandleHeight = 10
const knobSkirtHeight = 3
const knobHeight = 15
const screwRadius = 2
const screwHeight = 20
const screwChamberRadius = screwRadius * 1.8
const screwChamberHeight = 10

function createKnob(){
  const knobSkirt = rotateX(degToRad(90), cylinder({radius: knobSkirtRadius, height: knobSkirtHeight, segments: 32}))
  const knobHandle = cylinderElliptic({startRadius: [knobHandleRadius, knobHandleRadius], endRadius: [knobHandleRadius, knobHandleRadius], height: knobHandleHeight, segments: 32, startAngle: 0, endAngle: degToRad(180)})
  const stem = cuboid({size: [stemWidth, stemHeight, stemWidth], center: [0, knobSkirtHeight - (stemHeight/2), 0]})
  const stemHole = cuboid({size: [stemWidth+0.2, stemHeight, stemWidth+0.2], center: [0, knobSkirtHeight - (stemHeight/2), 0]})
  const screwChamber = translate([0, (screwChamberHeight/2)+knobSkirtHeight+(screwChamberHeight/2)+2,0 ], rotateX(degToRad(90), cylinder({radius: screwChamberRadius, height: screwChamberHeight, segments: 32})))
  const screwHole = translate([0, (screwChamberHeight/2) ], rotateX(degToRad(90), cylinder({radius: screwRadius, height: screwHeight, segments: 32})))
  const chamber = union(stemHole, screwChamber, screwHole)
  const screwHole2 = translate([0,0,0], screwHole)
  const rod = translate([30,0,30], subtract(translate([0,stemHeight, 0],subtract(stem, screwHole2)), screwHole2))
  return union(subtract(union(knobSkirt, knobHandle), chamber), rod)
}


function main () {
  return union(createKnob())
}

module.exports = { main }
