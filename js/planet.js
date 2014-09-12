
$.planet = function(X,Y, isCPU){
	this.isCpu = isCPU || false;
	this.waterMax = 100;
	this.fireMax = 100;
	this.airMax = 100;
	this.elements = {water: this.waterMax, fire: this.fireMax, air: this.airMax};
	this.elementsPopulation = {water: 25, fire: 25, air: 25, health: 25};
	this.radius = 200;
	this.status = true;
	
	this.weaponSlots = 4; 
	this.population = 3245;

	this.target;

	this.x = X;	
	this.y = Y;

	this.color1 = Math.floor(Math.random()*360);
	this.color2 = Math.floor(Math.random()*360);
    
	this.weapons = [];
	
	if (isCPU){
		this.population = Math.floor(Math.random()*(3000*($.currentStage+1)));
		this.weaponSlots = Math.min(Math.floor((Math.random()*$.currentStage)+ 1),10);
		var totalWeapons = Math.floor(Math.random()*this.weaponSlots)+1;
		var tempweaponSlots = this.weaponSlots;
		this.createWeapons(this.weaponSlots,totalWeapons);
	}
	else{ /// player starts with 2 weapons
		this.createWeapons(this.weaponSlots,2);
	}
};

$.planet.prototype.updatePopulationAlignment = function(element, total, change) {
	if((this.elementsPopulation['water'] + this.elementsPopulation['fire'] + this.elementsPopulation['air'] + this.elementsPopulation['health']) + change <= 100 &&
		(this.elementsPopulation['water'] + this.elementsPopulation['fire'] + this.elementsPopulation['air'] + this.elementsPopulation['health']) + change >= 0 && total >= 0)
	{
		this.elementsPopulation[element] = total;
	}
};

$.planet.prototype.regenResources = function() {
	if($.gameState!='postBattle'){
		var weight = 10000/$.dt;///10,000 people = 1  increase weight depending on frame rate
		var hweight =20000/$.dt; //health weight
		this.elements['water'] = Math.min((this.elements['water']+((this.elementsPopulation['water']*.01)*this.population)/weight), this.waterMax);
		this.elements['fire'] = Math.min((this.elements['fire']+((this.elementsPopulation['fire']*.01)*this.population)/weight), this.fireMax);
		this.elements['air'] = Math.min((this.elements['air']+((this.elementsPopulation['air']*.01)*this.population)/weight), this.airMax);
	
		var i = this.weapons.length; 
		var weaponPercent = this.elementsPopulation['health']/i;
		while(i--){
			if(this.weapons[i].health>0 || ($.gameState!='fight')){
				this.weapons[i].health = Math.min((this.weapons[i].health+((weaponPercent*.01)*this.population)/hweight), this.weapons[i].maxHealth);
			}
		}
	}

};

$.planet.prototype.health = function(){
	var currentHealth = 0;
	var maxHealth = 0;
	var totalWeapons = this.weapons.length; //needs to be changed
	while(totalWeapons--){
		currentHealth += this.weapons[totalWeapons].health;
		maxHealth += this.weapons[totalWeapons].maxHealth;
	}
	return {current: currentHealth, max: maxHealth, percent: ((currentHealth/maxHealth) < 0 ? 0 : (currentHealth/maxHealth))};
};

$.planet.prototype.receiveDamage = function(focus,damage){
	focus.health = Math.max(focus.health-damage,0);
	//this.weapons[focus].health = Math.max(this.weapons[focus].health-damage,0);
};

$.planet.prototype.update = function(){
	this.regenResources();
	///////////////weapon attacking///////////////////////
	var attackableWeapons = this.analyzeEnemy();
	var i = this.weapons.length; 
		while(i--){
			if(this.weapons[i].health>0){
				this.weapons[i].fireRateTick += $.dt;
				if (attackableWeapons.length > 0){
				if( this.weapons[i].fireRateTick >  this.weapons[i].fireRate && this.elements[ this.weapons[i].elementType ] >= this.weapons[i].elementCost){
						this.weapons[i].fireRateTick = 0;
						this.elements[ this.weapons[i].elementType ] -= this.weapons[i].elementCost;
						$.bullets.push(new $.bullet(this.x,this.y, this.target.x, this.target.y, this.target, this.weapons[i].hit()==true?this.weapons[i].damage:0 , attackableWeapons[0],this.weapons[i].elementType));
					}
			};
		}
	}
	///////////////////////////////////////////////////status checks
	var availableWeapons = this.weapons.filter(function(value){ return value.health > 0 });
	if(availableWeapons.length == 0  && this.status == true){
		this.status = false;
		if(this.isCpu == false)
		{
			$.effects.push(new $.planetExplosion(this.x,this.y));
			$.loseMenu.style.display = 'block';
		
		}
		else if(this.isCpu == true)
		{
			$.postBattle();
		}
	}
	///////////////your planet is dead//// shrink planet and explode
	if(this.status == false && this.radius>0){
		this.radius -=5;
		this.render();
	}
};

