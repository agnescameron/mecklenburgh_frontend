import SVG from './assets/svg.min.js'

let draw = SVG().addTo('#park').size(2100, 1650)
let circle = draw.circle(100).move(100, 50).attr({ fill: 'none', stroke: "black" })

async function park_listener() {
  const res = await fetch('http://localhost:8888/park')
  const park = await res.json()

  console.log(park)

}

window.setInterval( function() {
  park_listener()
}, 1000)
