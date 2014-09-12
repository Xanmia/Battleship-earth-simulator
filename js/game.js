window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            setInterval(callback, 60);
          };
})();

$.setup = function(){
	$.message = document.getElementById('message');
	$.bg1 = document.getElementById('bg1');
	$.mg1 = document.getElementById('mg1');
	$.fg1 = document.getElementById('fg1');
	$.gui = document.getElementById('gui');
	$.loseMenu = document.getElementById('Lose-message');
	$.weaponStats = document.getElementById('weapon-stats');
	$.earthStats = document.getElementById('earth-stats');
	
	$.bg1ctx = $.bg1.getContext('2d');
	$.mg1ctx = $.mg1.getContext('2d');
	$.fg1ctx = $.fg1.getContext('2d');
	$.guictx = $.gui.getContext('2d');
	var minWidth = 1366;
	var minHeight = 768;
	$.bg1.width = Math.max(minWidth,window.innerWidth);
	$.bg1.height =  Math.max(minHeight,window.innerHeight);
	$.mg1.width = Math.max(minWidth,window.innerWidth);
	$.mg1.height =  Math.max(minHeight,window.innerHeight);
	$.fg1.width = Math.max(minWidth,window.innerWidth);
	$.fg1.height =  Math.max(minHeight,window.innerHeight);
	$.gui.width = Math.max(minWidth,window.innerWidth);
	$.gui.height =  Math.max(minHeight,window.innerHeight);
	$.W = Math.max(minWidth,window.innerWidth);
	$.H =  Math.max(minHeight,window.innerHeight);
	
	$.weaponButtons = [];
	$.effects = [];
	$.bullets = [];
	
	$.updateDelta();
	$.createStarsBackground();

	$.day = 0;
	$.elapsed = 0;
	$.currentStage = -1;
	
	$.player = new $.planet(($.W/2) - 200, ($.H/2) +100, false);
		
	$.weaponDisplay = new $.weaponMenu();
	$.weaponDisplay.hide();
	
	$.destinyDisplay = new $.destinyMenu();
	$.destinyDisplay.hide();
	
	$.loseMenu.style.display = 'none';
	
	$.planetDisplay = new $.planetMenu();
	$.planetDisplay.hide();
	
	$.issueDisplay = new $.issueMenu();
	$.issueDisplay.hide();
	
	$.gameSave = new $.gameLoad();
	
	$.loop();

};

$.updateDelta = function() { 
	var now = Date.now();
	$.dt = ( now - $.lt ) / ( 1000 / 60 );
	$.dt = ( $.dt < 0 ) ? 0.001 : $.dt;
	$.dt = ( $.dt > 10 ) ? 10 : $.dt;
	$.lt = now;
	$.elapsed += $.dt;
};

$.setDay = function(){
	$.guictx.fillStyle ="rgb(255,255,255)";
	$.guictx.font = "36px Verdana";	
	$.day = Math.floor($.elapsed / 400);
	$.guictx.fillText("Year " + $.day, ($.W)-200,$.H-20);
}


$.createEnemyGUI = function(){
    $.guictx.fillStyle ="rgba(255,255,255,0.7)";
	$.guictx.fillRect($.W-440,58,5,20);
	$.guictx.fillRect($.W-100,58,5,20);
	$.guictx.fillRect($.W-430,60,325*$.enemy.health().percent,15);
	$.guictx.fillStyle ="rgb(0,0,0)";
	$.guictx.font = "16px Verdana";	
	$.guictx.fillText("Enemy Planet",$.W-428 ,73);
}

$.createPlayerGUI = function(){
	//////health
    $.guictx.fillStyle ="rgba(255,255,255,0.7)";
	$.guictx.fillRect(10,18,5,20);
	$.guictx.fillRect(425,18,5,20);
	$.guictx.fillRect(20,20,400*$.player.health().percent,15);
	$.guictx.fillStyle ="rgb(0,0,0)";
	$.guictx.font = "16px Verdana";	
	$.guictx.fillText("Health",25 ,33);
	
	/////water
    $.guictx.fillStyle ="rgba("+$.elementColors['water'].r+" ,"+$.elementColors['water'].g+","+$.elementColors['water'].b+",0.7)";
	$.guictx.fillRect(20,45,$.player.elements['water'],15);
	$.guictx.fillStyle ="rgb(0,0,0)";
	$.guictx.font = "16px Verdana";	
	$.guictx.fillText("Water",25 ,58);

	/////fire
    $.guictx.fillStyle ="rgba("+$.elementColors['fire'].r+" ,"+$.elementColors['fire'].g+","+$.elementColors['fire'].b+",0.7)";
	$.guictx.fillRect(20,70,$.player.elements['fire'],15);
	$.guictx.fillStyle ="rgb(0,0,0)";
	$.guictx.font = "16px Verdana";	
	$.guictx.fillText("Fire",25 ,83);
	/////air
    $.guictx.fillStyle ="rgba("+$.elementColors['air'].r+" ,"+$.elementColors['air'].g+","+$.elementColors['air'].b+",0.7)";
	$.guictx.fillRect(20,95,$.player.elements['air'],15);
	$.guictx.fillStyle ="rgb(0,0,0)";
	$.guictx.font = "16px Verdana";	
	$.guictx.fillText("Air",25 ,108);
	
	var i = $.weaponButtons.length; while( i-- ){ $.weaponButtons[ i ].update( i ) };
		i = $.weaponButtons.length; while( i-- ){ $.weaponButtons[ i ].render( i ) };
};


