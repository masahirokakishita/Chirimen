Please see also: https://github.com/club-wot/WebGPIO

- B2G OS
CMN2015-1_B2GOS-20170301

- Test Program
	setInterval(function(){
		port.write(0).then( ()=>{
		port.write(1);
		port.write(0);
		port.write(1);
	});

	},1000);

