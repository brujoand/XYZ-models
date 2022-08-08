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

const screw_brim_width=20

function hex_plate(plate) {
  const hex_hole = cylinder({radius: hex_radius - (grill_thickness/2), height: plate_height, segments: 6})
  var hexer = plate
  const hex_width = plate_width - screw_brim_width
  const hex_depth = plate_depth - screw_brim_depth
  for (let i = 0; i < plate_depth; i = i + 8 + (hex_radius*2)) {
    var line_number=0
    for (let y = 0; y < hex_depth; y = y + (hex_radius) - 2) {
      if (line_number % 2 === 0){
        offset=hex_radius + 4 + (screw_brim_width/2)
      } else {
        offset=(screw_brim_width/2)
      }
      const hex = center({relativeTo: [i-(plate_width/2)-offset, y-(plate_depth/2)-hex_radius, plate_height/2]}, hex_hole)
      hexer = subtract(hexer, hex)
      line_number++
    }
  }
  const hex_placeholder = cuboid({size: [plate_width - screw_brim_width, plate_depth - screw_brim_width, plate_height], center: [0,0,plate_height/2]})

  return union(subtract(plate, hex_placeholder), hexer)
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
