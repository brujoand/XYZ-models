const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract } = jscad.booleans
const { cylinder, cuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateY, center } = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries

function createHexNegative(width, depth, height, hexRadius, hexThickness, hexBrimWidth) {
  const hexHole = cylinder({radius: hexRadius - (hexThickness/2), height: height, segments: 6})
  var hexer = geom3.create()
  const hexWidth = width - hexBrimWidth - (hexRadius *2)
  const hexDepth = depth - hexBrimWidth - (hexRadius *2)

  for (let i = -(hexWidth/2); i < hexWidth/2; i = i + (0.8*hexRadius) + (hexRadius*2)) {
    var lineNumber=0
    for (let y = -(hexDepth/2); y < hexDepth/2; y = y + (hexRadius) - (0.2 * hexRadius)) {
      if (lineNumber % 2 === 0){
        offset=hexRadius + (0.4 * hexRadius)
      } else {
        offset=0
      }
      const hex = center({relativeTo: [i+offset, y, 0]}, hexHole)
      hexer = union(hexer, hex)
      lineNumber++
    }
  }

  return hexer
}

const baseX = 185
const baseY = 60
const baseZ = 2
const baseScrewY = baseY / 2
const baseScrewX = baseX - 4.8
const baseScrewRad = 2.2

function createBase() {
  const base = cuboid({size: [baseX, baseY, baseZ], center: [baseX/2, baseY/2, baseZ/2]})
  const baseScrew = cylinder({height: baseZ, radius: baseScrewRad, center: [baseScrewX, baseScrewY, baseZ/2]})
  return subtract(base, baseScrew)
}

const flipX = baseZ
const flipY = baseY
const flipZ = 10

const flipHoleY = 4
const flipHoleZOffset = flipZ/2 + 2.5
const flipHoleYOffset = 20

function createFlip() {
  const flip = cuboid({size: [flipX, flipY, flipZ], center: [flipX/2, flipY/2, flipZ/2]})
  const flipHoleRight = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 + flipHoleYOffset, flipHoleZOffset]})
  const flipHoleLeft = cuboid({size: [flipX, flipHoleY, flipZ], center: [flipX/2, baseY/2 - flipHoleYOffset, flipHoleZOffset]})
  const flipHoles = union(flipHoleRight, flipHoleLeft)
  return subtract(flip, flipHoles)
}

const wingPreOffset = flipX + 17
const wingPostOffset = 13
const wingX = baseX - wingPreOffset
const wingY = baseZ
const wingZ = 106
const wingRimZ = 10


function createWingBase() {
  const wingCoordinates = [
    [wingPreOffset,baseZ],
    [baseX - wingPostOffset, baseZ],
    [baseX - wingPostOffset, wingZ],
    [wingPreOffset, wingZ],
    [wingPreOffset, wingZ - wingRimZ],
    [wingPreOffset + 8, wingZ - wingRimZ - 2],
    [wingPreOffset + 8, baseZ + wingRimZ + 2],
    [wingPreOffset, baseZ + wingRimZ]
  ]
  const polyWing = polygon({ points: [wingCoordinates] })

  const polyhedronWing = extrudeLinear({height: wingY}, polyWing)

  var wingBase = polyhedronWing

  const screwBottomZ = 5.5
  const screwTopZ = screwBottomZ + 95
  const screwCoordinates = [
    [63, screwBottomZ], [107, screwBottomZ], [139, screwBottomZ],
    [63, screwTopZ], [107, screwTopZ], [139, screwTopZ]
  ]

  screwCoordinates.forEach((screwCoord) => {
    const screw = cylinder({height: baseZ, radius: baseScrewRad , center: [screwCoord[0], screwCoord[1], baseZ/2]})
    wingBase = subtract(wingBase, screw)
  })

  const hexNegative = createHexNegative(baseX - wingPreOffset - wingPostOffset , wingZ, wingY*2, 8, 4, 15)
  const hexCentered = center({relativeTo: [baseX/2 + wingPreOffset/2 - 4 , baseY/2 + 20, 0]}, hexNegative)
  const hexedWing = subtract(wingBase, hexCentered)

  const wingAngle = degToRad(90)
  const bottomWing = translateY(baseZ, rotateX(wingAngle, hexedWing))
  const topWing = translateY(baseY - baseZ , bottomWing)

  const wingConnectorBottom = cuboid({size: [baseZ, baseY, wingRimZ], center: [(wingPreOffset) + (baseZ/2), baseY/2, (wingRimZ/2) + baseZ]})
  const wingConnectorTop = cuboid({size: [baseZ, baseY, wingRimZ], center: [(wingPreOffset) + (baseZ/2), baseY/2, wingZ - (wingRimZ/2)]})
  const wingConnector = union(wingConnectorBottom, wingConnectorTop)

  return union(union(bottomWing, topWing),wingConnector)
}

const backZ = wingZ
const backX = baseZ
const backY = baseY
const backRim = 20

function createBackWing() {
  const backWing = cuboid({size: [backX, backY, backZ], center: [baseX - wingPostOffset - backX/2, backY/2, backZ/2]})
  const backWingHole = cuboid({size: [backX, backY + 4, backZ - backRim - 4], center: [baseX - wingPostOffset - backX/2, (backY/2), backZ/2]})
  return subtract(backWing, backWingHole)
  //const hexNegative = createHexNegative(backZ, backY, backX, 8, 4, 2)
  //const backAngle = degToRad(90)
  //const backAngled = rotateY(backAngle, hexNegative)
  //const hexCentered = center({relativeTo: [baseX - wingPostOffset - backX/2, backY/2, backZ/2]}, backAngled)
  //return subtract(backWing, hexCentered)
}


function main () {
  return union(union(union(createBase(), createFlip()), createWingBase()), createBackWing())
}

module.exports = { main }
