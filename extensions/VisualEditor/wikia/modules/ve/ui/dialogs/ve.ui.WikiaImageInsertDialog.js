/*!
 * VisualEditor user interface WikiaImageInsertDialog class.
 */

/**
 * Dialog for inserting images.
 *
 * @class
 * @extends ve.ui.WikiaMediaInsertDialog
 *
 * @constructor
 * @param {Object} [config] Config options
 */
ve.ui.WikiaImageInsertDialog = function VeUiMWImageInsertDialog( config ) {
	// Parent constructor
	ve.ui.WikiaImageInsertDialog.super.call( this, config );
};

/* Inheritance */

OO.inheritClass( ve.ui.WikiaImageInsertDialog, ve.ui.WikiaMediaInsertDialog );
// OO.inheritClass( ve.ui.WikiaImageInsertDialog, ve.ui.FragmentDialog );

/* Static Properties */

ve.ui.WikiaImageInsertDialog.static.name = 'wikiaImageInsert';

ve.ui.WikiaImageInsertDialog.static.title = OO.ui.deferMsg( 'visualeditor-dialog-image-insert-title' );

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.WikiaImageInsertDialog.prototype.initialize = function () {
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
	this.pages.addPages( [ this.mainPage, this.searchPage ] );

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
};

/**
 * Inserts media items into the document
 *
 * @method
 * @param {Object} items Items to insert
 * @param {ve.dm.SurfaceFragment} fragment
 */
ve.ui.WikiaImageInsertDialog.prototype.insertPermanentMediaCallback = function ( items, fragment ) {
	this.insertPermanentMediaCallbackWrapper( items, fragment, 'dialog-image-insert');
};

ve.ui.windowFactory.register( ve.ui.WikiaImageInsertDialog );
