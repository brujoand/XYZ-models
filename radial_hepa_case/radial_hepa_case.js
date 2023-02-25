const jscad = require('@jscad/modeling')
const { union, subtract } = jscad.booleans
const { cylinder, cuboid } = jscad.primitives
const { center, rotateY } = jscad.transforms
const { degToRad } = jscad.utils

const hex_radius=10
const grill_thickness=3

const plate_width=135
const plate_depth=120
const plate_height=3

const screw_brim_width=10

function hex_plate(plate) {
  const hex_hole = cylinder({radius: hex_radius - (grill_thickness/2), height: plate_height, segments: 6})
  var hexer = plate
  const hex_width = plate_width - screw_brim_width - (hex_radius *2)
  const hex_depth = plate_depth - screw_brim_width - (hex_radius *2)

  for (let i = -(hex_width/2); i < hex_width/2; i = i + (0.8*hex_radius) + (hex_radius*2)) {
    var line_number=0
    for (let y = -(hex_depth/2); y < hex_depth/2; y = y + (hex_radius) - (0.2 * hex_radius)) {
      if (line_number % 2 === 0){
        offset=hex_radius + (0.4 * hex_radius)
      } else {
        offset=0
      }
      const hex = center({relativeTo: [i+offset, y, plate_height/2]}, hex_hole)
      hexer = subtract(hexer, hex)
      line_number++
    }
  }

  // return subtract(plate, hexer)
  return hexer
}


function generate_grill_plate() {
  const plate = cuboid({size: [plate_width, plate_depth, plate_height], center: [0,0,plate_height/2]})
  const hexed_plate = hex_plate(plate)
  return hexed_plate
}



function main (){
  return generate_grill_plate()

}

module.exports = { main }
