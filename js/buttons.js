$.weaponButton = function( x, y, obj ){
	this.x = x;
	this.y = y;
	this.owner = obj;
	this.opacity = 1.0;
};



$.weaponButton.prototype.update = function( i ){
	if (this.owner.elementType != ""){
		this.opacity = this.owner.health <= 0?0:(this.owner.fireRateTick / this.owner.fireRate);
	}
	else
	{
		this.opacity = 0;
	}
	
	if (this.owner.isCpu == true && $.gameState != 'fight'){
		$.weaponButtons.splice(i,1);
	}
};


$.weaponButton.prototype.render = function( i ){
    $.guictx.beginPath();
	$.guictx.arc(this.x, this.y, 10, 0, Math.PI*2, true);

	$.guictx.fillStyle ="rgba(0,0,0," + this.opacity + ")";	
	if(this.owner.elementType!="")
	{
			$.guictx.fillStyle ="rgba("+$.elementColors[this.owner.elementType].r+" ,"+$.elementColors[this.owner.elementType].g+" ,"+$.elementColors[this.owner.elementType].b+"," + this.opacity + ")";
	}
    $.guictx.fill();
    $.guictx.lineWidth = 2;
    $.guictx.strokeStyle ="rgba(84,84,84,1.0)";
    $.guictx.stroke();
	
	if(this.owner.health<=0 && this.owner.elementType != ''){
		$.guictx.fillStyle ="rgb(84,84,84)";
		$.guictx.font = "20px Verdana";	
		$.guictx.fillText("X",this.x-7,this.y+7.25);
	}
};