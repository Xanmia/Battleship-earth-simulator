$.weaponMenu = function(){
  this.currWeapon = 1;
  this.weapons = [];
  this.replacementWeapon;
  $.weaponMenu.Box = document.getElementById('weaponDisplay');
  $.weaponMenu.Slot = document.getElementById('wSlot');
  $.weaponMenu.Damage = document.getElementById('wDamage');
  $.weaponMenu.Health = document.getElementById('wHealth');
  $.weaponMenu.FireRate = document.getElementById('wFireRate');
  $.weaponMenu.Accuracy = document.getElementById('wAccuracy');
  $.weaponMenu.Element = document.getElementById('wElement');
  $.weaponMenu.ElementCost = document.getElementById('wEleCost');
  $.weaponMenu.Prev = document.getElementById('wPrev');
  $.weaponMenu.Next = document.getElementById('wNext');
  $.weaponMenu.Replace = document.getElementById('wReplace');
}

$.weaponMenu.prototype.ClickPrevNext = function(x){
  this.currWeapon += x;
  this.showWeapon();
}

$.weaponMenu.prototype.showWeapon = function(){
    $.weaponMenu.Slot.innerText = this.currWeapon;
    $.weaponMenu.Damage.innerText =  Math.round(this.weapons[this.currWeapon-1].damage);
    $.weaponMenu.Health.innerText =  Math.round(this.weapons[this.currWeapon-1].maxHealth);
    $.weaponMenu.FireRate.innerText =  (Math.round((this.weapons[this.currWeapon-1].fireRate/60))) + 's';
    $.weaponMenu.Accuracy.innerText =  Math.round(this.weapons[this.currWeapon-1].accuracy*100) + '%';
    $.weaponMenu.Element.innerText =  this.weapons[this.currWeapon-1].elementType;
    $.weaponMenu.ElementCost.innerText =  this.weapons[this.currWeapon-1].elementCost;
  
    $.weaponMenu.Prev.disabled = this.currWeapon==1?true:false;
    $.weaponMenu.Next.disabled = this.currWeapon==this.weapons.length?true:false;
  
    $.weaponMenu.Prev.style.display = this.currWeapon==1?'none':'block';
    $.weaponMenu.Next.style.display = this.currWeapon==this.weapons.length?'none':'block';
}


$.weaponMenu.prototype.hide = function()
{
  $.weaponMenu.Box.style.display = "none";
  if($.gameState=='weaponDecision'){$.peace();$.issueDisplay.hide();}
}

$.weaponMenu.prototype.crushEm = function()
{
  this.weapons[this.currWeapon-1].damage = 100000;
   $.weaponMenu.Damage.innerText =  Math.round(this.weapons[this.currWeapon-1].damage);
}

$.weaponMenu.prototype.delete = function(){
	 $.weaponMenu.Replace.style.display = "none";
	this.replacementWeapon.health = 1;
	this.replacementWeapon.isCpu = false;
	this.weapons[this.currWeapon-1] = this.replacementWeapon; // [this.currWeapon-1].damage = 100000;
	  this.showWeapon();
	  $.weaponButtons = [];
		var i = 0, item;
		while(i < $.player.weaponSlots){
			if(i < $.player.weapons.length){
				item = $.player.weapons[i];
			}
			else
			{
				item = {health:0, isCpu:this.isCpu, elementType:''};	
			}
			$.weaponButtons.push( new $.weaponButton(30*(i+1),160,item ));
			i++;
		}
	if($.gameState=='weaponDecision'){$.peace();$.issueDisplay.hide();}
}

$.weaponMenu.prototype.show = function(weapons, spot, newWeapon)
{
	if(newWeapon!=null){ $.weaponMenu.Replace.style.display = "block";}
	else{ $.weaponMenu.Replace.style.display = "none"; }
  this.replacementWeapon = newWeapon || null;
  this.weapons = weapons || $.player.weapons;
  this.currWeapon = spot||1;
  this.ClickPrevNext(0);
  $.weaponMenu.Box.style.display = "block";
}


