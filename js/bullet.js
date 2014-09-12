$.bullet = function(x,y,targetX,targetY, target, damage, weapon, elementType){
	this.target = target;
	this.damage = damage;
	this.targetedWeapon = weapon;
	this.x = x;
	this.y = y;
	this.velocity = 4;
	this.targetX = targetX + (Math.random()*150)-75;
	this.targetY = targetY + (Math.random()*150)-75;
	this.elementType = elementType;
	
	var dx = this.x - this.targetX,
		dy = this.y - this.targetY;
	this.direction = Math.atan2( dx, dy );
	
};

$.bullet.prototype.update = function(i) {
    this.x += Math.sin( (Math.PI) + this.direction) * (this.velocity*$.dt);
	this.y += Math.cos( (Math.PI) + this.direction) * (this.velocity*$.dt);

	var dx = this.x - this.targetX,
		dy = this.y - this.targetY;
	var currentDir = Math.atan2( dx, dy );
	
	$.effects.push(new $.particles(this.x, this.y,dx,dy, $.elementColors[this.elementType]));
		
	if (Math.floor(currentDir) != Math.floor(this.direction) && this.damage>0)
	{
		$.bullets.splice(i,1);
		$.effects.push(new $.explosion(this.x,this.y, this.targetX, this.targetY, Math.round(-this.damage)));
		this.target.receiveDamage(this.targetedWeapon, this.damage);
	}
	else if (!(this.x <= $.W && this.y <= $.H || this.x >= 0 && this.y >= 0))
	{
		$.bullets.splice(i,1);
	}	
};

$.bullet.prototype.render = function() {
    $.mg1ctx.fillStyle = "rgb(255,255,255)";
    $.mg1ctx.fillRect(this.x,this.y,5,5);
};