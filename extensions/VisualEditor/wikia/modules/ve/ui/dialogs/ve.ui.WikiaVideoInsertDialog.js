/*!
 * VisualEditor user interface WikiaVideoInsertDialog class.
 */

/**
 * Dialog for inserting MediaWiki media objects.
 *
 * @class
 * @extends ve.ui.FragmentDialog
 *
 * @constructor
 * @param {Object} [config] Config options
 */
ve.ui.WikiaVideoInsertDialog = function VeUiMWMediaInsertDialog( config ) {
	// Parent constructor
	ve.ui.WikiaVideoInsertDialog.super.call( this, config );
};

/* Inheritance */

OO.inheritClass( ve.ui.WikiaVideoInsertDialog, ve.ui.WikiaMediaInsertDialog );

/* Static Properties */

ve.ui.WikiaVideoInsertDialog.static.name = 'wikiaVideoInsert';

ve.ui.WikiaVideoInsertDialog.static.title = OO.ui.deferMsg( 'visualeditor-dialog-video-insert-title' );

// as in OO.ui.WindowManager.static.sizes
ve.ui.WikiaVideoInsertDialog.static.size = '840px';

ve.ui.WikiaVideoInsertDialog.static.actions = [
	{
		action: 'apply',
		label: OO.ui.deferMsg( 'visualeditor-dialog-action-apply' ),
		flags: [ 'progressive', 'primary' ]
	}
];

ve.ui.WikiaVideoInsertDialog.static.pages = [ 'main', 'search' ];

/**
 * Properly format the media policy message
 * Strip all HTML tags except for anchors. Make anchors open in a new window.
 *
 * @method
 * @param {string} html The HTML to format
 * @returns {jQuery}
 */
ve.ui.WikiaVideoInsertDialog.static.formatPolicy = function ( html ) {
	return $( '<div>' )
		.html( html )
		.find( '*' )
		.each( function () {
			if ( this.tagName.toLowerCase() === 'a' ) {
				$( this ).attr( 'target', '_blank' );
			} else {
				$( this ).contents().unwrap();
			}
		} )
		.end();
};

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.WikiaVideoInsertDialog.prototype.getBodyHeight = function () {
	return 600;
};

/**
 * @inheritdoc
 */
