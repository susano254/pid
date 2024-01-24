direct_label = document.getElementById('direct_label')
desired_label = document.getElementById('desired_label')
kp_label = document.getElementById('kp_label')
kd_label = document.getElementById('kd_label')
ki_label = document.getElementById('ki_label')
direct_slider = document.getElementById('direct')
desired_slider = document.getElementById('desired')
kp_slider = document.getElementById('kp')
kd_slider = document.getElementById('kd')
ki_slider = document.getElementById('ki')

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

async function send_pid(p, value){
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		console.log(this.responseText);
	}
	xhttp.open("GET", "http://localhost:8000/pid/"+p+ "?" + p +"="+ value);
	xhttp.send();
}

direct_slider.oninput = function(){
	direct_val = direct_slider.value
	direct_label.innerHTML =  "direct: " + direct_val
	send_pid('direct', direct_val)
}
desired_slider.oninput = function(){
	desired_val = desired_slider.value
	desired_label.innerHTML =  "desired: " + desired_val
	send_pid('desired', desired_val)
}
kp_slider.oninput = function(){
	kp_val = scale(kp_slider.value, 0, 1000, 0.00, 20.00)
	kp_label.innerHTML =  "kp: " + kp_val
	send_pid('kp', kp_val)
}
kd_slider.oninput = function(){
	kd_val = scale(kd_slider.value, 0, 1000, 0.00, 10.00)
	kd_label.innerHTML =  "kd: " + kd_val
	send_pid('kd', kd_val)
}
ki_slider.oninput = function(){
	ki_val = scale(ki_slider.value, 0, 1000, 0.00, 5.00)
	ki_label.innerHTML =  "ki: " + ki_val
	send_pid('ki', ki_val)
}

// Create an EventSource object to receive data from the server
var parsedData
var source = new EventSource("/serial");
// Add an event listener to handle incoming data
source.addEventListener("message", function(event) {
	// Append the data to the output div
	var outputDiv = document.getElementById("output");
	parsedData = JSON.parse(event.data);
	var str = "";
	for(var i = 0; i < parsedData.length; i++){
		str += parsedData[i];
		if(i != parsedData.length - 1)
			str += '\t'
		else
			str += "<br>"
	}
	outputDiv.innerHTML = str;
});



const refresh_rate = 1.0/60.0 
defineChart = (id, i) =>
	new Chart(
		document.getElementById(id),
		{
			type: 'line',
			data: {
				datasets: [
					{
						label: '',
						data: []
					}
				]
			},
			options: {
				pointRadius: 2,
				scales: {
				x: {
					type: 'realtime',
					realtime: {
						refresh: refresh_rate,
						onRefresh: chart => {
							chart.data.datasets.forEach(dataset => {
							dataset.data.push({
								x: Date.now(),
								y: parsedData[i]
							});
							});
						},
					}
				}
				}
			}
		}
	)

const chart1 = new Chart(
		document.getElementById("plot1"),
		{
			type: 'line',
			data: {
				datasets: [
					{
						label: 'error',
						data: [],
						borderColor: 'red', // Set the color for Dataset 1 to red
						pointBackgroundColor: 'red', // Set the point color for Dataset 1 to red
						backgroundColor: 'red', // Set the color for Dataset 1 to red
					},
					{
						label: 'kp',
						data: [], // An empty array to store the data points for Dataset 2
						borderColor: 'purple', // Set the color for Dataset 1 to red

					},
					{
						label: 'kd',
						data: [], // An empty array to store the data points for Dataset 2
						borderColor: 'blue', // Set the color for Dataset 1 to red
					},
					{
						label: 'ki',
						data: [], // An empty array to store the data points for Dataset 2
						borderColor: 'green', // Set the color for Dataset 1 to red
						
					},
				]
			},
			options: {
				pointRadius: 0.5,
				scales: {
				x: {
					type: 'realtime',
					realtime: {
						refresh: refresh_rate,
						onRefresh: chart => {
							const currentTime = Date.now();
							for (let i = 0; i < 4; i++) {
								chart.data.datasets[i].data.push({
									x: currentTime,
									y: parsedData[i]
								});
							}
						},
					},
				}
				}
			}
		}
	)

const motor1 = defineChart("motor1", 4)
const motor2 = defineChart("motor2", 5)
const motor3 = defineChart("motor3", 6)
const motor4 = defineChart("motor4", 7)