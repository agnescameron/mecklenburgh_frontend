import SVG from './assets/svg.min.js'
import $ from './assets/jquery.min.js'

let svgs = []
let today
const draw = SVG().addTo('#park').size(800, 650)

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index);
	}
}

async function drawTree(tree, index) {
	svgs[index] = draw.circle(Number(tree.radius))
		.move(Number(tree.x_pos), Number(tree.y_pos))
		.attr({ fill: 'none', stroke: "black" })
		.data('info', tree.description)
		.click( function() { console.log(this.data('info')) })
}

async function update_feed(park) {
	if (today !== park.day){
		today = park.day
		console.log('park', park.day, 'event', park.day_events)
		park.day_events.forEach(event => {
			$('#feed').append(today + ": " + event.text + '<br>')
			$('#feed').scrollTop($("#feed").height())
		})
	}
}

async function redraw_park(park) {
	svgs.forEach(svg => { svg.remove() })
	await asyncForEach(park.trees, drawTree)
}

async function park_listener() {
	const res = await fetch('http://localhost:8888/park')
	const park = await res.json()
	await update_feed(park)
	await redraw_park(park)
}

$( document ).ready( function() {
	// var bed  = draw.use('elementId', 'ed.svg')
	// var bed  = draw.use('elementId', 'path/to/file.svg')

	park_listener().then( () => {
		window.setInterval( function() {
			park_listener()
		}, 200)
	});
});