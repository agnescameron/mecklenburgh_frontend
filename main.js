import SVG from './assets/svg.min.js'
import $ from './assets/jquery.min.js'

let svgs = []
const draw = SVG().addTo('#park').size(800, 650)

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index);
	}
}

async function drawPlant(plant, index) {
	svgs[index] = draw.circle(Number(plant.radius))
		.move(Number(plant.x_pos), Number(plant.y_pos))
		.attr({ fill: 'none', stroke: "black" })
		.data('info', plant.description)
		.click( function() { console.log(this.data('info')) })
}

async function redraw_park(park) {
	svgs.forEach(svg => { svg.remove() })
	await asyncForEach(park.plants, drawPlant)
}

async function park_listener() {
	const res = await fetch('http://localhost:8888/park')
	const park = await res.json()
	await redraw_park(park)
}

$( document ).ready( function() {
	// var bed  = draw.use('elementId', 'ed.svg')
	// var bed  = draw.use('elementId', 'path/to/file.svg')

	park_listener().then( () => {
		window.setInterval( function() {
			park_listener()
		}, 1000)
	});
});