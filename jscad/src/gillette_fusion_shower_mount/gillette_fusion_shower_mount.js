const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateY, center } = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries

const wallThickness = 2

const rasorX = 42.5
const rasorY = 15
const rasorZ = 23
const rasorBuffer = 2
const rasorPadding = (rasorBuffer * 2) + (wallThickness * 2)

const baseExtention = 50
const baseX = rasorX + rasorPadding
const baseY = rasorY + rasorPadding + baseExtention
const baseZ = rasorZ + rasorPadding

function createBase() {
  const baseWall = cuboid({size: [baseX, wallThickness, baseZ], center: [baseX/2, wallThickness/2, baseZ/2]})
  const baseFloor = cuboid({size: [baseX, baseY, wallThickness], center: [baseX/2, baseY/2, wallThickness/2]})
  return union(baseWall, baseFloor)

}

const flipX = baseZ
const flipY = baseY
const flipZ = 10

const flipHoleY = 4
const flipHoleZOffset = flipZ/2 + 2.5
const flipHoleYOffset = 20

function createFlip() {
  const flip = cuboid({size: [flipX, flipY, flipZ], center: [flipX/2, flipY/2, flipZ/2]})
  const flipHoleRight = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 + flipHoleYOffset, flipHoleZOffset]})
  const flipHoleLeft = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 - flipHoleYOffset, flipHoleZOffset]})
  const flipHoles = union(flipHoleRight, flipHoleLeft)
  return subtract(flip, flipHoles)
}

function main () {
  return createBase()
}

module.exports = { main }
