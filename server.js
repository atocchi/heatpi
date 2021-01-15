const express = require('express');
const app = express();
const port = 3000;
const gpio = require('onoff').Gpio;
const cors = require('cors');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

let status = false;
let led = '';
let date = 0;
let time = '';

app.get('/', (req,res) => {
	let data = {bool: status, time: date}
	res.send(data);
});
app.post('/post', (req,res) =>{
	let request = req.body.post;
	console.log(request);
	if(status === false){
		status = true;
		led = new gpio(4, 'out');
		led.writeSync(1);
	}
	else{
		status = false;
		led.writeSync(0);
		led.unexport();
	}
	res.send(status);
});
app.post('/date', (req,res) => {
	let request = req.body.seconds;
	console.log(request);
	time = request;
	res.send('recieved');
	if(status === true){
		if(date <= time){
		date = time;
		
		}
	}
	else{
		status = true
		date = time
		console.log(date) 
		led = new gpio(4, 'out');
		led.writeSync(1);
		let timer = setInterval(function () {
			date = date - 1;
			console.log(date);
			if(date == 1){
				clearInterval(timer);
				status = false;
				led.writeSync(0);
				led.unexport();
			} 
		}, 1000);
	}
});

app.listen(port, () => {
	console.log('serving @ port:' + port);
});