$.planet.prototype.analyzeEnemy = function(){
	var aliveWeapons = []
	if(this.target!=null){
 		aliveWeapons = this.target.weapons.filter(function(value){ return value.health > 0; } );
	}
	return aliveWeapons;
};


$.planet.prototype.declarePeace = function(){
	var popRecieved = Math.floor(Math.random()*this.target.population);
	this.population += popRecieved;
	$.effects.push(new $.textParticle(275,$.H-50,'+'+popRecieved));
};

$.planet.prototype.destroyPlanet = function(){
	$.effects.push(new $.planetExplosion(this.target.x,this.target.y,.2));
	var weaponDropped =  Math.floor(Math.random()*this.target.weapons.length)
	if(this.weapons.length < this.weaponSlots){
		this.target.weapons[0].health = 1;
		this.target.weapons[0].isCpu = false;
		this.weapons.push(this.target.weapons[weaponDropped]);
		$.weaponDisplay.show(this.weapons, this.weapons.length);
		$.weaponButtons = [];
		var i = 0, item;
		while(i < this.weaponSlots){
			if(i < this.weapons.length){
				item = this.weapons[i];
			}
			else
			{
				item = {health:0, isCpu:false, elementType:''};	
			}
			$.weaponButtons.push( new $.weaponButton(30*(i+1),160,item) );
			i++;
		}
		return true;
	}
	else{
		$.weaponDisplay.show(this.weapons, this.weapons.length, this.target.weapons[weaponDropped]);
		return false;
	}
	

};

$.planet.prototype.takeoverPlanet = function(){
	$.fg1ctx.clearRect(0,0,$.W,$.H);
	var clone = {},prop;
	for (prop in this.target){
		clone[prop] = this.target[prop]
	}
	clone.isCpu = false;
	clone.status = true;
	clone.x = ($.W/2) - 200;
	clone.y = ($.H/2) +100;
	$.weaponButtons = [];
	
	
	var p = 0, item;
	while(p < clone.weaponSlots){
		if(p < clone.weapons.length){
			item = clone.weapons[p];
			clone.weapons[p].isCpu = false
			clone.weapons[p].health = clone.weapons[p].maxHealth/2;
		}
		else
		{
			item = {health:0, isCpu:this.isCpu, elementType:''};	
		}
		$.weaponButtons.push( new $.weaponButton(30*(p+1),160,item ));
		p++;
	}
	$.player = clone;
	
	$.planetDisplay.show();
	$.weaponDisplay.show();
};

$.planet.prototype.createWeapons = function(tempweaponSlots, totalWeapons){
	var p = null;
	var locatex = this.isCpu?($.W-435):0;
	var locatey = this.isCpu?100:160;
	var total = 0;
	while(total<tempweaponSlots){ //totalWeapons--
		p = null;
		if(totalWeapons>0){
			p = new $.weapon(this.isCpu);
			this.weapons.push(p);
			totalWeapons--;
		}
		else{
			p = {health:0, isCpu:this.isCpu, elementType:''};
		}
		
		$.weaponButtons.push( new $.weaponButton(locatex+(30*(total+1)),locatey,p) );
		total++;
	}
};

$.planet.prototype.render = function(){
	
  	$.fg1ctx.beginPath();
	var color1 = "hsl(" + this.color1 + ",90%,50%)"
	var color2 = "hsl(" + this.color2 + ",100%,10%)"
	
	var color =$.fg1ctx.createRadialGradient(this.x,this.y,5,this.x,this.y,this.isCpu?100:200);
	color.addColorStop(0,color1);
	color.addColorStop(1,color2);
	
    $.fg1ctx.fillStyle = color;
	$.fg1ctx.shadowBlur    = 200;
	$.fg1ctx.shadowColor   = 'rgba(65, 157, 217, 0.9)'; //static atmosphere look for all planets

	$.fg1ctx.arc(this.x, this.y, this.isCpu?this.radius-100:this.radius, 0, Math.PI*2, true);
	$.fg1ctx.fill();
	if(this.status==true){
		$.fg1ctx.shadowColor   = 'rgba(65, 157, 217, 0.0)';
   		$.fg1ctx.fillStyle ="rgb(255,255,255)";	
		if(!this.isCpu){
			$.fg1ctx.font = "46px Verdana";
		}
		else
		{
			$.fg1ctx.font = "26px Verdana";
		}
		
		$.fg1ctx.fillText("Population " + this.population, this.isCpu?$.W-375:15,this.isCpu?400:$.H-20);
		
	}
	
};