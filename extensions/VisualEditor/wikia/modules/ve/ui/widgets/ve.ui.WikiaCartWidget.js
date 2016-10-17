jsWC=window.jsWC || {}; jsWC["./extensions/VisualEditor/wikia/modules/ve/ui/widgets/ve.ui.WikiaCartWidget.js"]=1075;

/*!
 * VisualEditor UserInterface WikiaCartWidget class.
 */

/**
 * @class
 * @extends OO.ui.SelectWidget
 *
 * @constructor
 * @param {ve.dm.WikiaCart} model Cart item
 */
ve.ui.WikiaCartWidget = function VeUiWikiaCartWidget( model ) {
	ve.ui.WikiaCartWidget.super.call( this );
	this.model = model;
	this.model.connect( this, { add: 'onAdd', remove: 'onRemove' } );
	this.$element.addClass( 've-ui-wikiaCartWidget' );
};

OO.inheritClass( ve.ui.WikiaCartWidget, OO.ui.SelectWidget );

ve.ui.WikiaCartWidget.prototype.onAdd = function ( items, index ) {
	var i, widgetItems = [];
	for ( i = 0; i < items.length; i++ ) {
		widgetItems.push( new ve.ui.WikiaCartItemWidget( {
			data: items[i].getId(),
			model: items[i]
		} ) );
	}
	this.addItems( widgetItems, index );
};

ve.ui.WikiaCartWidget.prototype.onRemove = function ( items ) {
	var i, widgetItem, widgetItems = [];
	for ( i = 0; i < items.length; i++ ) {
		widgetItem = this.getItemFromData( items[i].getId() );
		if ( widgetItem ) {
			widgetItems.push( widgetItem );
		}
	}
	this.removeItems( widgetItems );
};
