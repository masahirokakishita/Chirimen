﻿window.addEventListener('load', function (){

 navigator.requestGPIOAccess()
    .then(gpioAccess=>{
      port = gpioAccess.ports.get(198);
      return port.export("out").then(()=>{
      });
  });

	setInterval(function(){
		port.write(0).then( ()=>{
		port.write(1);
		port.write(0);
		port.write(1);
	});

	},1000);

}, false);