$.planetMenu = function(){
  $.planetMenu.Box  = document.getElementById('planetDisplay');
  $.planetMenu.weaponSlots  = document.getElementById('pSlots');
  $.planetMenu.openSlots  = document.getElementById('pOpenSlots');
  $.planetMenu.population = document.getElementById('pPopulation');
  $.planetMenu.Health = document.getElementById('health');
  $.planetMenu.Water = document.getElementById('water');
  $.planetMenu.Fire = document.getElementById('fire');
  $.planetMenu.Air = document.getElementById('air');
  $.planetMenu.Healthtext = document.getElementById('healthpercent');
  $.planetMenu.Watertext = document.getElementById('waterpercent');
  $.planetMenu.Firetext = document.getElementById('firepercent');
  $.planetMenu.Airtext = document.getElementById('airpercent');
  $.planetMenu.Populationtext = document.getElementById('populationpercent');
}

$.planetMenu.prototype.hide = function()
{
  $.planetMenu.Box.style.display = "none";
}

$.planetMenu.prototype.show = function()
{
  $.planetMenu.Box.style.display = "block";
  this.setValues($.player.elementsPopulation, $.player.population, $.player.weaponSlots, $.player.weaponSlots - $.player.weapons.length);
}

$.planetMenu.prototype.setValues = function(value, population, weaponslots, openSlots){
    $.planetMenu.population.innerText = population;
    $.planetMenu.weaponSlots.innerText = weaponslots;
	$.planetMenu.openSlots.innerText = openSlots;
    $.planetMenu.Health.value = value['health'];
    $.planetMenu.Water.value = value['water'];
    $.planetMenu.Fire.value = value['fire'];
    $.planetMenu.Air.value = value['air'];
    $.planetMenu.Populationtext.innerText = parseInt(value['health']) +parseInt(value['water'])+parseInt(value['fire'])+parseInt(value['air']) + '%';
    $.planetMenu.Healthtext.innerText = $.planetMenu.Health.value + '%';
    $.planetMenu.Watertext.innerText = $.planetMenu.Water.value + '%';
    $.planetMenu.Firetext.innerText = $.planetMenu.Fire.value + '%';
    $.planetMenu.Airtext.innerText = $.planetMenu.Air.value + '%';
}

$.planetMenu.prototype.updatePercents = function(changed){
    //var amountChanged =  $.elements[changed.id] - changed.value;
    var total = parseInt($.planetMenu.Health.value) + parseInt($.planetMenu.Water.value) + parseInt($.planetMenu.Fire.value) + parseInt($.planetMenu.Air.value);
    
    if (total > 100){
       changed.value = parseInt(changed.value) - (total-100);
    }
    $.planetMenu.Healthtext.innerText = $.planetMenu.Health.value + '%';
    $.planetMenu.Watertext.innerText = $.planetMenu.Water.value + '%';
    $.planetMenu.Firetext.innerText = $.planetMenu.Fire.value + '%';
    $.planetMenu.Airtext.innerText = $.planetMenu.Air.value + '%';
    $.planetMenu.Populationtext.innerText = Math.min(parseInt(total),100) + '%';
    $.player.elementsPopulation['health'] = $.planetMenu.Health.value;
    $.player.elementsPopulation['water'] = $.planetMenu.Water.value;
    $.player.elementsPopulation['fire'] = $.planetMenu.Fire.value;
    $.player.elementsPopulation['air'] = $.planetMenu.Air.value;
} 


$.destinyMenu = function(){
	  $.destinyMenu.Box  = document.getElementById('destinyDisplay');
}

$.destinyMenu.prototype.destroyClick = function(){
	 
	 var success = $.player.destroyPlanet();
	 if(success){
	 		 $.peace();
	 }
	 else{
		 $.gameState = 'weaponDecision';
		 $.issueDisplay.show();
	 }
	 $.destinyMenu.Box.style.display = "none";
}

$.destinyMenu.prototype.peaceClick = function(){
	 $.player.declarePeace();
	 $.peace();
	 $.destinyMenu.Box.style.display = "none";
}

$.destinyMenu.prototype.takeoverClick = function(){
	 $.player.takeoverPlanet();
	 $.peace();
	 $.destinyMenu.Box.style.display = "none";
}


$.destinyMenu.prototype.show = function(){
	 $.destinyMenu.Box.style.display = "block";
 	$.weaponDisplay.hide();
 	$.planetDisplay.hide();
}

$.destinyMenu.prototype.hide = function(){
	 $.destinyMenu.Box.style.display = "none";
}

$.issueMenu = function(){
	  $.issueMenu.Box  = document.getElementById('issueMessage');
}

$.issueMenu.prototype.show = function(){
	 $.issueMenu.Box.style.display = "block";
}

$.issueMenu.prototype.hide = function(){
	 $.issueMenu.Box.style.display = "none";
}

