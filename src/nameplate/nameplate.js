const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateY, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const plateName = "Manuel"
const fontSize = 10
const nameLength = plateName.length
const charSpace = (((fontSize/nameLength)+((10-nameLength)/10))/10)+1

const baseX = 84
const baseY = baseX/3
const baseZ = 0.23

function createBasePlate(){
  const basePlate = cuboid({size: [baseX, baseY, baseZ], center: [0, 0, baseZ/2]})
  return basePlate
}

const brimWidth = baseZ * 2

function createTopLayer() {
  const topHole = cuboid({size: [baseX - brimWidth, baseY - brimWidth, baseZ], center: [0, 0, baseZ+(baseZ/2)]})
  const basePlate = cuboid({size: [baseX, baseY, baseZ], center: [0, 0, baseZ+(baseZ/2)]})
  const brim = subtract(basePlate, topHole)
  const textSegments = vectorText({ xOffset: 0, yOffset: 0, height: fontSize, letterSpacing: charSpace, input: plateName })
  const lineRadius = baseZ * 0.8
  const lineCorner = circle({ radius: lineRadius })


  const plateText = []
  textSegments.forEach((segmentPoints) => {
    const corners = segmentPoints.map((point) => translate(point, lineCorner))
    plateText.push(hullChain(corners))
  })
  const textObject = union(plateText)
  const textObject3D = extrudeLinear({ height: baseZ }, textObject)

  return union(brim, translate([0,0,baseZ+(baseZ/2)], center([0, 0, 10], textObject3D)))
}

function main () {
  return union(createBasePlate(), createTopLayer())
}

module.exports = { main }
