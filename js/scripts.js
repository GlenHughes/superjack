jQuery(function ($) {


	var Jack =  {

		config: {
			object: $('#jack'),
			loadingArea: $('#loadingArea'),
			loadObjectDelay: 3000,
			movementThreshold: 20,
			itemExpiry: 4 * 1000, // 30 seconds
			checkForExpired: 1000, // every second
			distanceTolerance: 25, // px
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
				}
			}
		},

		properties: {
			loadedItems: [],
			gameIsRunning: false
		},

		music: {
			player: null,
			gameOver: $('#gameOverMusic')[0],
			intro: $('#introMusic')[0],
			autoPlay: false,
			playing: false,
			init: function () {
				if (this.autoPlay) {
					this.play('intro');
				}
			},
			isPlaying: function (music) {
				console.log(music);
			},
			play: function (music) {
				if (!this.playing) {
					this.player = this[music];
					this.player.play();
				}
			},
			pause: function () {
				this.player.pause();
				this.playing = false;
			},
			reset: function () {
				this.player.currentTime = 0;
			}
		},

		init: function() {
			this.music.init();
			this.registerEvents();
		},

		registerEvents: function() {
			var _this = this;

			// play button
			$('[data-play]').on('click', function () {
				$(this).parents('div.blackBackground').addClass('hidden');
				_this.properties.gameIsRunning = true;
			});

			// controls
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

			// clear expired objects
			setInterval(
				function () {
					_this.clearOldObjects();
				},
				_this.config.checkForExpired
			);

			// check collisions
			setInterval(
				function () {
					_this.checkColisions();
				},
				100
			);

		},


		log: {
			config: {
				logsEnabled: true
			},
			create: function (log) {
				if (this.config.logsEnabled) {
					console.log(log);
				}
			}
		},

		runObjects: function () {
			// only run if game isnt over
			if (this.properties.gameIsRunning) {
				var items = (this.goodOrBad()) ? this.config.badGuys : this.config.goodGuys;
				for (item in items) {
					this.insertObject(items[item]);
				}
			}
		},

		goodOrBad: function () {
			return Math.random() < 0.5 ? 0 : 1;
		},

		randomTopPosition: function () {
			var windowHeight = $(window).height();
			return this.randomNumber(0, windowHeight);
		},

		insertObject: function (item) {
			var top = this.randomTopPosition(),
				guid = this.generateGUID(),
				name = item.name,
				image = item.image,
				created = new Date().getTime();

			var template = '<div class="slideRight item" data-item-name="'+name+'" data-item-id="'+guid+'" style="top: '+top+'px;"><img src="'+image+'"></div>';
			// debugger;
			// load the item into the dom
			this.config.loadingArea.append(template);
			// update loaded items property
			this.properties.loadedItems.push({name: name, guid: guid, image: image, created: created});

			//this.log.create('Created item: ' + guid);
		},

		removeObject: function (guid, index) {
			$('[data-item-id="'+guid+'"]').remove();
			this.properties.loadedItems.splice(index, 1);

		},

		clearOldObjects: function () {
			var loadedItems = this.properties.loadedItems,
				totalItems = loadedItems.length || 0;

			for(var i =0; i < loadedItems.length; i++) {
				var created = loadedItems[i].created,
					now = new Date().getTime();

				if ( (created + this.config.itemExpiry) < now) {
					var guid = loadedItems[i].guid;
					//this.log.create('Removed item: ' + guid);
					this.removeObject(guid, i);
				}
			}
		},

		resetObjects: function () {
			this.properties.loadedItems = [];
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

		generateSeed: function () {
			return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
		},

		generateGUID: function () {
			  return this.generateSeed() + this.generateSeed() + '-' + this.generateSeed() + '-' + this.generateSeed() + '-' +
			    this.generateSeed() + '-' + this.generateSeed() + this.generateSeed() + this.generateSeed();
		},

		hasCollided: function (guid) {
			var item = $('[data-item-id="'+guid+'"]'),
				itemPosition = item.offset(),
				itemTop = itemPosition.top,
				itemLeft = itemPosition.left,

				jack = this.config.object,
				jackWidth = jack.width() / 2,
				jackHeight = jack.height() / 2,
				jackPosition = this.config.object.offset(),
				jackPositionTop = jackPosition.top + jackHeight,
				jackPositionLeft = jackPosition.left + jackWidth,
				tolerance = this.config.distanceTolerance;

			//this.log.create('hasCollided: ' + jackPositionLeft, itemPosition, tolerance);
			// top conflict
			if (this.isBetween(jackPositionTop, itemPosition.top - tolerance, itemPosition.top + tolerance)) {
				this.log.create('Item top collision' + item);
				return this.gameOver();
			}

			// left conflict
			if (this.isBetween(jackPositionLeft, itemPosition.left + tolerance, itemPosition.left - tolerance)) {
				this.log.create('Item left collision' + item);
				return this.gameOver();
			}

		},

		checkColisions: function() {
			var loadedItems = this.properties.loadedItems;
			for (var i = 0; i < loadedItems.length; i++) {

				//this.log.create(loadedItems[i]);
				this.hasCollided(loadedItems[i].guid);
			}
		},		

		// will show animated image etc
		showCollision: function () {
			this.log.create('Collision shown');
			//alert('Collision');
		},

		isBetween: function (number, min, max) {
			number 	= parseInt(number);
			min 	= parseInt(min);
			max 	= parseInt(max);

			if (number >= min && number <= max) {
				this.log.create('Numnber is between: number: ' + number + ' min: ' + min + ' max: ' + max);
				return true;
			}
			//this.log.create('Numnber is not between: number: ' + number + ' min: ' + min + ' max: ' + max);
			return false;
		},

		gameOver: function () {
			this.log.create('Game over');
			this.properties.gameIsRunning = false;
			this.resetObjects();

			$('#gameOver').removeClass('hidden');
			this.music.reset();
			this.music.play();
		},

		reset: function() {
			this.log.create('Reset');
		}

	}

	Jack.init();

	
})