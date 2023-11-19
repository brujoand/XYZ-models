const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, circle, cuboid, polygon, roundedCuboid } = jscad.primitives
const { rotateX, rotateY, rotateZ, translateX, center, translateY} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls


const handyRadius = 68/2
const bandRadius = handyRadius + (6/2)
const controllerGapWidth = 54
const contrallerGapHeight = 17


const connectorBlockWidth = 20
const connectorBlockDepth = 18

const connectorBaseRadius = 15
const connectorBaseHeight = 20
const connectorCrossWidth = 24
const connectorCrossHeight = 15
const connectorCrossDepth = 3.5
const connectorCircleRadius = 6.4
const connectorScrewHoleRadius = 1.75

const nutHoleRadius = 3
const hexHeight = 4
const nutHoleHeight = connectorBlockDepth - hexHeight + 4
const hexHoleRadius = 4.5
const bandHeight = 30

function createBase(){
  const band = cylinder({radius: bandRadius, height: bandHeight, center: [0,0,0], segments: 64})
  const handy = cylinder({radius: handyRadius, height: bandHeight, center: [0,0,0], segments: 64})

  const controller = roundedCuboid({size: [controllerGapWidth, bandRadius, contrallerGapHeight], roundRadius: 3, center: [0, -handyRadius, (-contrallerGapHeight/2)], segments: 32})

  const connectorBlock = cuboid({size: [connectorBlockWidth, connectorBlockDepth, bandHeight], center: [1-bandRadius-(connectorBlockWidth/2),0,0]})
  const connectorBlockCeparator = cuboid({size: [connectorBlockWidth + 5, 1, bandHeight], center: [1-bandRadius-(connectorBlockWidth/2),0,0]})

  const nutHole = cylinder({radius: nutHoleRadius, height: nutHoleHeight, center: [0,0,0], segments: 24})
  const hexHole = cylinder({radius: hexHoleRadius, height: hexHeight, center: [0,0,(nutHoleHeight/2) - (hexHeight/2)], segments: 6})
  const nutAngle  = degToRad(90)
  const hole = union(hexHole, nutHole)

  const screwHole = translateX(-bandRadius- (connectorBlockWidth/2), rotateX(degToRad(90), hole))


  const connectorBase = cylinder({radius: connectorBaseRadius, height: connectorBaseHeight, center: [0,0,0], segments: 24})
  const connectorCross = cuboid({size: [connectorCrossWidth, connectorCrossDepth, connectorCrossHeight], center: [0, 0, 3]})

  const connectorCrossed = rotateZ(degToRad(90), connectorCross)
  const cross = union(connectorCrossed, connectorCross)

  const connectorCylinderRadius = (12.5/2)

  const connectorCylinder = cylinder({radius: connectorCylinderRadius, height: connectorCrossHeight, center: [0,0,3], segments: 24})

  const crossfuck = union(cross, connectorCylinder)


  const screwWashRadius = 4
  const screwWashHeight = 3

  const connectorWash = cylinder({radius: screwWashRadius, height: screwWashHeight, center: [0,0,-10], segments: 12})
  const connectorScrewHole = cylinder({radius: connectorScrewHoleRadius, height: connectorCrossHeight + 3, center: [0,0,-(connectorBaseHeight/2)], segments: 12})

  const connector = rotateZ(degToRad(270),translateY(bandRadius + (connectorBaseHeight/2) - 3, rotateX(degToRad(270), subtract(connectorBase, crossfuck))))
  const screwHoleFinal = rotateZ(degToRad(270),translateY(bandRadius + (connectorBaseHeight/2) - 3, rotateX(degToRad(270), union(connectorScrewHole, connectorWash))))

  return subtract(union(subtract(subtract(union(subtract(subtract(band, handy), controller), connectorBlock), connectorBlockCeparator), screwHole), connector), screwHoleFinal)

}

function main () {
  return createBase()
}

module.exports = { main }
