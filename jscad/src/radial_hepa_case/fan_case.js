const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { center, rotateY } = jscad.transforms
const { degToRad } = jscad.utils

const screwRadius = 2.5
const screwHeight = 50
const wallThickness = 2
const fanSlotWidth = 120
const fanSlotDepth = 120
const fanSlotHeight = 34

const fanBoxWidthPadding = 12
const fanBoxWidth = fanSlotWidth + (wallThickness * 2)
const fanBoxDepth = fanSlotDepth + (wallThickness * 2)
const fanBoxHeight = fanSlotHeight + wallThickness


const powerSlotWidth = 10
const powerSlotDepth = 8
const powerSlotHeight = wallThickness * 4

const exhaustHeight = fanSlotHeight - wallThickness
const exhaustWidth = 58
const exhaustDepth = wallThickness * 2



function generateFanBox() {
  const fanBox = cuboid({size: [fanBoxWidth+fanBoxWidthPadding, fanBoxDepth, fanBoxHeight], center: [0,0,(fanBoxHeight/2)]})

  const fanSlot = cuboid({size: [fanSlotWidth, fanSlotDepth, fanSlotHeight], center: [0,0,(fanBoxHeight/2) + (wallThickness)]})
  const exhaustSlot = cuboid({size: [exhaustWidth, exhaustDepth, exhaustHeight], center: [(fanBoxWidth/2)-(exhaustWidth/2)-wallThickness,(fanBoxDepth/2)-(exhaustDepth/2),(exhaustHeight/2)+(wallThickness*2)]})
  const powerSlot = cuboid({size: [powerSlotWidth, powerSlotDepth, powerSlotHeight], center: [50,-40,wallThickness+1]})

  var screwHoles;

  for (let i = 1; i <= 2; i++) {
    const depth = ((fanBoxDepth/1.5)*i) - fanBoxDepth
    rightHole = cylinder({radius: screwRadius, height: screwHeight, center: [(fanBoxDepth/2)+2,depth,screwHeight], segments: 12})
    leftHole = cylinder({radius: screwRadius, height: screwHeight, center: [(-fanBoxDepth/2)-2,depth,screwHeight], segments: 12})
    if (screwHoles) {
      screwHoles = union(screwHoles, rightHole, leftHole)
    } else {
      screwHoles = union(rightHole, leftHole)
    }
  }

  const fanScrewOffset = 10

  const topLeft = cylinder({radius: screwRadius, height: screwHeight, center: [(-fanBoxWidth/2)+fanScrewOffset,(fanBoxDepth/2)-fanScrewOffset,0], segments: 12})
  const bottomLeft = cylinder({radius: screwRadius, height: screwHeight, center: [(-fanBoxWidth/2)+fanScrewOffset,(-fanBoxDepth/2)+fanScrewOffset,0], segments: 12})
  const bottomRight = cylinder({radius: screwRadius, height: screwHeight, center: [(fanBoxWidth/2)-fanScrewOffset,(-fanBoxDepth/2)+fanScrewOffset,0], segments: 12})

  screwHoles=union(screwHoles, topLeft, bottomLeft, bottomRight)

  const slot = union(fanSlot, exhaustSlot, powerSlot, screwHoles)

  return subtract(fanBox, slot)
}

function main (){
  return generateFanBox()
}

module.exports = { main }
