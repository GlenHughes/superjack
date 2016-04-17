jQuery(function ($) {


	var Jack =  {

		config: {
			wrapper: $('#wrapper'),
			object: $('#jack'),
			loadingArea: $('#loadingArea', this.wrapper),
			loadObjectDelay: 3000,
			movementThreshold: 20,
			itemExpiry: 4 * 1000, // 4 seconds
			checkForExpired: 200, // every second
			topDistanceTolerance: 40,
		 	sideDistanceTolerance: 25, // px
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
			wrapper: $('#music'),
			player: null,
			gameOver: $('#gameOverMusic', this.wrapper)[0],
			intro: $('#introMusic', this.wrapper)[0],
			playingMusic: $('#gamePlay', this.wrapper)[0],
			autoPlay: false,
			playing: false,
			init: function () {
				if (this.autoPlay) {
					this.play('intro');
				}
			},
			play: function (music) {
				this.reset();
				this.player = this[music];
				this.playing = true;
				this.player.play();
			
			},
			pause: function () {
				if (this.player) {
					this.player.pause();
					this.playing = false;
				}
			},
			reset: function () {
				this.pause();
				this['gameOver'].currentTime = 0;
				this['intro'].currentTime = 0;
				this['playingMusic'].currentTime = 0;
			}
		},

		init: function() {
			this.music.init();
			this.music.play('intro');
			this.registerEvents();
		},

		registerEvents: function() {
			var _this = this;

			// play button
			$('[data-play]').on('click', function () {
				_this.resetObjects();
				$(this).parents('div.blackBackground').addClass('hidden');
				_this.properties.gameIsRunning = true;
				_this.music.play('playingMusic');
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
			// load the item into the dom
			this.config.loadingArea.append(template);
			// update loaded items property
			this.properties.loadedItems.push({name: name, guid: guid, image: image, created: created});

			//this.log.create('Created item: ' + guid);
		},

		removeObject: function (guid, index) {
			// remove the item from the page
			$('[data-item-id="'+guid+'"]').remove();
			// remove from items array
			this.properties.loadedItems.splice(index, 1);

			// score the user for one item clearing
			this.score.increaseScore(1);
		},

		clearOldObjects: function () {
			var loadedItems = this.properties.loadedItems,
				totalItems = loadedItems.length || 0;

			for(var i =0; i < totalItems; i++) {
				var item = loadedItems[i] || null;

				if (item) {
					var	created = item.created || 0,
						now = new Date().getTime();

					if ( (created + this.config.itemExpiry) < now) {
						//this.log.create('Removed item: ' + guid);
						this.removeObject(item.guid, i);
					}
				}
			}
		},

		resetObjects: function () {
			$('.item', this.wrapper).slideUp(function () {
				$(this).remove();
			});
			// clear old items from memory
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
				topTolerance = this.config.topDistanceTolerance,
				sideTolerance = this.config.sideDistanceTolerance,
				
				horizontalConflict = false,
				verticalConflict = false;

			verticalConflict =  (this.isBetween(jackPositionTop, itemTop - topTolerance, itemTop + topTolerance, 'top'));
			horizontalConflict = (this.isBetween(jackPositionLeft, itemLeft - sideTolerance, itemLeft + sideTolerance, 'side'));

			if (verticalConflict && horizontalConflict) {
				this.gameOver();
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

		isBetween: function (number, min, max, axis) {
			number 	= parseInt(number);
			min 	= parseInt(min);
			max 	= parseInt(max);

			if (number >= min && number <= max) {
				this.log.create('isBetween: asix: ' + axis + ' number: ' + number + ' min: ' + min + ' max: ' + max);
				return true;
			}
			//this.log.create('Numnber is not between: number: ' + number + ' min: ' + min + ' max: ' + max);
			return false;
		},

		score: {
			wrapper: $('#score'),
			scorePlaceholder: $('.score', this.wrapper),
			totalScore: 0,
			renderScore: function () {
				this.scorePlaceholder.animateNumber({number: this.totalScore});
				//this.scorePlaceholder.text(this.totalScore);
			},
			increaseScore: function (scoreIncrease) {
				this.totalScore = this.totalScore + scoreIncrease;
				this.renderScore();
			},
			resetScore: function () {
				this.totalScore = 0;
				this.renderScore();
			}
		},

		gameOver: function () {
			this.log.create('Game over');

			// halt game
			this.properties.gameIsRunning = false;

			// clear objects
			this.resetObjects();

			// reset the score
			this.score.resetScore();

			// show game over UI
			$('#gameOver').removeClass('hidden');
			this.music.play('gameOver');
			this.music.player.play();
		},

		reset: function() {
			this.log.create('Reset');
		}

	}

	Jack.init();

});