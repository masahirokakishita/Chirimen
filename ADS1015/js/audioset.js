	const BUFSIZE=256;

	var buffer = new Array(4);
	var fdg = new Array(4);
	var ip=new Array(4);

window.addEventListener('load', function (){

	var i, j;
	
	for(i=0; i<4; i++){
		ip[i]=0;
		buffer[i]= new Array(BUFSIZE);
		for(j=0; j<BUFSIZE; j++) buffer[i][j]=j;
	}

	/* •`‰æ—Ìˆæ‚Ì‰Šú‰» */
	for(i=0; i<4; i++){
		fdg[i] = new DrawGraph(0,1200,0,100);
	}

	fdg[0].fSetCanvas(document.getElementById('bkg1'));
	fdg[1].fSetCanvas(document.getElementById('bkg2'));
	fdg[2].fSetCanvas(document.getElementById('bkg3'));
	fdg[3].fSetCanvas(document.getElementById('bkg4'));

	for(i=0; i<4; i++){
		fdg[i].fResize();
		fdg[i].cv.globalAlpha=0.4;
		fdg[i].fSetViewPort(0,BUFSIZE,0x1000,0);
	}

	var wh=fdg[0].cv.height/4;
	var ww=fdg[0].cv.width;

	fdg[0].fSetWindowXY(0,ww,0,wh);
	fdg[1].fSetWindowXY(0,ww,wh,wh*2);
	fdg[2].fSetWindowXY(0,ww,wh*2,wh*3);
	fdg[3].fSetWindowXY(0,ww,wh*3,wh*4);

	fdg[0].fFillColor("white");
	fdg[1].fFillColor("blue");
	fdg[2].fFillColor("green");
	fdg[3].fFillColor("red");

	for(i=0; i<4; i++){
		fdg[i].fDrawLine(buffer[i],BUFSIZE);
	}

}, false);

function process(data,n){

	var i;
	fdg[n].fClearWindow(0,fdg[n].cv.width,0,fdg[n].cv.height);

	for(j=BUFSIZE-1; j>0; j--){
		buffer[n][j]=buffer[n][j-1];
	} 
	buffer[n][0]=data;
	fdg[n].fDrawLine(buffer[n],BUFSIZE);
}
