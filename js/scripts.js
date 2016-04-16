jQuery(function ($) {


	var Jack =  {

		config: {
			object: $('#jack'),
			loadingArea: $('#loadingArea'),
			loadObjectDelay: 3000,
			movementThreshold: 20,
			itemExpiry: 4 * 1000, // 30 seconds
			checkForExpired: 1000, // every second
			distanceTolerance: 10, // px
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
			loadedItems: []
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
				logsEnabled: false
			},
			create: function (log) {
				if (this.config.logsEnabled) {
					console.log(log);
				}
			}
		},

		goodOrBad: function () {
			return Math.random() < 0.5 ? 0 : 1;
		},

		runObjects: function () {
			var items = (this.goodOrBad()) ? this.config.badGuys : this.config.goodGuys;
			for (item in items) {
				this.insertObject(items[item]);
			}
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
				jackPosition = this.config.object.offset(),
				jackPositionLeft = Math.round(parseInt(jackPosition.left)),
				tolerance = this.config.distanceTolerance;

				//this.log.create(item, itemPosition, jackPosition);

				//this.log.create((jackPosition.left - this.config.distanceTolerance));
			this.log.create(jackPositionLeft, itemPosition, tolerance);
			if (jackPositionLeft >= itemPosition + tolerance || jackPositionLeft <= itemPosition - tolerance) {
				this.log.create('Item collision' + item);
				this.showCollision();
			}
		},

		checkColisions: function() {
			
			var loadedItems = this.properties.loadedItems;
			for (var i = 0; i < loadedItems.length; i++) {

				//this.log.create(loadedItems[i]);
				this.hasCollided(loadedItems[i].guid);
			}
		},		

		showCollision: function () {
			this.log.create('Collision shown');
			//alert('Collision');
		},

		reset: function() {

		}

	}

	Jack.init();

	
})