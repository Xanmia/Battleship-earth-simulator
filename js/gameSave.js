
     $.gameLoad = function (){
		this.data = {};
		this.data.elapsedTime = 0;
		this.data.currentStage = 0;
		this.data.player = null;
 	 	var opt = JSON.parse( localStorage.getItem( 'progress' ) );
 		if (opt == null){
 			localStorage.setItem( 'progress', JSON.stringify(this.data) );
 		}
		else
		{
			this.data.currentStage = opt.currentStage;
			this.data.elapsedTime = opt.elapsedTime;
			this.data.player = opt.player;
		}
	 };
	 
     $.gameLoad.prototype.save = function(player, timeElapsed, currentStage){
		this.data.currentStage = currentStage;
		this.data.elapsedTime = timeElapsed;
		this.data.player = player;
		localStorage.setItem( 'progress', JSON.stringify(this.data) );
	 };
	 
     $.gameLoad.prototype.isEmpty = function(){
		if(this.data.player == null){
			return true;
		}
		return false;
	 };