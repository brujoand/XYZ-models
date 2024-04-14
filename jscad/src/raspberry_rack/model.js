const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission} = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateX, translateY, translateZ, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const thickness = 2

const piPlateHeight = 25
const rackScrewRad = 1.7
const rackScrewOffset = 3


const screwRad = 1
const screwHeight = 6
const screwOffset = 3.45
const screwFOffset = 24
const screwBaseRad = 3
const screwBaseHeight = 4

const rackLegWidth = 5
const screwAndOffsetWidth = (screwRad*2) + (screwRad - rackScrewOffset)

const rackBuffer = 6
const rackWidth = 102 + (rackBuffer*2)
const rackDepth = 89+rackBuffer

const switchWidth = 102
const switchHeight = 29
const chargerWidth = 28
const chargerHeight = 60.5
const chargerDepth = 95.6

const rpiWidth = 60
const rpiHeight = 22.5
const rpiPlateHeight = 25
const rpiPlateWidth = 74
const rpiStackHeight = rpiPlateHeight * 4

const rackHeight = rackBuffer + switchHeight + rackBuffer + rpiStackHeight + rackBuffer

const rpiIoHole = 62
const rpiIoOffset = 22

function createKnob(){
  const solidRack = cuboid({size: [rackWidth, rackDepth, rackHeight], center: [0, 0, 0]})
  const switchHole = union(
    cuboid({size: [switchWidth, rackDepth-rackBuffer, switchHeight], center: [0, (-rackBuffer/2),(-rackHeight/2)+(switchHeight/2)+rackBuffer]}),
    cuboid({size: [switchWidth-rackBuffer, rackDepth, switchHeight-rackBuffer], center: [0, 0,(-rackHeight/2)+(switchHeight/2)+rackBuffer]}),
    cuboid({size: [switchWidth*2, rackDepth-(rackBuffer*2), switchHeight-rackBuffer], center: [0, 0,(-rackHeight/2)+(switchHeight/2)+rackBuffer]}),
  )
  const chargerHole = union(
    cuboid({size: [chargerWidth, chargerDepth-rackBuffer, chargerHeight], center: [(rackWidth/2)-rackBuffer-(chargerWidth/2), (-rackBuffer/2),(-rackHeight/2)+switchHeight+(chargerHeight/2)+(rackBuffer*2)+chargerWidth+rackBuffer]}),
    cuboid({size: [chargerWidth-rackBuffer, rackDepth, chargerHeight-rackBuffer], center: [(rackWidth/2)-rackBuffer-(chargerWidth/2), 0,(-rackHeight/2)+switchHeight+(chargerHeight/2)+(rackBuffer*2)+chargerWidth+rackBuffer]}),
    cuboid({size: [chargerWidth+(rackBuffer*2), chargerDepth-(rackBuffer*2), chargerHeight-rackBuffer], center: [(rackWidth/2)-rackBuffer-(chargerWidth/2), 0,(-rackHeight/2)+switchHeight+(chargerHeight/2)+(rackBuffer*2)+chargerWidth+rackBuffer]}),
  )

  const rpiHole = union(
    cuboid({size: [rpiWidth, rackDepth-rackBuffer, rpiStackHeight], center: [(-rackWidth/2)+rackBuffer+(rpiWidth/2), (-rackBuffer/2),(-rackHeight/2)+(rpiStackHeight/2)+switchHeight+(rackBuffer*2)]}),
    cuboid({size: [rpiWidth, rackDepth-(rackBuffer*2), rpiStackHeight+(rackBuffer*2)], center: [(-rackWidth/2)+rackBuffer+(rpiWidth/2),0,(-rackHeight/2)+(rpiStackHeight/2)+switchHeight+(rackBuffer*2)]}),
    cuboid({size: [rpiWidth-rackBuffer, rackDepth, rpiStackHeight-rackBuffer], center: [(-rackWidth/2)+rackBuffer+(rpiWidth/2), 0,(-rackHeight/2)+(rpiStackHeight/2)+switchHeight+(rackBuffer*2)]}),
    cuboid({size: [rpiWidth+(rackBuffer*3), rackDepth-(rackBuffer*2), rpiStackHeight-rackBuffer], center: [(-rackWidth/2)+rackBuffer+(rpiWidth/2), 0,(-rackHeight/2)+(rpiStackHeight/2)+switchHeight+(rackBuffer*2)]}),
  )

  const cableHole = union(
    cuboid({size: [chargerWidth, rackDepth, chargerWidth], center: [(rackWidth/2)-rackBuffer-(chargerWidth/2), 0,(-rackHeight/2)+(chargerWidth/2)+switchHeight+(rackBuffer*2)]}),
    cuboid({size: [chargerWidth, rackDepth-(rackBuffer*2), chargerWidth], center: [(rackWidth/2)-(rackBuffer*4)-(chargerWidth/2), 0,(-rackHeight/2)+(chargerWidth/2)+switchHeight+(rackBuffer*2)]}),
  )




  // This is old
  const BLRackScrew = center(
    {relativeTo: [(-rackWidth/2)+(rackBuffer/2), (-rackDepth/2)+(screwHeight/2), (-rackHeight/2)+(rackBuffer*2)+switchHeight+screwOffset]},
    rotateX(
      degToRad(90),
      cylinder({radius: rackScrewRad, height: screwHeight, segments: 12})
    ))
  const BRRackScrew = translateX(rpiPlateWidth - (screwOffset*2), BLRackScrew)
  const TRRackScrew = translateZ(rpiPlateHeight - (screwOffset*2), BRRackScrew)
  const TLRackScrew = translateZ(rpiPlateHeight - (screwOffset*2), BLRackScrew)

  const rackScrewOne = union(BLRackScrew, BRRackScrew, TRRackScrew, TLRackScrew)
  const rackScrewTwo = translateZ(rpiPlateHeight, rackScrewOne)
  const rackScrewThree = translateZ(rpiPlateHeight, rackScrewTwo)
  const rackScrewFour = translateZ(rpiPlateHeight, rackScrewThree)
  const rackScrewHoles = union(rackScrewOne, rackScrewTwo, rackScrewThree, rackScrewFour)

  const fullRack = subtract(solidRack,switchHole, chargerHole, rpiHole, cableHole, rackScrewHoles)

  const cutLine = cuboid({size: [rackWidth, 0.1, rackHeight], center: [0,(rackDepth/2)-rackBuffer,0]})
  const shapes = scission(subtract(fullRack, cutLine))
  const frontPlane = translateY((rackBuffer/2), shapes[1])
  const backPlane = translateY(5, subtract(shapes[0], frontPlane))
  return union(backPlane, frontPlane)


}


function main () {
  return union(createKnob())
}

module.exports = { main }
