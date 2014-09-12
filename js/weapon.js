$.weapon = function(isCpu,loadWeapon)
{
	var _maxFireRate = 500;
	var _maxDamage = 20 + (($.currentStage+2)* 2);
	var _fireRate = Math.random()*_maxFireRate;
	
	this.isCpu = isCpu || false;
	this.maxHealth = loadWeapon!=null?loadWeapon.maxHealth : Math.random()*(600 + (($.currentStage+2) * 16)) ;

	this.health = loadWeapon!=null?loadWeapon.health : this.maxHealth;
	this.fireRateTick = 0.00000;//_fireRate;
	this.fireRate = _fireRate;
	this.damage = loadWeapon!=null?loadWeapon.damage : ((Math.random()*_maxDamage) * ((_fireRate/_maxFireRate)*10))+1;
	this.accuracy =loadWeapon!=null?loadWeapon.accuracy :  Math.min((Math.random()*0.3)+.7, .99);
	this.elementCost = loadWeapon!=null?loadWeapon.elementCost : Math.floor(Math.random()*100);  ///need weighting on this
	this.elementType = loadWeapon!=null?loadWeapon.elementType : $.elements[Math.floor(Math.random()*$.elements.length)];
};

$.weapon.prototype.hit = function(){
	var attempts = Math.random()*1;
	return attempts<this.accuracy;
};

$.weapon.prototype.reset = function(){
	this.health = this.maxHealth;
};