import SVG from './assets/svg.min.js'

let draw = SVG().addTo('body').size(300, 300)
let rect = draw.rect(100, 100).attr({ fill: '#f06' })