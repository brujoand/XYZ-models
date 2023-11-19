const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission} = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateX, translateY, translateZ, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const screwRadius = 1
const screwBuffer = 1.55

const screwYOffset = 3
const screwXoffset = 11

const width = (screwXoffset * 2) + 1.5 + screwRadius
const depth = (screwYOffset * 2) + 1.5 + screwRadius
const height = 4
const screwHeight = height

function createStrap(){
  const fullStrap = cuboid({size: [width, depth, height], center: [0, 0, 0]})
  const BLScrew = center(
    {relativeTo: [-screwXoffset, -screwYOffset, 0]},
      cylinder({radius: screwRadius, height: screwHeight, segments: 12})
    )
  const BRScrew = translateY(screwYOffset*2, BLScrew)
  const TRScrew = translateX(screwXoffset*2, BRScrew)
  const TLScrew = translateX(screwXoffset*2, BLScrew)

  const screwHoles = union(BLScrew, BRScrew, TRScrew, TLScrew)

  const cutLine = cuboid({size: [width*0.7, depth, height/2], center: [0,0,(-height/4)]})
  return subtract(fullStrap, screwHoles, cutLine)


}


function main () {
  return union(createStrap())
}

module.exports = { main }
