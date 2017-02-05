'use strict';

var I2C = null;  // global I2CAccess object
var ports = null;
var port = null;  // global I2CPort object
var slaveDevice = null;
var slaveAddress = 0x70;

function greenon()
{
	writeValue(0x00,0xFF);
	writeValue(0x02,0xFF);
	writeValue(0x04,0xFF);
	writeValue(0x06,0xFF);
	writeValue(0x08,0xFF);
	writeValue(0x0A,0xFF);
	writeValue(0x0C,0xFF);
	writeValue(0x0E,0xFF);
}

function greenoff()
{
	writeValue(0x00,0x0);
	writeValue(0x02,0x0);
	writeValue(0x04,0x0);
	writeValue(0x06,0x0);
	writeValue(0x08,0x0);
	writeValue(0x0A,0x0);
	writeValue(0x0C,0x0);
	writeValue(0x0E,0x0);
}

function redon()
{
	writeValue(0x01,0xFF);
	writeValue(0x03,0xFF);
	writeValue(0x05,0xFF);
	writeValue(0x07,0xFF);
	writeValue(0x09,0xFF);
	writeValue(0x0B,0xFF);
	writeValue(0x0D,0xFF);
	writeValue(0x0F,0xFF);
}

function redoff()
{
	writeValue(0x01,0x0);
	writeValue(0x03,0x0);
	writeValue(0x05,0x0);
	writeValue(0x07,0x0);
	writeValue(0x09,0x0);
	writeValue(0x0B,0x0);
	writeValue(0x0D,0x0);
	writeValue(0x0F,0x0);
}

window.addEventListener('load', function (){
	var head = document.querySelector('#head');

	navigator.requestI2CAccess().then(
		function(I2CAccess) {
			console.log("I2C ready!");
			I2C = I2CAccess; // store in the global
			ports = I2C.ports;	// get a I2CPortMap object

			port = ports.get(0);
		// show the detailed information for each port
			console.log("* Port " + port.portNumber);
			console.log("  - Port name   : " + port.portName);
			console.log("  - PIN name    : " + port.pinName);

		// get the I2CPort object representing the I2C port named "I2C18".
			port.open(slaveAddress).then(
			function(I2CSlave) {
				slaveDevice = I2CSlave; // store in global

			writeValue(0x21,0x00);
			writeValue(0x81,0x00);

			var i=0;
			setInterval(function(){
			if(slaveDevice!=null){
				switch(i){
					case 0:
					greenoff();
					redoff();
						head.innerHTML ="OFF";
						head.innerText +="\n";
					break;

					case 1:
						frownon();
						head.innerHTML ="FROWN";
						head.innerText +="\n";
					break;

					case 2:
						neutralon();
						head.innerHTML ="NEUTRAL";
						head.innerText +="\n";
					break;

					case 3:
						smileon();
						head.innerHTML ="SMILE";
						head.innerText +="\n";
					break;
				}
			i++;
			i%=4;
			}

      },2500);

			},
			function(error) {
				console.log("Failed to get a I2C slave device: " + error.message);
			});
		},

		function(error) {
			console.log("Failed to get I2C access: " + error.message);
		}
	);
}, false);

//Writing a value
function writeValue(writeRegistar,v){
//	window.setTimeout(slaveDevice.write8(writeRegistar, v).then(writeSuccess, I2CError),2000);
	slaveDevice.write8(writeRegistar, v).then(writeSuccess, I2CError);
}

// the value successfully written
function writeSuccess(value) {
	console.log(slaveDevice.address + " : " + reg + " was set to " + value);
/*	window.setTimeout(writeValue, 1000); */
}

// Show an error
function I2CError(error) {
	console.log("Error: " + error.message + "(" + slaveDevice.address + ")");
}
