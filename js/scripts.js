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
			var jack = this.config.object,
				newTop = parseInt(jack.offset().top - (this.config.movementThreshold * 2));

			jack.css({top: newTop});
		},

		moveDown: function() {
			var jack = this.config.object,
				newTop = parseInt(jack.offset().top + this.config.movementThreshold);

			jack.css({top: newTop});
		},

		reset: function() {

		}

	}

	Jack.init();

	
})