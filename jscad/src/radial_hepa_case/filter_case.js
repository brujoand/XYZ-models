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
const fanSlotHeight = 34 + wallThickness

const fanBoxWidth = fanSlotWidth + (wallThickness * 2)
const fanBoxDepth = fanSlotDepth + (wallThickness * 2)
const fanBoxHeight = fanSlotHeight + (wallThickness * 2) - wallThickness


// Lag hul til strømledning
// Lag hexagon plate for kullfilter
// lag feste til hexagon  plate
// Lag hul til skruer for å feste rim


const filterBoxWidth = 154
const filterBoxDepth = 124
const filterToFanbuffer = 20
const filterBoxHeight = 25 + filterToFanbuffer

const rimSize = 30
const rimBoxWidth = filterBoxWidth + rimSize
const rimBoxDepth = filterBoxDepth + rimSize
const rimBoxHeight = wallThickness

const powerSlotWidth = 10
const powerSlotDepth = 8
const powerSlotHeight = wallThickness * 4

const filterSlotWidth = 138.1
const filterSlotDepth = 109.1
const filterSlotHeight = filterBoxHeight + (wallThickness)

const exhaustHeight = fanSlotHeight - wallThickness
const exhaustWidth = 58
const exhaustDepth = wallThickness * 2

const airSlotRadius = 50


function generateFanBox() {
  const rimBox = cuboid({size: [rimBoxWidth, rimBoxDepth, rimBoxHeight], center: [0,0,(rimBoxHeight/2)]})
  const filterBox = cuboid({size: [filterBoxWidth, filterBoxDepth, filterBoxHeight], center: [0,0,(filterBoxHeight/2)]})

  const filterSlot = cuboid({size: [filterSlotWidth, filterSlotDepth, filterSlotHeight], center: [0,0,(filterBoxHeight/2) + wallThickness ]})
  const airSlot = cylinder({radius: airSlotRadius, height: wallThickness, center: [0,0,0], segments: 32})


  var screwHoles;

  for (let i = 1; i <= 4; i++) {
    const depth=(rimBoxDepth/4)*i - (rimBoxDepth/2) - (rimSize/4) - 12
    rightHole = cylinder({radius: screwRadius, height: screwHeight, center: [rimBoxWidth/2-(rimSize/4),depth,0], segments: 12})
    leftHole = cylinder({radius: screwRadius, height: screwHeight, center: [(-rimBoxWidth/2)+(rimSize/4),depth,0], segments: 12})
    if (screwHoles) {
      screwHoles = union(screwHoles, rightHole, leftHole)
    } else {
      screwHoles = union(rightHole, leftHole)
    }
  }

  for (let i = 1; i <= 4; i++) {
    const width=(rimBoxWidth/4)*i - (rimBoxWidth/2) - (rimSize/4) - 12
    rightHole = cylinder({radius: screwRadius, height: screwHeight, center: [width, rimBoxDepth/2-(rimSize/4),0], segments: 12})
    leftHole = cylinder({radius: screwRadius, height: screwHeight, center: [width, (-rimBoxDepth/2)+(rimSize/4),0], segments: 12})
    if (screwHoles) {
      screwHoles = union(screwHoles, rightHole, leftHole)
    } else {
      screwHoles = union(rightHole, leftHole)
    }
  }


  for (let i = 1; i <= 2; i++) {
    const depth = ((fanBoxDepth/1.5)*i) - fanBoxDepth
    rightHole = cylinder({radius: screwRadius, height: screwHeight, center: [(fanBoxDepth/2)+2,depth,0], segments: 12})
    leftHole = cylinder({radius: screwRadius, height: screwHeight, center: [(-fanBoxDepth/2)-2,depth,0], segments: 12})
    if (screwHoles) {
      screwHoles = union(screwHoles, rightHole, leftHole)
    } else {
      screwHoles = union(rightHole, leftHole)
    }
  }

  const box = union(rimBox, filterBox)
  const slot = union(filterSlot, screwHoles, airSlot)

  return subtract(box, slot)
}

function main (){
  return generateFanBox()
}

module.exports = { main }
