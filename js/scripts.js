jQuery(function ($) {


	var Jack =  {

		config: {
			object: $('#jack'),
			movementThreshold: 20
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
			debugger;
			var jack = this.config.object;
			var currentPosition = jack.offset(),
				top = parseInt(currentPosition.top - this.config.movementThreshold),
				newPosition = top - this.config.movementThreshold; 

			jack.css({top: newPosition});
		},

		moveDown: function() {
			debugger;
			var jack = this.config.object;
			var currentPosition = jack.offset(),
				top = parseInt(currentPosition.top + this.config.movementThreshold),
				newPosition = top + this.config.movementThreshold; 

			jack.css({top: newPosition});
		},

		reset: function() {

		}

	}

	Jack.init();

	
})