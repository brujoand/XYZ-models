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
const baseRodRadius = (4.9 + 0.20) /2
const baseRodHeight = 3
const baseRodGrooveCount = 22
const rodRadius = baseRodRadius * 2
const rodHeight = baseRodHeight + 2
const armHeight = 21
const armRadius = baseRodRadius
const armPickRadius = 3/2
const armpickHeight = 12

const screwOuterWidth = 42
const screwInnerWidth = 26.5
const screwOffset = ((screwInnerWidth/2) + (screwOuterWidth/2)) / 2
const screwRadius = 3.2/2
const screwPlateOffset = 15
const screwPlateWidth = screwRadius * 4
const screwPlateDepth = screwOuterWidth + screwRadius
const screwPlateHeight = 2
const plateOffset = 10


const padding = 2
const serveHight = 13.5
const chassiOffset = -10
const holeRadius = 8.5/2
const chassiDepth = serveHight+padding
const holeOffset = 20.5 / 2
const plateWidth = 36.5 + padding
const plateDepth = (holeRadius * 2) + padding

const servoDepth = 24


function createChassi() {
  const topPlate = cuboid({size: [plateWidth, plateDepth, chassiDepth], center: [chassiOffset, 0, chassiDepth/2]})
  const leftHole = cylinder({radius: holeRadius, height: chassiDepth, segments: 24, center: [chassiOffset + holeOffset + holeRadius, 0, chassiDepth/2]})
  const rightHole = cylinder({radius: holeRadius, height: chassiDepth, segments: 24, center: [chassiOffset - holeOffset - holeRadius, 0, chassiDepth/2]})
  const servoBlock = cuboid({size: [25, servoDepth+padding, chassiDepth], center: [chassiOffset, plateDepth/2 + ((servoDepth+padding)/2), chassiDepth/2]})
  const servoHole = cuboid({size: [25, servoDepth, serveHight], center: [chassiOffset, plateDepth/2 + (servoDepth)/2, (chassiDepth/2) - padding]})

  return subtract(union(topPlate, servoBlock), leftHole, rightHole, servoHole)

}


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
  const rodArm = cylinder({radius: baseRodRadius, height: armHeight, segments: 24, center: [0, 0, baseRodHeight + armHeight/2]})
  const pickAngle  = degToRad(90)
  const armPick = translateX(
    armpickHeight / 2, translateZ(
      (baseRodHeight + armHeight) - 0.5 - armRadius/2 ,
      (rotateY(
        pickAngle, cylinder({radius: armPickRadius, height: armpickHeight, segments: 24})
      ))))

  return union(subtract(rod, baseRod), rodArm, armPick)
}


function main () {
 // return union(createRod(), createPlate(), createChassi)
  return createChassi()
}

module.exports = { main }