ve.ui.WikiaVideoInsertDialog.prototype.initialize = function () {
	var uploadEvents = {
		change: 'onUploadChange',
		upload: 'onUploadSuccess'
	};

	// Parent method
	ve.ui.WikiaMediaInsertDialog.super.prototype.initialize.call( this );

	// Properties
	this.cartModel = new ve.dm.WikiaCart();
	this.mediaPreview = new ve.ui.WikiaMediaPreviewWidget();
	this.cart = new ve.ui.WikiaCartWidget( this.cartModel );
	this.dropTarget = new ve.ui.WikiaDropTargetWidget( {
		$: this.$,
		$frame: this.$frame,
		$overlay: this.$overlay
	} );
	this.license = { promise: null, html: null };
	this.pages = new OO.ui.BookletLayout( { $: this.$ } );
	this.query = new ve.ui.WikiaMediaQueryWidget( {
		$: this.$,
		placeholder: ve.msg( 'wikia-visualeditor-dialog-wikiamediainsert-search-input-placeholder' )
	} );
	this.queryInput = this.query.getInput();
	this.queryUpload = this.query.getUpload();
	this.search = new ve.ui.WikiaMediaResultsWidget( { $: this.$ } );
	this.results = this.search.getResults();
	this.timings = {};
	this.upload = new ve.ui.WikiaUploadWidget( { $: this.$ } );

	this.$cart = this.$( '<div>' );
	this.$bodycontent = this.$( '<div>' );
	this.$mainPage = this.$( '<div>' );
	this.$policy = this.$( '<div>' )
		.addClass('ve-ui-wikiaMediaInsertDialog-policy')
		.html(
		this.constructor.static.formatPolicy(
			ve.init.platform.getParsedMessage( 'wikia-visualeditor-dialog-wikiamediainsert-policy-message' )
		)
	);
	this.$policyReadMore = this.$( '<div>' )
		.addClass( 've-ui-wikiaMediaInsertDialog-readMore' );
	this.$policyReadMoreLink = this.$( '<a>' )
		.html( ve.msg( 'wikia-visualeditor-dialog-wikiamediainsert-read-more' ) );
	this.$policyReadMore.append( this.$policyReadMoreLink );

	// Events
	this.cartModel.connect( this, {
		add: 'onCartModelAdd',
		remove: 'onCartModelRemove'
	} );
	this.cart.on( 'select', this.onCartSelect.bind( this ) );
	this.pages.on( 'set', this.onPageSet.bind( this ) );
	this.query.connect( this, {
		requestSearchDone: 'onQueryRequestSearchDone',
		requestVideoDone: 'onQueryRequestVideoDone'
	} );
	this.queryInput.connect( this, {
		change: 'onQueryInputChange',
		enter: 'onQueryInputEnter'
	} );
	this.queryInput.$input.on( 'keydown', this.onQueryInputKeydown.bind( this ) );
	this.search.connect( this, {
		nearingEnd: 'onSearchNearingEnd',
		check: 'onSearchCheck',
		select: 'onMediaPreview'
	} );

	this.upload.connect( this, uploadEvents );
	this.queryUpload.connect( this, uploadEvents );
	this.$policyReadMoreLink.on( 'click', this.onReadMoreLinkClick.bind( this ) );
	this.dropTarget.on( 'drop', this.onFileDropped.bind( this ) );

	// Initialization
	this.$mainPage.append( this.upload.$element, this.$policy, this.$policyReadMore );

	this.mainPage = new OO.ui.PageLayout( 'main', { $content: this.$mainPage } );
	this.searchPage = new OO.ui.PageLayout( 'search', { $content: this.search.$element } );
	this.pages.addPages( [ this.searchPage ] );

	this.$cart
		.addClass( 've-ui-wikiaCartWidget-wrapper' )
		.append( this.cart.$element );
	this.$bodycontent
		.addClass( 've-ui-wikiaMediaInsertDialog-content' )
		.append( this.query.$element, this.pages.$element );

	this.$body.append( this.$bodycontent, this.$cart );
	this.$content.addClass( 've-ui-wikiaMediaInsertDialog' );
	this.$frame.append( this.dropTarget.$element );
	this.$overlay.append( this.mediaPreview.$element );

	$('.ve-ui-wikiaMediaQueryWidget-uploadWrapper').addClass('ve-ui-wikiaMediaQueryWidget-uploadWrapper-video');
};

/**
 * Inserts media items into the document
 *
 * @method
 * @param {Object} items Items to insert
 * @param {ve.dm.SurfaceFragment} fragment
 */
ve.ui.WikiaVideoInsertDialog.prototype.insertPermanentMediaCallback = function ( items, fragment ) {
	var count, item, title, type, captionType,
		typeCount = { photo: 0, video: 0 },
		linmod = [];

	for ( title in items ) {
		item = items[title];
		type = 'wikiaBlock' + ( item.type === 'photo' ? 'Image' : 'Video' );
		captionType = ( item.type === 'photo' ) ? 'wikiaImageCaption' : 'wikiaVideoCaption';
		typeCount[item.type]++;
		linmod.push(
			{
				type: type,
				attributes: {
					type: 'thumb',
					align: 'default',
					href: './' + item.title,
					src: item.url,
					width: item.width,
					height: item.height,
					resource: './' + item.title,
					user: item.username
				}
			},
			{ type: captionType },
			{ type: '/' + captionType },
			{ type: '/' + type }
		);
	}

	for ( type in typeCount ) {
		count = typeCount[type];
		if ( type === 'photo' ) {
			type = 'image';
		}
		if ( count ) {
			ve.track( 'wikia', {
				action: ve.track.actions.ADD,
				label: 'dialog-video-insert-' + type,
				value: count
			} );
		}
	}

	if ( count.image && count.video ) {
		ve.track( 'wikia', {
			action: ve.track.actions.ADD,
			label: 'dialog-video-insert-multiple'
		} );
	}

	fragment.collapseToEnd().insertContent( linmod );

	ve.track( 'wikia', {
		action: ve.track.actions.SUCCESS,
		label: 'dialog-video-insert',
		value: ve.now() - this.timings.insertStart
	} );
};


ve.ui.windowFactory.register( ve.ui.WikiaVideoInsertDialog );
