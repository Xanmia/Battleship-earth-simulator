$.explosion = function(X,Y, targetX, targetY, damagetxt){
	this.x = X;
	this.y = Y;
	this.velocity=1;
	//this.radius=250;
	
	this.damage = damagetxt;
	
	this.life = 200;
	this.lifeTick = 0;
	
	this.peices = [];
	//var total = 1000;
	
	var dx = this.x - targetX,
		dy = this.y - targetY;
	var direction = Math.atan2( dx, dy );
			
    for(i=0;i<100;i++){
		this.peices.push({x: this.x, 
						  y: this.y, 
						  dir: (Math.random()* (direction - (direction-.4))) + (direction-.4),
						  vel: (Math.random()*this.velocity),
						  size:  Math.random()*3,
						  opacity: (((Math.random()*10)+1)*0.5)
					  });
    }
	
};

$.explosion.prototype.update = function(i) {
	x = this.peices.length; while(x--){
	    this.peices[x].x += Math.sin( (Math.PI) + this.peices[x].dir) * (this.peices[x].vel*$.dt);
		this.peices[x].y += Math.cos( (Math.PI) + this.peices[x].dir) * (this.peices[x].vel*$.dt);
	};
	//this.radius -= this.velocity;// * $.dt;
	this.lifeTick += $.dt;
	if (this.lifeTick > this.life){
		$.effects.splice(i,1);
	}
};

$.explosion.prototype.render = function() {
	i = this.peices.length; while(i--){
		//var opac = (1-(this.life/this.lifeTick));
	    $.mg1ctx.fillStyle = "rgba(255,255,255, "+ this.peices[i].opacity * (.9-(this.lifeTick/this.life)) + ")";
	    $.mg1ctx.fillRect(this.peices[i].x,this.peices[i].y,this.peices[i].size,this.peices[i].size);
	};
	
	
	$.mg1ctx.font = "16px Verdana";	
	$.mg1ctx.fillText(this.damage, this.x, this.y);
};

$.planetExplosion = function(X,Y,size){
	this.x = X;
	this.y = Y;
	this.velocity=10*$.dt;
	//this.radius=250 * (size || 1);

	this.life = 1500; //* (size || 1);
	this.lifeTick = 0;
	
	this.peices = [];
	//var total = 1000;

    for(i=0;i<1000;i++){
		this.peices.push({x: this.x, 
						  y: this.y, 
						  dir: Math.random()*(Math.PI*2),
						  vel: (Math.random()*this.velocity),
						  size:  Math.random()*(30 * (size || 1)),
						  opacity: (((Math.random()*10)+1)*0.5)
					  });
    }
	
};

$.planetExplosion.prototype.update = function(i) {
	x = this.peices.length; while(x--){
	    this.peices[x].x += Math.sin( (Math.PI) + this.peices[x].dir) * (this.peices[x].vel*$.dt);
		this.peices[x].y += Math.cos( (Math.PI) + this.peices[x].dir) * (this.peices[x].vel*$.dt);
	};
	this.lifeTick += $.dt;
	if (this.lifeTick > this.life){
		$.effects.splice(i,1);
	}
};

$.planetExplosion.prototype.render = function() {
	i = this.peices.length; while(i--){
		//var opac = (1-(this.life/this.lifeTick));
	    $.mg1ctx.fillStyle = "rgba(255,255,255, "+ this.peices[i].opacity * (.9-(this.lifeTick/this.life)) + ")";
	    $.mg1ctx.fillRect(this.peices[i].x,this.peices[i].y,this.peices[i].size,this.peices[i].size);
	};
};