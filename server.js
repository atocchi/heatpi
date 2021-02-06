const express = require('express');
const app = express();
const port = 3000;
const gpio = require('onoff').Gpio;
const cors = require('cors');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use(express.static('build'))

let status = false;
let led = '';
let date = 0;
let time = '';
let timer = null;
app.get('/api', (req,res) => {
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
	if(request === 'clear'){
	clearInterval(timer);
	date = 0;
	return;
	}
	if(status === true){
		date = time;
		if(setInterval !==null){
			clearInterval(timer)
		}
		timer = setInterval(function() {
			date = date - 1;
			console.log(date);
			if(date == 1){
				clearInterval(timer);
				status = false;
				date = 0;
				led.writeSync(0);
				led.unexport();
			}
		},1000);
	}
	else{
		status = true
		date = time;
		console.log(date) 
		led = new gpio(4, 'out');
		led.writeSync(1);
		timer = setInterval(function () {
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

app.get('/*', function(req,res) {
	res.sendFile(__dirname,('build/index.html'), function(err) {
		if (err) {
			res.status(500).send(err);
		}
})
});

app.listen(port, () => {
	console.log('serving @ port:' + port);
});
