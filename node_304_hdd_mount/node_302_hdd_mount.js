const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cuboid, polygon } = jscad.primitives
const { rotateX, translateY } = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries

const baseX = 185
const baseY = 66
const baseZ = 02
const baseScrewY = baseY / 2
const baseScrewX = baseX - 5
const baseScrewRad = 2

function createBase() {
  const base = cuboid({size: [baseX, baseY, baseZ], center: [baseX/2, baseY/2, baseZ/2]})
  const baseScrew = cylinder({height: baseZ, radius: baseScrewRad, center: [baseScrewX, baseScrewY, baseZ/2]})
  return subtract(base, baseScrew)
}

const flipX = baseZ
const flipY = baseY
const flipZ = 10

const flipHoleY = 5
const flipHoleZOffset = flipZ/2 + 2.5
const flipHoleYOffset = 20

function createFlip() {
  const flip = cuboid({size: [flipX, flipY, flipZ], center: [flipX/2, flipY/2, flipZ/2]})
  const flipHoleRight = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 + flipHoleYOffset, flipHoleZOffset]})
  const flipHoleLeft = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 - flipHoleYOffset, flipHoleZOffset]})
  const flipHoles = union(flipHoleRight, flipHoleLeft)
  return subtract(flip, flipHoles)
}

const wingPreOffset = flipX + 17
const wingPostOffset = 9
const wingEndPreOffset = 50
const wingEndPostOffset = 65
const wingX = baseX - wingPreOffset - wingPostOffset
const wingY = baseZ
const wingZ = 106
const wingRimZ = 8


function createWingBase() {
  const wingCoordinates = [
    [wingPreOffset,baseZ],
    [baseX - wingPreOffset, baseZ],
    [baseX - wingPreOffset, baseZ + wingRimZ],
    [baseX - wingEndPostOffset, wingZ],
    [wingEndPreOffset, wingZ],
    [wingPreOffset + 8 , baseZ + wingRimZ + 2],
    [wingPreOffset, baseZ + wingRimZ]
  ]
  const polyWing = polygon({ points: [wingCoordinates] })

  const polyhedronWing = extrudeLinear({height: baseZ}, polyWing)

  var wingBase = polyhedronWing

  const screwBottomZ = 5.5
  const screwTopZ = screwBottomZ + 95
  const screwCoordinates = [
    [60.5, screwBottomZ], [104.5, screwBottomZ], [136.5, screwBottomZ],
    [60.5, screwTopZ], [104.5, screwTopZ]
  ]

  screwCoordinates.forEach((screwCoord) => {
    const screw = cylinder({height: baseZ, radius: baseScrewRad , center: [screwCoord[0], screwCoord[1], baseZ/2]})
    wingBase = subtract(wingBase, screw)
  })

  const wingAngle = degToRad(90)
  const bottomWing = translateY(baseZ, rotateX(wingAngle, wingBase))
  const topWing = translateY(baseY - baseZ , bottomWing)
  return union(bottomWing, topWing)
}


function main (){
  return colorize(colorNameToRgb('red'), union(union(createBase(), createFlip()), createWingBase()))
}

module.exports = { main }
