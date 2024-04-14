const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { center, rotateY } = jscad.transforms
const { degToRad } = jscad.utils

xAttachementThickness = 4
yAttachementThickness = 4


const xAttachementDepth = 18.4
const xAttachementWidth = 2
const xAttachementHeight = 15

const yHoleWidth = 21
const yHoleHeight = 4
const yHoleDepth = xAttachementDepth

const adxlScrewRadius = 1.5
const adxlScrewWidthOffset = 7.45

const yAttachementDepth = xAttachementDepth + (adxlScrewRadius * 2) + 1
const adxlScrewDepthOffset = - yAttachementDepth/2 + 0.95 + adxlScrewRadius
const yAttachementWidth = yHoleWidth
const yAttachementHeight = yHoleHeight + xAttachementThickness

const adxlScrewHeight = yAttachementHeight - yAttachementThickness

const adxlGutterWidth = 19
const adxlGutterDepth = 1.6
const adxlGutterHeight = 1

const xScrewRadius = 1.65
const xScrewRimRadios = 2.75
const xScrewDepthOffset = -7.8
const xScrewHeightOffset = xAttachementHeight - 8.2

function generateXAttachement() {
  const xAttachement = cuboid({size: [xAttachementWidth, xAttachementDepth, xAttachementHeight], center: [(yAttachementWidth/2)-(xAttachementWidth/2),yAttachementThickness/2,xAttachementHeight/2]})
  const xAttachementLever = cuboid({size: [xAttachementWidth, 7, 12], center: [(yAttachementWidth/2)-(xAttachementWidth/2),yAttachementThickness/2+12,xAttachementHeight + 2]})
  const xAttachementSupport = cuboid({size: [yAttachementWidth, xAttachementWidth + xAttachementThickness/2, xAttachementHeight], center: [0,(-xAttachementDepth/2),xAttachementHeight/2]})
  const centerXScrewHole = cylinder({radius: xScrewRadius, height: xAttachementWidth, center: [0,0,0], segments: 12})
  const rotatedXScrewHole = rotateY(degToRad(90), centerXScrewHole)
  const xScrewHole = center({relativeTo: [yAttachementWidth/2 + xAttachementWidth/2 - xAttachementThickness/2, xScrewDepthOffset + xAttachementThickness/2 + 1, xScrewHeightOffset]}, rotatedXScrewHole)

  return subtract(union(union(xAttachement, xAttachementSupport), xAttachementLever), xScrewHole)
}

function generateYAttachement() {
  const yAttachementShell = cuboid({size: [yAttachementWidth, yAttachementDepth, yAttachementHeight], center: [0,0,(yAttachementHeight/2 + xAttachementHeight) ]})
  const yAttachementHole = cuboid({size: [yHoleWidth-2, yHoleDepth + (xAttachementThickness*2), yHoleHeight], center: [-xAttachementThickness, 0 ,(yAttachementHeight/2 + xAttachementHeight)]})

  const leftScrewHole = cylinder({radius: adxlScrewRadius, height: adxlScrewHeight, center: [adxlScrewWidthOffset,adxlScrewDepthOffset,xAttachementHeight+(adxlScrewHeight/2)+yAttachementThickness], segments: 12})
  const rightScrewHole = cylinder({radius: adxlScrewRadius, height: adxlScrewHeight, center: [-adxlScrewWidthOffset,adxlScrewDepthOffset,xAttachementHeight+(adxlScrewHeight/2)+yAttachementThickness], segments: 12})

  const yAttacehment = subtract(yAttachementShell, yAttachementHole)
  const adxlGutter = cuboid({size: [adxlGutterWidth, adxlGutterDepth, adxlGutterHeight], center: [0,2.7,(xAttachementHeight+yAttachementHeight)-adxlGutterHeight/2 ]})

  return subtract(subtract(subtract(yAttacehment, leftScrewHole), rightScrewHole), adxlGutter)

}

function main (){
  const xAttachement = generateXAttachement()
  const yAttachement = generateYAttachement()
  return union(xAttachement, yAttachement)

}

module.exports = { main }
