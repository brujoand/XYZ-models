const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { rotateZ } = jscad.transforms
const { degToRad } = jscad.utils

// create main qube
// subtract qube xHole
// subtract bottom clearing
//

xAttachementThickness = 4
yAttachementThickness = 4

const xHoleWidth = 28.8
const xHoleHight = 6.4
const xHoleDepth = 17

const xHoleInsertWidth = 10

const xAttachementDepth = xHoleDepth
const xAttachementWidth = xHoleWidth + xAttachementThickness
const xAttachementHight = xHoleHight + xAttachementThickness

const adxlThickness = 2

const yHoleWidth = xAttachementWidth
const yHoleHeight = 4.2
const yHoleDepth = xHoleDepth - adxlThickness

const yAttachementDepth = xAttachementDepth
const yAttachementWidth = yHoleWidth
const yAttachementHight = yHoleHeight + xAttachementThickness

const adxlScrewRadius = 1.5
const adxlScrewHeight = 50
const adxlScrewWidthOffset = 7.4
const adxlScrewHeightOffset = -6.3

const adxlGutterWidth = 20
const adxlGutterDepth = 2
const adxlGutterHeight = 1

function generateXAttachement() {
  const xAttacmentShell = cuboid({size: [xAttachementWidth, xAttachementDepth, xAttachementHight], center: [0,0,xAttachementHight/2]})
  const xAttachementHole = cuboid({size: [xHoleWidth, xHoleDepth, xHoleHight], center: [0,0,xAttachementHight/2]})

  const xAttachmentInsert = cuboid({size: [xHoleInsertWidth, xHoleDepth, xAttachementThickness], center: [0,0,xAttachementThickness/2 ]})

  return subtract(subtract(xAttacmentShell, xAttachementHole), xAttachmentInsert)

}

function generateYAttachement() {
  const yAttachementShell = cuboid({size: [yAttachementWidth, yAttachementDepth, yAttachementHight], center: [0,0,(yAttachementHight/2 + xAttachementHight) ]})
  const yAttachementHole = cuboid({size: [yHoleWidth, yHoleDepth, yHoleHeight], center: [-yAttachementThickness/2,((adxlThickness/2)+(yAttachementThickness/2)),(yAttachementHight/2 + xAttachementHight)]})

  //maybe wrong height?
  const leftScrewHole = cylinder({radius: adxlScrewRadius, height: adxlScrewHeight, center: [adxlScrewWidthOffset,adxlScrewHeightOffset,0], segments: 12})
  const rightScrewHole = cylinder({radius: adxlScrewRadius, height: adxlScrewHeight, center: [-adxlScrewWidthOffset,adxlScrewHeightOffset,0], segments: 12})

  const yAttacehment = subtract(yAttachementShell, yAttachementHole)
  const adxlGutter = cuboid({size: [adxlGutterWidth, adxlGutterDepth, adxlGutterHeight], center: [0,5.7,(xAttachementHight+yAttachementHight)-adxlGutterHeight/2 ]})

  return subtract(subtract(subtract(yAttacehment, leftScrewHole), rightScrewHole), adxlGutter)

}

function main (){
  const xAttachement = generateXAttachement()
  const yAttachement = generateYAttachement()
  return union(xAttachement, yAttachement)

}

module.exports = { main }
