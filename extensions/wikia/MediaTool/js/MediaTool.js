var MediaTool = MediaTool || (function (smallMediaSize, largeMediaSize) {

	/** @private **/
	var cart = null;
	var itemsCollection = null;
	var renderer = null;
	var resourceLoaderCache = null;
	var dialogWrapper = null;
	var currentView = "find"; // [ find, edit ]

	/* templates */
	var templateDialog = null;
	var templateCart = null;
	var templateItemsList = null;
	var templateItem = null;
	var minMediaSize = 60;
	var maxMediaSize = 660;

	function loadResources() {
		return resourceLoaderCache = resourceLoaderCache ||
			$.Deferred(function (dfd) {
				$.when(
					$.getResources([
						wgExtensionsPath + '/wikia/MediaTool/js/Collection.js',
						wgExtensionsPath + '/wikia/MediaTool/js/Cart.js',
						wgExtensionsPath + '/wikia/MediaTool/js/Item.js',
						wgExtensionsPath + '/wikia/MediaTool/js/Renderer.js',
						wgExtensionsPath + '/wikia/MediaTool/js/ItemsCollection.js'
					]),
					$.loadMustache(),
					$.loadJQueryUI(),
					callBackend('getTemplates', function (resp) {
						templateDialog = resp['dialog'];
						templateCart = resp['cart'];
						//templateItemsList = resp['itemsList'];
						templateItemsList = $("<div>").html(resp['itemsList']).find('#mediaToolBasketTemplate').text();
						templateItem = $("<div>").html(resp['itemsList']).find('#mediaToolBasketItemTemplate').text();
					})

				).done(dfd.resolve);
			}).promise();
	}
    var initModalComplete = false;

    function initModal() {
        if (!initModalComplete) {
            // loading resources, constructing dialog
            renderer = new MediaTool.Renderer();
            itemsCollection = new MediaTool.ItemsCollection('mediatool-thumbnail-browser', 'mediaToolItemList', 'mediaToolBasket');
            itemsCollection.template = templateItemsList;
						itemsCollection.itemTemplate = templateItem;
            cart = new MediaTool.Cart('mediaToolBasket', 'mediaToolItemList');
            cart.template = templateCart;
            this.bind('Cart::itemsChanged', onCartContentChange);
			this.bind('Cart::thumbnailStyleChanged', onThumbnailStyleChange);
			this.bind('Cart::mediaSizeChanged', onMediaSizeChange);
			this.bind('Cart::mediaLocationChanged', onMediaLocationChange);

            this.bind('showModal', function() {trackMUT(WikiaTracker.ACTIONS.CLICK, 'open', wgCityId);});
            this.bind('editDone', function() {trackMUT(WikiaTracker.ACTIONS.CLICK, 'complete', wgCityId);});
            initModalComplete = true;
        }
    }

    function trackMUT(action, label, value) {
        /*
         tracking using new werehouse
         */
        WikiaTracker.trackEvent(null, {
            ga_category: 'mut',
            ga_action: action,
            ga_label: label || '',
            ga_value: value || 0
        }, 'internal');
    }

	function showModal(event) {
		var self = this;
		loadResources().done(function () {
		self.initModal();
			var processedhtml = $.mustache(templateDialog, {
					'cart':templateCart,
					'itemslist':$.mustache(templateItemsList, {
						'title':'Media recently added to wiki',
						'items':itemsCollection.items
					})
				}
			);
			dialogWrapper = $.showModal('MUT', processedhtml, { width:970, className:"MediaToolModal" });

			appendUIActions.call(self);

			self.fire('showModal');

			cart.setThumbnailStyle(self.initialMediaSettings.thumbnail);
			cart.setMediaLocation(self.initialMediaSettings.align);
			cart.setMediaSize(self.initialMediaSettings.width);

            if ( self.initialBasketContent.length ) {

                useInitialBasketContent( self.initialBasketContent, 'wiki' );

            } else {

                changeCurrentView( "find" );
            }

		});
	}

    function useInitialBasketContent( basketContent, source ) {

        var self = this;

        $( basketContent).each( function(i, item){
            cart.createItem(item, templateItem, source);
        });
        //TODO: switch to "Edit media tab"
        changeCurrentView( "find" );
    }

	function onCartContentChange() {
		if(cart.isEmpty()) {
			$('.tabs li[data-tab=edit-media]').addClass('disabled');
			$('.MediaTool-buttons button[name=continue]').attr('disabled','disabled');
		} else {
			$('.tabs li[data-tab=edit-media]').removeClass('disabled');
			$('.MediaTool-buttons button[name=continue]').removeAttr('disabled');
		}
	}

	function onMediaLocationChange() {
		$('.media-tool-media-location img').removeClass('selected');
		$('.media-tool-media-location img[data-media-location="' + cart.getMediaLocation() + '"]').addClass('selected');
	}

	function onThumbnailStyleChange() {
		$('.media-tool-thumbnail-style img').removeClass('selected');
		if(cart.getThumbnailStyle()) {
			$('.media-tool-thumbnail-style img[data-thumb-style="border"]').addClass('selected');
			$('.media-tool-thumbnail-style .thumb-style-desc').html($.msg('mediatool-thumbnail-style-border'));
		} else {
			$('.media-tool-thumbnail-style img[data-thumb-style="no-border"]').addClass('selected');
			$('.media-tool-thumbnail-style .thumb-style-desc').html($.msg('mediatool-thumbnail-style-no-border'));
		}
	}

	function onMediaSizeChange() {
		if ($("input[name='mediasize']:checked", dialogWrapper).length==0) {
			// on first display select the proper radio
			if (cart.getMediaSize() == largeMediaSize) {
				$('#mediaToolLargeMedia').attr('checked',true);
			} else if (cart.getMediaSize() == smallMediaSize) {
				$('#mediaToolSmallMedia').attr('checked',true);
			} else {
				$('#mediaToolCustomMedia').attr('checked',true);
			}
		}
		if ($('#mediaToolCustomMedia').attr("checked")) {
			$('#mediaToolMediaSizeInput').prop('disabled', false);
			$('#mediaToolMediaSizeSlider').slider("enable");
		} else {
			$('#mediaToolMediaSizeInput').prop('disabled', true);
			$('#mediaToolMediaSizeSlider').slider("disable");
		}
		$('#mediaToolMediaSizeInput').val(cart.getMediaSize());
		$('#mediaToolMediaSizeSlider').slider("value", cart.getMediaSize());
	}

	function initMediaSizeActions() {
		$('#mediaToolMediaSizeSlider').slider({
			min: minMediaSize,
			max: maxMediaSize,
			//value: 500,
			step: 3,
			slide: function(event, ui) {
				cart.setMediaSize(ui.value);
			}
		});
		$('#mediaToolMediaSizeInput').on('blur', function() {
			var val = parseInt($('#mediaToolMediaSizeInput').val(), 10);
			if ((val >= minMediaSize) && (val <= maxMediaSize)) {
				cart.setMediaSize(val);
			} else {
				if (val < minMediaSize) cart.setMediaSize(minMediaSize);
				else cart.setMediaSize(maxMediaSize);
			}
		}).on('keyup', function() {
			var val = parseInt($('#mediaToolMediaSizeInput').val(), 10);
			if ((val >= minMediaSize) && (val <= maxMediaSize)) {
				cart.setMediaSize(val);
			}
		});
		$('#mediaToolLargeMedia').on('click', function() {
			cart.setMediaSize(largeMediaSize);
		});
		$('#mediaToolSmallMedia').on('click', function() {
			cart.setMediaSize(smallMediaSize);
		});
		$('#mediaToolCustomMedia').on('click', function() {
			cart.setMediaSize(cart.getMediaSize());
		});
	}

	function closeModal() {
		//TODO: check state and add confirm
		$(dialogWrapper).closeModal();
	}

	function canEnterEditTab() {
		return cart.isEmpty() ? false : true;
	}

	function finalizeDialog() {
		this.fire('editDone', cart);
		this.closeModal();
	}

	function changeCurrentView(newView, fromTab) {

		if (newView == "edit") {

			if (canEnterEditTab()) {

				currentView = "edit";
				if (!fromTab) {
					$("ul.tabs li[data-tab='edit-media'] a", dialogWrapper).trigger("click");
				}
				$("button[name='done']", dialogWrapper).show();
				$("button[name='continue']", dialogWrapper).hide();
			}
		}

		if (newView == "find") {

			currentView = "find";
			$("button[name='done']", dialogWrapper).hide();
			$("button[name='continue']", dialogWrapper).show();
		}
	}

	function onAddViaUrlClick() {
		var videoUrl = $('#mediatool-online-url').val();

		callBackend('getVideoMetadata', { videoUrl: videoUrl }, function(response) {
			cart.createItem(response, templateItem, 'online');
		});
	}

	function appendUIActions() {
		var self = this;
		$("button[name='cancel']", dialogWrapper).on("click", function (e) {
			closeModal();
		});
		$("button[name='continue']", dialogWrapper).on("click", function (e) {
			changeCurrentView("edit");
		});
		$("button[name='done']", dialogWrapper).on("click", function (e) {
			self.finalizeDialog();
		});
		$("button[name='addviaurl']", dialogWrapper).on("click", function (e) {
			onAddViaUrlClick();
		});

		$("ul.tabs li[data-tab='edit-media'] a", dialogWrapper).on("click", function (e) {
			changeCurrentView("edit", true);
		});
		$("ul.tabs li[data-tab='find-media'] a", dialogWrapper).on("click", function (e) {
			changeCurrentView("find", true);
		});
		$(".media-tool-thumbnail-style img", dialogWrapper).on("click", function (e) {
			cart.setThumbnailStyle($(e.target).attr("data-thumb-style") == "border");
		});
		$(".media-tool-media-location img", dialogWrapper).on("click", function (e) {
			cart.setMediaLocation($(e.target).attr("data-media-location"));
		});

		initMediaSizeActions.call(self);
	}

	function callBackend(method, params, callback) {
		return $.nirvana.getJson(
			'MediaTool',
			method,
			params,
			callback
		);
	}

	/** @public **/
	var MediaToolClass = $.createClass(Observable, {

		constructor:function () {
			MediaToolClass.superclass.constructor.call(this);
			//this.debugEvents();
		},
        initModal: initModal,
		showModal: showModal,
		closeModal: closeModal,
		finalizeDialog: finalizeDialog,
		callBackend: callBackend,
		getCart: function () {
			return cart;
		},
		getItemsCollection: function () {
			return itemsCollection;
		},
		getRenderer: function() {
			return renderer;
		},
        initialBasketContent: [],
        initialMediaSettings: { align:'left', alt:"", caption:"", thumbnail:true, width:300 }
	});

	return new MediaToolClass;
})(wgMediaToolSmallMedia, wgMediaToolLargeMedia);