jQuery(function ($) {


	var Jack =  {

		config: {
			object: $('#jack'),
			loadingArea: $('#loadingArea'),
			loadObjectDelay: 5000,
			movementThreshold: 20,
			badGuys: {
				nappy: {
					'name': 'nappy',
					'image': 'img/nappy.png'
				}
			},
			goodGuys: {
				milkBottle: {
					'name': 'milkBottle',
					'image': 'img/bottle.png'
				},
				mummy: {
					'name': 'mummy',
					'image': 'img/mummy.png'
				}
			}
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

			// insert new object 
			setInterval(
				function () {
					_this.runObjects();
				},
				_this.config.loadObjectDelay
			);
			

		},

		goodOrBad: function () {
			return Math.random() < 0.5 ? 0 : 1;
		},

		runObjects: function () {
			var items = (this.goodOrBad()) ? this.config.badGuys : this.config.goodGuys;
			for (item in items) {
				this.insertObject(items[item]);
				console.log(item);
			}
		},

		generateId: function () {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

		    if (!length) {
		        length = Math.floor(Math.random() * chars.length);
		    }

		    var str = '';
		    for (var i = 0; i < length; i++) {
		        str += chars[Math.floor(Math.random() * chars.length)];
		    }
		    return str;
		},

		insertObject: function (item) {
			var uniqueId = this.generateId(),
				itemName = item.name,
				template = '<div data-item-name="'+itemName+'" data-item-id="'+uniqueId+'" class="object"><img src="'+item.image+'"></div>';
			this.config.loadingArea.append(template);
			this.animateObject($('[data-item-id="'+uniqueId+'"]'));
		},

		removeObject: function (item) {
			$('[data-item-name="'+item.name+'"]').remove();
		},

		animateObject: function (item) {
			debugger;
			var currentPosition = item.offset(),
				left = currentPosition.left,
				_this = this,
				i = 0;

			while (i < left) {
				var newLeft = left + _this.config.movementThreshold;
				item.css({left: newLeft});
				i++;
			}

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

		randomNumber: function (max, min) {
			return Math.random() * (max - min) + min;
		},

		startPosition: function (position) {
			return this.randomNumber(position.bottom, 0);
		},

		moveRight: function(element) {
			var object = $(element),
				startPosition = this.startPosition(object.element),
				newPosition = this.randomNumber(window.height(), 0);
		},

		reset: function() {

		}

	}

	Jack.init();

	
})