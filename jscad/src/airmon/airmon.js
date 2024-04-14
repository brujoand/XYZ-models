const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission } = jscad.booleans
const { cylinder, circle, cuboid, polygon, roundedCuboid } = jscad.primitives
const { scale, scaleZ, rotateX, rotateY, rotateZ, translateX, center, translateY, translateZ, mirrorX, mirrorY} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const wallThickness = 2

const perfBoard = {
  width: 60.05,
  depth: 40.05,
  height: 21,
  holeRadius: 1,
  holeOffset: 2,
  pinRadius: 1.6,
  buffer: 2 * 2,
}

const dustSensor = {
  width: 42,
  depth: 41,
  height: 13.5,
  airTopOffset: 4,
  airSideOffset: 1,
}

const cabelSnag = {
  width: 10,
  depth: 20,
  height: perfBoard.height
}

const box = {
  roundRadius: 2,
  segments: 32,
  powerCableRadius: 2,
  topRatio: 0.20,
  lowRatio: 0.80,
  centerBuffer: 8,
  height: perfBoard.height + (wallThickness * 2)
}

const lowShell = {
  width: perfBoard.width + (perfBoard.buffer*2) +  dustSensor.width + (wallThickness * 2) + (box.centerBuffer * 2),
  depth: perfBoard.depth + (perfBoard.buffer*2) + (wallThickness * 2),
  height: box.height * box.lowRatio,
  center: [-75, 0, 0]
}

const topShell = {
  width: perfBoard.width + (perfBoard.buffer*2) +  dustSensor.width + (wallThickness * 2) + (box.centerBuffer * 2),
  depth: perfBoard.depth + (perfBoard.buffer*2) + (wallThickness * 2),
  height: box.height * box.topRatio,
  center: [75, 0, 0]
}


function createLowShell(){
  const lowShellBox = roundedCuboid({size: [lowShell.width, lowShell.depth, lowShell.height * 2], roundRadius: box.roundRadius, center: lowShell.center, segments: box.segments})
  const lowShellBoxHole = roundedCuboid({size: [lowShell.width - (wallThickness * 2), lowShell.depth - (wallThickness * 2), (lowShell.height * 2) - (wallThickness * 2)], roundRadius: box.roundRadius, center: lowShell.center, segments: box.segments})
  const cutbox = translateZ(lowShell.height/2, cuboid({size: [lowShell.width, lowShell.depth, lowShell.height], center: lowShell.center}))
  const airSlith = translateZ(-perfBoard.height/2, cuboid({size: [2, lowShell.depth, dustSensor.height/2 ], center: lowShell.center}))
  const airSlithsLow = union(
    translateX(4, airSlith),
    translateX(8, airSlith),
    translateX(12, airSlith),
    translateX(16, airSlith),
  )
  const airSlithsTop = translateX(-55, airSlithsLow)
  const airSliths = union(airSlithsLow, airSlithsTop)
  return subtract(subtract(lowShellBox, lowShellBoxHole, airSliths), cutbox)
}

function createTopShell(){
  const topShellBox = roundedCuboid({size: [topShell.width, topShell.depth, topShell.height * 2], roundRadius: box.roundRadius, center: topShell.center, segments: box.segments})
  const topShellBoxHole = roundedCuboid({size: [topShell.width - (wallThickness * 2), topShell.depth - (wallThickness * 2), (topShell.height * 2) - (wallThickness * 2)], roundRadius: box.roundRadius, center: topShell.center, segments: box.segments})
  const cutbox = translateZ(topShell.height/2, cuboid({size: [topShell.width, topShell.depth, topShell.height], center: topShell.center}))
  return subtract(subtract(topShellBox, topShellBoxHole), cutbox)
}

function placePins(width, depth, height, radius, offset, holeRadius, baseCenter) {
  const offsetDepth = (depth/2) - offset
  const offsetWidth = (width/2) - offset
  const innsetDepth = -(depth/2) + offset
  const innsetWidth = -(width/2) + offset
  const basePinSkeleton = cylinder({height: height, radius: radius, center: baseCenter})
  const basePinHole = cylinder({height: height, radius: holeRadius, center: baseCenter})
  const basePin = subtract(basePinSkeleton, basePinHole)
  return union (
    translateY(offsetDepth, translateX(offsetWidth, basePin)),
    translateY(innsetDepth, translateX(offsetWidth, basePin)),
    translateY(innsetDepth, translateX(innsetWidth, basePin)),
    translateY(offsetDepth, translateX(innsetWidth, basePin)),
  )
}

