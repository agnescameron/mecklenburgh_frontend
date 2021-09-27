import SVG from './assets/svg.min.js'
import $ from './assets/jquery.min.js'

let svgs = []
let today
const draw = SVG().addTo('#park').size(800, 650)

function waitForMs(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index);
	}
}

async function drawTree(tree, index) {
	svgs[index] = draw.circle(Number(tree.radius))
		.move(Number(tree.x_pos), Number(tree.y_pos))
		.attr({ fill: tree.main_colour, stroke: "black" })
		.data('info', tree.description)
		.click( function() { console.log(this.data('info')) })
}

async function print_text(event) {
	console.log(event)
	const delay = 150
	// const words = event.text.split(' ');
	// let i =0; 
	// while(i < words.length) {
	// 	await waitForMs(delay);
	// 	$('#feed').append(words[i]+ ' ');
	// 	i++
	// }
	// await waitForMs(delay)
	$('#feed').append("> " + event.text)
	$('#feed').append('<br><br>')
}

async function update_feed(park) {
	if (today !== park.day){
		$('#feed').empty()
		today = park.day
		const date = new Date(today).toLocaleString('en-us',{day:'numeric', month:'long', year:'numeric'})
		console.log(date)
		const day_text = `Today's date is ${date}. This month, we are expecting average maximum 
		temperatures to reach ${Math.round(park.max_temp)} degrees, and around ${Math.round(park.precip)}mm of rainfall. <br><br>`
		$('#feed').append(day_text)
		await asyncForEach(park.day_events, print_text)
	}
}

async function redraw_park(park) {
	svgs.forEach(svg => { svg.remove() })
	await asyncForEach(park.trees, drawTree)
}

async function park_listener() {
	const res = await fetch("https://server.futuregardens.org.uk/park")
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