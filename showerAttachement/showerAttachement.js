
const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, sphere, cuboid } = jscad.primitives
const { rotateY, translate } = jscad.transforms
const { degToRad } = jscad.utils

const smallHandleDia = 21
const largeHandleDia = 24
const cableSlitWidth = largeHandleDia * 0.7

const largeHandleLowestPoint = 16.5
const outerCylinderDia = 40
const sphereDia = outerCylinderDia
const cylinderHeight = largeHandleDia/2 + largeHandleLowestPoint
const innerCylinderDia = 37.7
const cylinderGap = 2.6

const lowerScrewDia = 9.5
const upperScrewDia = 13.5
const screwHeight = cylinderHeight / 2

function generateBaseStructure() {
  const outerCylinder = cylinder({radius: outerCylinderDia/2, height: cylinderHeight, center: [0,0,0], segments: 40})
  const innerCylinder = cylinder({radius: innerCylinderDia/2, height: cylinderHeight, center: [0,0,-cylinderGap], segments: 40})
  const baseCylinder = union(outerCylinder, innerCylinder)
  const topSphere = sphere({radius: sphereDia / 2, center: [0,0, cylinderHeight-(largeHandleDia/2)-1]})
  return union(baseCylinder, topSphere)
}

function generateScrewHoles() {
  const lowerScrew = cylinder({radius: lowerScrewDia/2, height: screwHeight, center: [0,0,-cylinderGap-7.5], segments: 20})
  const upperScrew = cylinder({radius: upperScrewDia/2, height: screwHeight, center: [0,0,screwHeight-cylinderGap-7.5], segments: 20})
  return union(lowerScrew, upperScrew)
}

function generateShowerHandle() {
  const smallHandle = cylinder({radius: smallHandleDia/2, height: outerCylinderDia/2, center: [0,0,outerCylinderDia/2], segments: 20})
  const largeHandle = cylinder({radius: largeHandleDia/2, height: outerCylinderDia/2, center: [0,0,0], segments: 20})
  const handle = union(smallHandle, largeHandle)
  const handleAngle  = degToRad(90)
  return translate([-10, 0, cylinderHeight-(largeHandleDia/2)], rotateY(handleAngle, handle))

}

function generatCableSlit() {
  return cableSlit = cuboid({size: [outerCylinderDia, cableSlitWidth, outerCylinderDia], center: [0,0,outerCylinderDia*0.8]})
}


function main() {
  const base = generateBaseStructure()
  const screwHoles = generateScrewHoles()
  const screwedBase = subtract(base, screwHoles)
  const showerHandle = generateShowerHandle()
  const cableSlit = generatCableSlit()
  return subtract(subtract(screwedBase, showerHandle), cableSlit)
}

module.exports = { main }
