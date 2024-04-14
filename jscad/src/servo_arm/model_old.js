const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission} = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateZ, rotateY, translateX, translateY, translateZ, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

// Adding the error margin 0.4
const baseRodRadius = (5 + 0.20) /2
const baseRodHeight = 3
const baseRodGrooveCount = 22
const baseRodPinRadius = 1.5 / 2
const baseRodPinHeight = baseRodHeight
const rodRadius = baseRodRadius * 2
const rodHeight = 15.5
const forkPlateRadius = 14.5/2
const forkPlateHeight = 2.75
const forkRadius = 2.8 / 2
const forkOffset = 4.60 * 1.3
const forkHeight = 6

const screwOuterWidth = 42
const screwInnerWidth = 26.5
const screwOffset = ((screwInnerWidth/2) + (screwOuterWidth/2)) / 2
const screwRadius = 3.2/2
const screwPlateOffset = 15
const screwPlateWidth = screwRadius * 4
const screwPlateDepth = screwOuterWidth + screwRadius
const screwPlateHeight = 2
const plateOffset = 10

function createPlate() {
  const plate = cuboid({size: [screwPlateWidth, screwPlateDepth, screwPlateHeight], center: [screwPlateOffset, 0, screwPlateHeight/2]})
  const outerBand = cuboid({size: [screwPlateWidth, screwPlateDepth*0.6, screwPlateOffset], center: [screwPlateOffset, 0, screwPlateOffset/2]})
  const innerBand = cuboid({size: [screwPlateWidth, screwPlateDepth*0.5, screwPlateOffset], center: [screwPlateOffset, 0, (screwPlateOffset/2) - 2]})
  const screwHole = cylinder({radius: screwRadius, height: screwPlateHeight, segments: 12, center: [screwPlateOffset, screwOffset, screwPlateHeight/2]})
  const screwHoles = union(screwHole, translateY(-(screwOffset*2), screwHole))

  return subtract(union(plate, outerBand), innerBand, screwHoles)
}

function createRod(){
  const rod = cylinder({radius: rodRadius, height: rodHeight, segments: 24, center: [0, 0, rodHeight/2]})
  const baseRod = cylinder({radius: baseRodRadius, height: baseRodHeight, segments: 11, center: [0, 0, baseRodHeight/2]})
  const baseRodPin = cylinder({radius: baseRodPinRadius, height: baseRodPinHeight, segments: 11, center: [0, 0, baseRodPinHeight/2]})
  const forkPlate = cylinder({radius: forkPlateRadius, height: forkPlateHeight, segments: 24, center: [0, 0, rodHeight]})
  const forkAngle  = degToRad(-5)
  const leftFork = rotateY(forkAngle, cylinder({radius: forkRadius, height: forkHeight, segments: 12, center: [forkOffset, 0, rodHeight+forkPlateHeight]}))
  const mirrorAngle  = degToRad(180)
  const rightFork = rotateZ(mirrorAngle, leftFork)

  return union(subtract(rod, baseRod), forkPlate, leftFork, rightFork)
}


function main () {
  return union(createRod(), createPlate())
}

module.exports = { main }
