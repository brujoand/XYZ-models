const jscad = require('@jscad/modeling')
const { colorize, colorNameToRgb } = require('@jscad/modeling').colors
const { union, subtract, scission} = jscad.booleans
const { cylinder, cylinderElliptic, circle, cuboid, roundedCuboid, polygon } = jscad.primitives
const { rotateX, rotateY, translateX, translateY, translateZ, center, translate} = jscad.transforms
const { degToRad } = jscad.utils
const { extrudeLinear } = jscad.extrusions
const { poly3, geom3 } = jscad.geometries
const { vectorChar, vectorText } = require('@jscad/modeling').text
const { hullChain } = jscad.hulls


const unitWidth = 42
const unitDepth = 42

const lowerProfileWidth = 2.85
const lowerProfileHeight = 0.7
const lowerProfileAngle = 45
const centerProfileWidth = 1.8
const centerProfileHeight = 1.8
const upperProfileWidth = 1.8
const upperProfileHeight = 2.15
const upperProfileAngle = 45
const profileHeight = lowerProfileHeight + centerProfileHeight + upperProfileHeight
const profileFillet = 0.4


function createBasePlate(){
  const baseBlock = roundedCuboid({size: [unitWidth, unitDepth, profileHeight], roundRadius: profileFillet, segments: 16})
  return baseBlock
}


const getParameterDefinitions = () => {
  return [
    {name: 'xCount', caption: 'Number of squares in x direction:', type: 'float', initial: 5},
    {name: 'yCount', caption: 'Number of squares in y direction:', type: 'float', initial: 1},
   ];
}

const main = (params) => {
  return createBasePlate(params.xCount, params.yCount)
}

module.exports = { main }
