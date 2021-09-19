import SVG from './assets/svg.min.js'
import $ from './assets/jquery.min.js'

// const draw = SVG().addTo('#park').size(2100, 1650)
let trees = []
	const draw = SVG().addTo('#park').size(800, 650)

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index);
  }
}

async function drawPlant(plant, index) {
	trees[index] = draw.circle(Number(plant.radius)).move(Number(plant.x_pos), Number(plant.y_pos))
			.attr({ fill: 'none', stroke: "black" })
}

async function redraw_park(park) {
	await asyncForEach(park.plants, drawPlant)


	// park.plants.forEach( tree => { 
	// 	console.log(tree.radius, tree.x_pos, tree.y_pos);
	// 	;
	// } )
		
}

async function park_listener() {
  const res = await fetch('http://localhost:8888/park')
  const park = await res.json()
  await redraw_park(park)
}

window.setInterval( function() {
  park_listener()
}, 3000)
