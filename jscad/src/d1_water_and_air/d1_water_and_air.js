const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission } = jscad.booleans
const { cylinder, circle, cuboid, polygon, roundedCuboid } = jscad.primitives
const { scale, rotateX, rotateY, rotateZ, translateX, center, translateY, translate, mirrorX, mirrorY} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls

const basePinHeight = 5
const basePinRad = 1.65
const basePinHoleRad = 0.94
const floorScrewRad = 2

const d1Width = 25.4
const d1Depth = 34.4
const d1Height = 4.36
const d1PinDistance = 20.56
const d1CableWidth = 13
const d1CableHeight = 7
const d1CableOffset = 2.5

const buffer = 5

const wSensorWidth = 16.4
const wSensorDepth = 20.25
const wSensorHeight = 13
const wSensorPinDistance = 12.58
const wSensorCableRad = 2

const aSensorWidth = 10.6
const aSensorDepth = 13.3
const aSensorPinOffset = 3.83

const boxGap = 20

const boxWidth = wSensorWidth + aSensorWidth + (buffer * 3) + (floorScrewRad * 2)
const boxDepth = d1Depth + wSensorDepth + (buffer * 4)
const boxHeight = wSensorHeight + (buffer * 2) + basePinHeight + boxGap


function createBase(){
  const bottomBox = roundedCuboid({size: [boxWidth, boxDepth, boxHeight], roundRadius: 3, center: [0, 0, 0], segments: 32})
  const bottomBoxHole = roundedCuboid({size: [boxWidth-buffer, boxDepth-buffer, boxHeight-buffer], roundRadius: 3, center: [0, 0, 0], segments: 32})
  const holedBox = subtract(bottomBox, bottomBoxHole)
  const cutBox = cuboid({size: [boxWidth, boxDepth, boxGap], center: [0,0,10]})
  const halfBox = subtract(holedBox, cutBox)
  return halfBox

}

function createBasePins() {
  const basePinShell = cylinder({height: basePinHeight, radius: basePinRad})
  const basePinHole = cylinder({height: basePinHeight, radius: basePinHoleRad})
  const basePin = subtract(basePinShell, basePinHole)
  const d1Pins = union(
    center({relativeTo: [-d1PinDistance/2, (-boxDepth/2)+d1Depth+(buffer), (-boxHeight/2) + buffer]}, basePin),
    center({relativeTo: [d1PinDistance/2, (-boxDepth/2)+d1Depth+(buffer), (-boxHeight/2) + buffer]}, basePin)
  )

  const wSensorPins = union(
    center({relativeTo: [(-boxWidth/2)+buffer, (-boxDepth/2)+(buffer*2)+d1Depth+buffer, (-boxHeight/2) + buffer]}, basePin),
    center({relativeTo: [(-boxWidth/2)+buffer+wSensorPinDistance, (-boxDepth/2)+(buffer*2)+d1Depth+buffer, (-boxHeight/2) + buffer]}, basePin)
  )

  const aSensorPins = center({relativeTo: [(boxWidth/2)-buffer, (-boxDepth/2)+(buffer*2)+d1Depth+buffer, (-boxHeight/2) + buffer]}, basePin)

  return union(d1Pins, wSensorPins, aSensorPins)

}

function createScrewholes() {
  const baseLidScrews = union(
    cylinder({height: boxHeight, radius: basePinHoleRad, center: [(-boxWidth/2)+(buffer/2)-0.2, (-boxDepth/2)+(buffer/2)-0.2, boxHeight/4]}),
    cylinder({height: boxHeight, radius: basePinHoleRad, center: [(boxWidth/2)+(-buffer/2)+0.2, (boxDepth/2)-(buffer/2)+0.2, boxHeight/4]}),
    cylinder({height: boxHeight, radius: basePinHoleRad, center: [(-boxWidth/2)+(buffer/2)-0.2, (boxDepth/2)-(buffer/2)+0.2, boxHeight/4]}),
    cylinder({height: boxHeight, radius: basePinHoleRad, center: [(boxWidth/2)+(-buffer/2)+0.2, (-boxDepth/2)+(buffer/2)-0.2, boxHeight/4]}),
  )
  const baseLidScrewRims = union(
    cylinder({height: 2, radius: basePinHoleRad*2, center: [(-boxWidth/2)+(buffer/2)-0.2, (-boxDepth/2)+(buffer/2)-0.2, boxHeight/2]}),
    cylinder({height: 2, radius: basePinHoleRad*2, center: [(boxWidth/2)+(-buffer/2)+0.2, (boxDepth/2)-(buffer/2)+0.2, boxHeight/2]}),
    cylinder({height: 2, radius: basePinHoleRad*2, center: [(-boxWidth/2)+(buffer/2)-0.2, (boxDepth/2)-(buffer/2)+0.2, boxHeight/2]}),
    cylinder({height: 2, radius: basePinHoleRad*2, center: [(boxWidth/2)+(-buffer/2)+0.2, (-boxDepth/2)+(buffer/2)-0.2, boxHeight/2]}),
  )

  const floorScrews = union(
    cylinder({height: buffer, radius: floorScrewRad, center: [(-boxWidth/2)+(buffer*1.5), (-boxDepth/2)+(buffer*2), -boxHeight/2]}),
    cylinder({height: buffer, radius: floorScrewRad, center: [(boxWidth/2)-(buffer*1.5), (-boxDepth/2)+(buffer*2), -boxHeight/2]}),
  )


  return union(baseLidScrews, baseLidScrewRims, floorScrews)

}

function createAiring() {
  const slits = union(
    cuboid({size: [5, 1, boxHeight], center: [(boxWidth/2)-buffer-(10/2), (-boxDepth/2)+(buffer*2)+d1Depth+(buffer*2),buffer]}),
    cuboid({size: [5, 1, boxHeight], center: [(boxWidth/2)-buffer-(10/2), (-boxDepth/2)+(buffer*2)+d1Depth+(buffer*3),buffer]}),
    cuboid({size: [5, 1, boxHeight], center: [(boxWidth/2)-buffer-(10/2), (-boxDepth/2)+(buffer*2)+d1Depth+(buffer*4),buffer]}),
  )

  return union(mirrorX(mirrorY(slits)), slits)

}

function createCableholes() {
  const d1Cable = cuboid({size: [d1CableWidth, buffer, d1CableHeight], center: [0, (-boxDepth/2)+(buffer/4),(-boxHeight/2)-(d1CableHeight/2)+buffer+basePinHeight+d1CableOffset]})
  const wSensorCable = translate([0,(boxDepth/2)-(buffer/4), (-boxHeight/2)+buffer+basePinHeight+5],rotateX(degToRad(90), cylinder({height: buffer, radius: wSensorCableRad})))

  return union(d1Cable, wSensorCable)

}

function main () {
  return subtract(union(createBase(), createBasePins()), createScrewholes(), createAiring(), createCableholes())
}

module.exports = { main }
