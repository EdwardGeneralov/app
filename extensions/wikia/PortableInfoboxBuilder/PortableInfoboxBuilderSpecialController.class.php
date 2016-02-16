<?php

/**
 * Class WikiaMapsSpecialController
 * @desc Special:Maps controller
 */
class PortableInfoboxBuilderSpecialController extends WikiaSpecialPageController {
	const PAGE_NAME = 'PortableInfoboxBuilder';
	const PAGE_RESTRICTION = 'editinterface';
	const INFOBOX_BUILDER_MERCURY_ROUTE = 'infobox-builder';
	const PATH_SEPARATOR = '/';
	const EXPLODE_LIMIT = 2;

	/**
	 * Special page constructor
	 *
	 * @param null $name
	 * @param string $restriction
	 * @param bool $listed
	 * @param bool $function
	 * @param string $file
	 * @param bool $includable
	 */
	public function __construct( $name = null, $restriction = '', $listed = true, $function = false, $file = 'default', $includable = false ) {
		parent::__construct( self::PAGE_NAME, self::PAGE_RESTRICTION, $listed, $function, $file, $includable );
	}

	public function index() {
		$this->wg->out->setHTMLTitle( wfMessage( 'portable-infobox-builder-title' )->text() );
		if ( empty( $this->getPar() ) ) {
			$this->forward( __CLASS__, 'notitle' );
		} else {
			$this->forward( __CLASS__, 'builder' );
		}
	}

	public function noTitle() {
		$this->wg->SuppressPageHeader = true;
		$this->response->setVal( 'setTemplateNameCallToAction', wfMessage(
			'portable-infobox-builder-no-template-title-set' )->text() );
		$this->response->setTemplateEngine( WikiaResponse::TEMPLATE_ENGINE_MUSTACHE );
	}

	public function builder() {
		$title = explode( self::PATH_SEPARATOR, $this->getPar(), self::EXPLODE_LIMIT )[ 0 ];
		RenderContentOnlyHelper::setRenderContentVar( true );
		RenderContentOnlyHelper::setRenderContentLevel( RenderContentOnlyHelper::LEAVE_GLOBAL_NAV_ONLY );
		Wikia::addAssetsToOutput( 'portable_infobox_builder_scss' );
		$url = implode( self::PATH_SEPARATOR, [ $this->wg->server, self::INFOBOX_BUILDER_MERCURY_ROUTE, $title ] );
		$this->response->setVal( 'iframeUrl', $url );
		$this->response->setTemplateEngine( WikiaResponse::TEMPLATE_ENGINE_MUSTACHE );
	}
}
