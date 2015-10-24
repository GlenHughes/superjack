jQuery(function ($) {


	var Jack =  {

		config: {
			object: $('#jack'),
			movementThreshold: 50
		},

		init: function() {
			this.registerEvents();
		},

		registerEvents: function() {
			var _this = this;
			$(document).on('keyup', function (event) {
				var keyCode = event.keyCode;

				// up arrow
				if (keyCode == 38) {
					_this.moveUp();
				}

				// down arrow
				if (keyCode == 40) {
					_this.moveDown();
				}
			});

		},

		moveUp: function() {
			var currentPosition = this.config.object.offset(),
				top = parseInt(currentPosition.top - this.config.movementThreshold),
				newPosition = top - this.config.movementThreshold; 
			this.config.object.css({top: ''+newPosition+'px'});
		},

		moveDown: function() {
			var currentPosition = this.config.object.offset(),
				top = parseInt(currentPosition.top + this.config.movementThreshold),
				newPosition = top + this.config.movementThreshold; 
			this.config.object.css({top: ''+newPosition+'px'});
		},

		reset: function() {

		}

	}

	Jack.init();

	
})