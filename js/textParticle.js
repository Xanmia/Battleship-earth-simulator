$.textParticle = function(X,Y, text){
	this.x = X;
	this.y = Y;
	this.velocity=1;
	this.text = text;
	this.life = 200;
	this.lifeTick = 0;
};

$.textParticle.prototype.update = function(i) {
	this.y -= this.velocity*$.dt;
	this.lifeTick += $.dt;
	if (this.lifeTick > this.life){
		$.effects.splice(i,1);
	}
};

$.textParticle.prototype.render = function() {
    $.mg1ctx.fillStyle = "rgba(0,255,255, "+ 1.0 * (.9-(this.lifeTick/this.life)) + ")";
	$.mg1ctx.font = "36px Verdana";	
	$.mg1ctx.fillText(this.text, this.x, this.y);
};

$.textTransition = function(element, X,Y, textArray){
	$.textTransition.text  = element; //document.getElementById('story');
	this.x = X;
	this.y = Y;
	this.text = textArray;
	this.life = 600;
	this.lifeTick = 0;
	this.current=0;
	$.textTransition.text.innerText = this.text[this.current];
	$.textTransition.text.style.display = '';
};

$.textTransition.prototype.update = function(i) {
	this.lifeTick += $.dt;
	if (this.lifeTick > this.life){
		this.lifeTick=0;
		if(this.text.length-1==this.current){
			//this.current=0;
			$.effects.splice(i,1);
			$.textTransition.text.style.display = 'none';
		}
		else{
			this.current+=1;
			$.textTransition.text.innerText = this.text[this.current];
			$.textTransition.text.style.opacity = 1;
		}

		//add new text
		//opacity back to 1
	}
};

$.textTransition.prototype.render = function() {
	$.textTransition.text.style.opacity = 1* (.9-(this.lifeTick/this.life));
};