function createDustSensorPocket() {
  const dustShell = roundedCuboid({size: [dustSensor.width + (wallThickness*2), lowShell.depth, dustSensor.height + wallThickness], center: lowShell.center, roundRadius: box.roundRadius, segments: box.segments})
  const dustHole = translateX(-wallThickness, cuboid({size: [dustSensor.width + (wallThickness * 2) , dustSensor.depth , dustSensor.height ], center: lowShell.center}))
  const dustHoleInput = translateZ(wallThickness, translateX(-dustSensor.depth/2, dustHole))
  return translateZ(-(lowShell.height - dustSensor.height)/2 - wallThickness, translateX(32 + box.centerBuffer, subtract(dustShell, dustHole, dustHoleInput)))
}

function createDustHoles() {
  const dustHole = cuboid({size: [wallThickness*2 , dustSensor.depth - (dustSensor.airSideOffset * 2) , dustSensor.height - dustSensor.airTopOffset ], center: lowShell.center})
  return dustHole

}

function createScrewPins () {
  const basePinSkeleton = cylinder({height: perfBoard.height, radius: perfBoard.pinRadius, center: lowShell.center})
  const basePinHole = cylinder({height: perfBoard.height, radius: perfBoard.holeRadius, center: lowShell.center})
  const basePin = translateZ(-(perfBoard.height/2) + wallThickness/2,translateX( box.centerBuffer + (((lowShell.width/2) - dustSensor.width)/2), subtract(basePinSkeleton, basePinHole)))
  return union(
    translateY((dustSensor.depth/2 + (perfBoard.holeRadius*2)), basePin),
    translateY(-(dustSensor.depth/2) - (perfBoard.holeRadius*2), basePin)
  )
}

function createScrewHoles () {
  const pinRidge = cylinder({height: (perfBoard.height * box.topRatio)/2, radius: perfBoard.pinRadius, center: topShell.center})
  const pinHole = cylinder({height: perfBoard.height * box.topRatio, radius: perfBoard.holeRadius, center: topShell.center})
  const basePin = translateZ(-4,translateX( - box.centerBuffer - (((lowShell.width/2) - dustSensor.width)/2), union(pinRidge, pinHole)))
  return union(
    translateY((dustSensor.depth/2 + (perfBoard.holeRadius*2)), basePin),
    translateY(-(dustSensor.depth/2) - (perfBoard.holeRadius*2), basePin)
  )
}


function createBox() {
  const pins = translateX((-perfBoard.width / 2) + wallThickness + perfBoard.buffer, translateZ((-perfBoard.height) + perfBoard.buffer, placePins(
    perfBoard.width,
    perfBoard.depth,
    perfBoard.buffer,
    perfBoard.pinRadius,
    perfBoard.holeOffset,
    perfBoard.holeRadius,
    lowShell.center
  )))
  const dustPocket = translateX(((perfBoard.width - dustSensor.width)/2)-(box.powerCableRadius*4),translateZ((-lowShell.height/2) + (wallThickness*2), createDustSensorPocket()))
  const powerCableTop = rotateY(degToRad(90),cylinder({height: 50, radius: box.powerCableRadius}))
  const powerCableLow = translateZ(-0.5, powerCableTop)
  const powerCable = union(powerCableTop, powerCableLow)
  const dustHole = translateZ(-perfBoard.height/2 - wallThickness, translateX(dustSensor.width + box.centerBuffer + 12 + 2, createDustHoles()))
  const topShellBox = createTopShell()
  const lowShellBox = createLowShell()
  const increase = 1.5
  const factor = (lowShell.width + increase) / lowShell.width
  const temp = (lowShell.width * factor) - lowShell.width
  const depthFactor = (temp + lowShell.depth) / lowShell.depth

  const innerLip = translateZ(1, center({relativeTo: lowShell.center}, rotateX(degToRad(180), scale([factor, depthFactor, 1], topShellBox))))

  const increaseY = -1.5
  const factorY = (lowShell.width + increaseY) / lowShell.width
  const tempY = (lowShell.width * factorY) - lowShell.width
  const depthFactorY = (tempY + lowShell.depth) / lowShell.depth

  const outerLip = translateZ(1, center({relativeTo: topShell.center}, rotateX(degToRad(180), scale([factorY, depthFactorY, 1], topShellBox))))

  lowShellBoxYeah = union(lowShellBox, pins, dustPocket, createScrewPins()),


  outerFuckingBox = subtract(topShellBox, outerLip)
  innerFuckingBox = translateZ(1, subtract(lowShellBoxYeah, center({relativeTo: lowShell.center}, rotateX(degToRad(180), outerFuckingBox))))

  return subtract(
          union(
            outerFuckingBox,
            innerFuckingBox,
          ),
          powerCable,
          dustHole,
          createScrewHoles(),
        )
}

function main () {
  return createBox()
}

module.exports = { main }
