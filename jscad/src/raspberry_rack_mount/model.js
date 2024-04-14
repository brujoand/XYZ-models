const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateX, translateY, translateZ, centerZ, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const thickness = 2

const rackWidth = 10
const rackDepth = 10
const rackHeight = 10
const piPlateHeight = 25
const rackScrewRad = 1.7
const rackScrewOffset = 3


const screwRad = 1
const screwHeight = 6
const screwOffset = 3.45
const screwFOffset = 24
const screwBaseRad = 3
const screwBaseHeight = 4

const piDepth = 56
const piWidth = 86
const rackLegWidth = 5
const screwAndOffsetWidth = (screwRad*2) + (screwRad - rackScrewOffset)
const piPlateDepth = piDepth + (rackLegWidth * 2) + (screwAndOffsetWidth * 2) + 8

const ethWidth = 16.1
const ethHeight = 14
const ethPlateOffset = 0.5
const ethWallOffset = 2.4
const usbWidth = 15.1
const usbHeight = 15.8
const usbPlateOffset = 0.8
const usbWallOffseta = 1.7
const ethUsbOffset = 3.10
const usbUsbOffset = 3.01


function createKnob(){
  const shelfBottom = cuboid({size: [piWidth, piDepth, thickness], center: [0, 0, thickness/2]})
  const shelfPlate = cuboid({size: [thickness, piPlateDepth, piPlateHeight], center: [piWidth/2, 0, piPlateHeight/2]})

  const ethBaseOffset = (-piDepth/2)+ethWallOffset
  const ethPort = cuboid({size: [thickness, ethWidth, ethHeight], center: [(piWidth/2),ethBaseOffset+(ethWidth/2), ethHeight/2+ethPlateOffset+thickness+screwBaseHeight]})
  const firstUsbPort = cuboid({size: [thickness, usbHeight, usbHeight], center: [(piWidth/2),ethBaseOffset+ethWidth+ethUsbOffset+(usbWidth/2), usbHeight/2+usbPlateOffset+thickness + screwBaseHeight]})
  const secondUsbPort = translateY(usbUsbOffset + usbWidth, firstUsbPort)

  const LRScrewBase = cylinder({radius: screwBaseRad, height: screwBaseHeight, center: [(-piWidth/2)+screwOffset,(-piDepth/2)+screwOffset,thickness+1], segments: 12})
  const LLScrewBase = translateY(piDepth-(screwOffset*2), LRScrewBase)
  const FLScrewBase = translateX(piWidth-screwFOffset-screwOffset, LLScrewBase)
  const FRScrewBase = translateX(piWidth-screwFOffset-screwOffset, LRScrewBase)
  const screwBase = union(LRScrewBase, LLScrewBase, FLScrewBase, FRScrewBase)

  const LRScrewHole = cylinder({radius: screwRad, height: screwHeight, center: [(-piWidth/2)+screwOffset,(-piDepth/2)+screwOffset,thickness], segments: 12})
  const LLScrewHole = translateY(piDepth-(screwOffset*2), LRScrewHole)
  const FLScrewHole = translateX(piWidth-screwOffset-screwFOffset, LLScrewHole)
  const FRScrewHole = translateX(piWidth-screwFOffset-screwOffset, LRScrewHole)
  const screwHole = union(LRScrewHole, LLScrewHole, FLScrewHole, FRScrewHole)

  const bigSquare = cuboid({size: [piWidth - (screwOffset * 2) - (screwBaseRad * 4), piDepth - (screwOffset * 2) - (screwBaseRad * 4), thickness+screwBaseHeight], center: [0, 0, 0]})
  const smallSquare = cuboid({size: [piDepth * 0.8, piWidth * 0.5, thickness+screwBaseHeight], center: [0, -10, 0]})


  const BLRackScrew = translate(
    [(piWidth/2), (-piPlateDepth/2)+rackScrewOffset, rackScrewOffset],
    rotateY(
      degToRad(90),
      cylinder({radius: rackScrewRad, height: screwHeight, segments: 12})
    ))
  const BRRackScrew = translateY(piPlateDepth - (screwOffset*2), BLRackScrew)
  const TRRackScrew = translateZ(piPlateHeight - (screwOffset*2), BRRackScrew)
  const TLRackScrew = translateZ(piPlateHeight - (screwOffset*2), BLRackScrew)

  const rackScrews = union(BLRackScrew, BRRackScrew, TRRackScrew, TLRackScrew)


  return subtract(union(shelfBottom, shelfPlate, screwBase), ethPort, firstUsbPort, secondUsbPort, screwHole, bigSquare, rackScrews)

}


function main () {
  return union(createKnob())
}

module.exports = { main }