$.newBattle = function(){
	$.fg1ctx.clearRect( 0, 0, $.W, $.H );
	$.mg1ctx.clearRect(0,0,$.W,$.H);
	//$.effects = [];
	$.currentStage += 1;
	$.enemy = null;
	$.enemy = new $.planet($.W-257, 250, true);
	$.createEnemyGUI();
	$.player.render();
	$.enemy.render();
	$.player.target = $.enemy;
	$.enemy.target = $.player;
	$.gameState = 'fight';
};

$.peace = function(){
	$.fg1ctx.clearRect( 0, 0, $.W, $.H );
	$.mg1ctx.clearRect(0,0,$.W,$.H);
	$.bullets = [];
	$.enemy = null;
	$.player.render();
	$.player.target = null;
	$.gameState = 'peace';
};


$.postBattle = function(){
	$.fg1ctx.clearRect( 0, 0, $.W, $.H );
	$.mg1ctx.clearRect(0,0,$.W,$.H);
	$.player.render();
	$.destinyDisplay.show();
	$.gameState = 'postBattle';
};

$.createStarsBackground = function(){
    for(i=0;i<5000;i++){
	    var X = Math.random()*$.W;
	    var Y = Math.random()*$.H;
	    var Opacity = (((Math.random()*10)+1)*0.1);
	    $.bg1ctx.fillStyle = "rgba(255,255,255," + Opacity + ")";
	    $.bg1ctx.fillRect(X,Y,1,1);
    }
};

$.saveGame = function(){
	$.effects.push( new $.textTransition(document.getElementById('savedMessage'),100,100,[".....game saved!"]));
	$.gameSave.save({ color1:$.player.color1, color2:$.player.color2, weapons:$.player.weapons, population:$.player.population, elementsPopulation:$.player.elementsPopulation, weaponSlots:$.player.weaponSlots }, $.elapsed, $.currentStage);
}

$.loadGame = function(){
	$.player = new $.planet(($.W/2) - 200, ($.H/2) +100, false);
	$.player.population = $.gameSave.data.player.population;
	$.player.elementsPopulation = $.gameSave.data.player.elementsPopulation;
	$.player.color1 = $.gameSave.data.player.color1;
	$.player.color2 = $.gameSave.data.player.color2;
	$.player.weaponSlots = $.gameSave.data.player.weaponSlots;
	$.player.weapons = [];
	var x = $.gameSave.data.player.weapons.length; 
	while( x-- ){ 
		$.player.weapons.push(new $.weapon(false, $.gameSave.data.player.weapons[x]));
	}
	$.weaponButtons = [];
	var i = 0, item;
	while(i < $.player.weaponSlots){
		if(i < $.player.weapons.length){
			item = $.player.weapons[i];
		}
		else
		{
			item = {health:0, isCpu:false, elementType:''};	
		}
		$.weaponButtons.push( new $.weaponButton(30*(i+1),160,item ));
		i++;
	}
	
	$.currentStage = $.gameSave.data.currentStage;
	$.elapsed = $.gameSave.data.elapsedTime;
}

$.loop = function(){
		requestAnimFrame( $.loop);

		if ($.gameState == 'fight')
		{
			$.updateDelta();
			$.guictx.clearRect(0,0,$.W,$.H);
			$.createPlayerGUI();
			$.createEnemyGUI();
			$.player.update();
			$.enemy.update();
			var i = $.effects.length; while( i-- ){ $.effects[ i ].update( i ) };
				i = $.bullets.length; while( i-- ){ $.bullets[ i ].update( i ) };
			$.mg1ctx.clearRect(0,0,$.W,$.H);
			i = $.effects.length; while( i-- ){ $.effects[ i ].render( ) };
			i = $.bullets.length; while( i-- ){ $.bullets[ i ].render( ) };
			$.setDay();
		}
		else if( $.gameState == 'peace' ){
			$.updateDelta();
			$.guictx.clearRect(0,0,$.W,$.H);
			$.mg1ctx.clearRect(0,0,$.W,$.H);
			$.player.update();
			$.createPlayerGUI();
			$.setDay();
			var i = $.effects.length; while( i-- ){ $.effects[ i ].update( i ) };
				i = $.effects.length; while( i-- ){ $.effects[ i ].render( ) };
			if(Math.floor(Math.random()*(500/$.dt)) == 1)
			{
				$.gameState = "fight";
				$.newBattle();
			}
		}
		else if( $.gameState == 'postBattle' ){
			$.player.update();
			var i = $.effects.length; while( i-- ){ $.effects[ i ].update( i ) };
				i = $.bullets.length; while( i-- ){ $.bullets[ i ].update( i ) };
			$.mg1ctx.clearRect(0,0,$.W,$.H);
			i = $.effects.length; while( i-- ){ $.effects[ i ].render( ) };
			i = $.bullets.length; while( i-- ){ $.bullets[ i ].render( ) };
		}
		else if( $.gameState == 'title' ){
			$.updateDelta();
			var i = $.effects.length; while( i-- ){ $.effects[ i ].update( i ) };
			$.mg1ctx.clearRect(0,0,$.W,$.H);
				i = $.effects.length; while( i-- ){ $.effects[ i ].render( ) };
		}
		
};

$.play_Click = function(resume){
	var title = document.getElementById('main-menu');
	$.elapsed =0;
	if(resume){ $.loadGame();};
	title.style.display = 'none';
	$.peace();
	$.earthStats.style.display = 'block';
	$.weaponStats.style.display = 'block';
	$.weaponDisplay.show();
	$.planetDisplay.show();
	$.effects = [];
	$.textTransition.text.style.display = 'none';
};

window.addEventListener('load', function() {
	var resumeButton = document.getElementById('resumeGame');
	$.setup();
	$.gameState = 'title'
	if($.gameSave.isEmpty()){ resumeButton.style.display = 'none'; };
	$.effects.push( new $.textTransition(document.getElementById('story'),100,100,$.story));
});