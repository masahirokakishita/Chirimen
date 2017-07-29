function DrawGraph(iWxs,iWxe,iWys,iWye){

	var i,j;
	this.cv=null;	//Canvas
	this.ctx=null; 	//Canvas Context

	this.iWxs=iWxs;
	this.iWxe=iWxe;
	this.iWys=iWys;
	this.iWye=iWye;
	this.iWxw=iWxe-iWxs;
	this.iWyh=Math.abs(iWye-iWys);

	this.iVxs=0.0;
	this.iVxe=1024.0;
	this.iVys=-10.0;
	this.iVye=1.0;

	this.fAx = (this.iWxe-this.iWxs)/(this.iVxe-this.iVxs);
	this.fBx = this.iWxs-this.fAx*this.iVxs;
	this.fAy = (this.iWye-this.iWys)/(this.iVye-this.iVys);	/* ????????O??????? */
	this.fBy = this.iWye-this.fAy*this.iVys;

	this.iPx=0;
	this.iPy=0;
}

/* ?Q?????W??????\???? */
DrawGraph.prototype={
	fSetCanvas : function(canvas) {
		this.cv=canvas;
		this.ctx = this.cv.getContext('2d');
		this.cv.addEventListener('click', this.fMouseClick.bind(this),false);
	},

	fCalcCoef: function(){
		this.fAx = (this.iWxe-this.iWxs)/(this.iVxe-this.iVxs);
		this.fBx = this.iWxs-this.fAx*this.iVxs;
		this.fAy = (this.iWye-this.iWys)/(this.iVye-this.iVys);
		this.fBy = this.iWys-this.fAy*this.iVys;
	},

	fSetViewPort: function(iVxs,iVxe,iVys,iVye){
		this.iVxs=iVxs;
		this.iVxe=iVxe;
		this.iVys=iVys;
		this.iVye=iVye;
		this.fCalcCoef();
	},

	fSetViewPortX: function(iVxs,iVxe){
		this.iVxs=iVxs;
		this.iVxe=iVxe;
		this.fCalcCoef();
	},

	fSetViewPortY: function(iVys,iVye){
		this.iVys=iVys;
		this.iVye=iVye;
		this.fCalcCoef();
	},


	fSetWindowXY: function(iWxs,iWxe,iWys,iWye){
		this.iWxs=iWxs;
		this.iWxe=iWxe;
		this.iWys=iWys;
		this.iWye=iWye;
		this.iWxw=iWxe-iWxs;
		this.iWyh=Math.abs(iWye-iWys);
		this.fCalcCoef();
	},

	fMouseClick: function(e){
	},

	fClearWindow: function(xs,xe,ys,ye){
		this.ctx.clearRect(xs,ys,xe,ye);
	},

	fClearWindowInside: function(){
		this.ctx.clearRect(this.iWxs+1,Math.min(this.iWys,this.iWye)+1,this.iWxw-2,this.iWyh-2);
	},

	fConvPos: function(x,y){
		this.iPx = Math.floor(this.fAx*x+this.fBx);
		this.iPy = Math.floor(this.fAy*y+this.fBy);
	},

	fDrawLine: function(d){
		this.fSetViewPortX( 0, d.length);
		this.ctx.beginPath();
		this.fConvPos(0,d[0]);
		this.ctx.moveTo(this.iPx, this.iPy);
		for(var i=0; i<d.length; i++){
			this.fConvPos(i,d[i]);
			this.ctx.lineTo(this.iPx, this.iPy);
		}
		this.ctx.stroke();
	},

	fDrawLine: function(d,size){
		this.fSetViewPortX( 0, size);
		this.ctx.beginPath();
		this.ctx.lineWidth=5;
		this.fConvPos(0,d[0]);
		this.ctx.moveTo(this.iPx, this.iPy);
		for(var i=0; i<size; i++){
			this.fConvPos(i,d[i]);
			this.ctx.lineTo(this.iPx, this.iPy);
		}
		this.ctx.stroke();
	},

	fDrawImage: function(d,x,y){
		this.ctx.drawImage(d,x,y);
	},

	fWriteText: function(d,x,y,font){
		this.ctx.font = font;
		this.ctx.textAlign = "start";
		this.ctx.fillText(d, x, y);
	},

	fFillColor: function(e){
		this.ctx.fillStyle = this.ctx.strokeStyle = e;
	},

	fResize: function(){
		this.cv.height = window.innerHeight;
		this.cv.width = window.innerWidth;
	},

}
