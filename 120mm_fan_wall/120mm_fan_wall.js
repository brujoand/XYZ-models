const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { rotateZ } = jscad.transforms
const { degToRad } = jscad.utils
const { center, rotateY } = jscad.transforms


const mainThickness = 3.28
const mainWidth = 219 - mainThickness
const mainDepth = 219 - mainThickness
const mainHeight = 3
const fanWidth = 121 + (mainThickness)
const fanDepth = 121 + (mainThickness)
const fanHeight = 3
const wallHeight = (mainThickness/2) + (fanHeight/2) + 26


const cableWidth = 10
const cabledepth = mainDepth + (mainThickness * 2)
const cableHeight = wallHeight / 4

const hex_radius=15
const grill_thickness=3

const screw_brim_width=0

function hex_plate(plate) {
  const hex_hole = cylinder({radius: hex_radius - (grill_thickness/2), height: fanHeight, segments: 6})
  var hexer = plate
  const hex_width = fanWidth * 2
  const hex_depth = fanDepth * 2

  for (let i = -(hex_width/2); i < hex_width/2; i = i + (0.8*hex_radius) + (hex_radius*2)) {
    var line_number=0
    for (let y = -(hex_depth/2); y < hex_depth/2; y = y + (hex_radius) - (0.2 * hex_radius)) {
      if (line_number % 2 === 0){
        offset=hex_radius + (0.4 * hex_radius)
      } else {
        offset=0
      }
      const hex = center({relativeTo: [i+offset, y, fanHeight/2]}, hex_hole)
      hexer = subtract(hexer, hex)
      line_number++
    }
  }

  // return subtract(plate, hexer)
  return hexer
}


function generate_grill_plate() {
  const plate = cuboid({size: [fanWidth, fanDepth, fanHeight], center: [-20,0,fanHeight/2]})
  const hexed_plate = hex_plate(plate)
  const reversed = subtract(plate, hexed_plate)
  return reversed
}

function generateMain() {
  const mainBody = cuboid({size: [mainWidth, mainDepth, mainHeight], center: [0,0,mainHeight/2]})
  const fanBody = generate_grill_plate()

  return subtract(mainBody, fanBody)
}

function generate_wall(x,y) {
}

function add_walls(floor) {

  var mainBody = floor

  horizontal_heights = [ mainDepth/2, -mainDepth/2, fanDepth/2, -fanDepth/2 ]
  vertical_heights = [ mainWidth/2, -mainWidth/2, (fanDepth/2)-20, (-fanDepth/2)-20]

  for (const height of horizontal_heights) {
    const wall = cuboid({size: [mainWidth + mainThickness, mainThickness, wallHeight], center: [0,parseFloat(height),wallHeight/2]})
    mainBody = union(mainBody, wall)
  }

  for (const height of vertical_heights) {
    const wall = cuboid({size: [mainThickness, mainDepth + mainThickness, wallHeight], center: [parseFloat(height),0,wallHeight/2]})
    mainBody = union(mainBody, wall)
  }


  const cableRun = cuboid({size: [cableWidth, cabledepth, cableHeight], center: [-20,0,cableHeight*2]})

  mainBody = subtract(mainBody, cableRun)

  return mainBody

}


function main (){

  const floor = generateMain()
  return add_walls(floor)
}

module.exports = { main }
