<?php

class EmbeddableDiscussionsController {
	const TAG_NAME = 'discussions';
	const ITEMS_DEFAULT = 5;
	const ITEMS_MIN = 3;
	const ITEMS_MAX = 6;
	const COLUMNS_DEFAULT = 1;
	const COLUMNS_MIN = 1;
	const COLUMNS_MAX = 2;

	const PARAM_MOSTRECENT = 'mostrecent';
	const PARAM_SIZE = 'size';
	const PARAM_COLUMNS = 'columns';
	const PARAM_CATEGORY = 'category';

	private $templateEngine;

	function __construct() {
		$this->templateEngine = ( new Wikia\Template\MustacheEngine )->setPrefix( __DIR__ . '/templates' );
	}

	public static function onParserFirstCallInit( Parser $parser ) {
		global $wgEnableDiscussions;

		if ( $wgEnableDiscussions ) {
			$parser->setHook( self::TAG_NAME, [
				'EmbeddableDiscussionsController',
				'render'
			] );
		}

		return true;
	}

	public static function onBeforePageDisplay() {
		\Wikia::addAssetsToOutput( 'embeddable_discussions_js' );
		\Wikia::addAssetsToOutput( 'embeddable_discussions_scss' );

		JSMessages::enqueuePackage( 'EmbeddableDiscussions', JSMessages::EXTERNAL );

		return true;
	}

	private function processArguments( array $args ) {
		$parameters = [
			static::PARAM_MOSTRECENT => false,
			static::PARAM_SIZE => self::ITEMS_DEFAULT,
			static::PARAM_COLUMNS => self::COLUMNS_DEFAULT,
			static::PARAM_CATEGORY => '',
		];

		// PARAM_MOSTRECENT must be bool
		if ( isset( $args[ static::PARAM_MOSTRECENT ] ) ) {
			if ( is_bool ( $args[ static::PARAM_MOSTRECENT ] ) ||
				$args[ static::PARAM_MOSTRECENT ] === 'true' ||
				$args[ static::PARAM_MOSTRECENT ] === 'false'
			) {
				$parameters[ static::PARAM_MOSTRECENT ] = $args[ static::PARAM_MOSTRECENT ];
			} else {
				$errorMessage = wfMessage( 'embeddable-discussions-parameter-error',
					static::PARAM_MOSTRECENT,
					wfMessage( 'embeddable-discussions-parameter-error-boolean' )->plain()
				)->plain();

				$this->renderError( $errorMessage );
			}
		}

		// size must be integer in range
		if ( isset( $args[ static::PARAM_SIZE ] ) ) {
			$sizeArg = $args[ static::PARAM_SIZE ];
			$size = ctype_digit( $sizeArg ) ? intval( $sizeArg ) : $sizeArg;

			if ( is_int ( $size ) &&
				$size > self::ITEMS_MIN &&
				$size <= self::ITEMS_MAX) {

				$parameters[ static::PARAM_SIZE ] = $size;
			} else {
				$errorMessage = wfMessage( 'embeddable-discussions-parameter-error',
					static::PARAM_SIZE,
					wfMessage( 'embeddable-discussions-parameter-error-range', self::ITEMS_MIN, self::ITEMS_MAX )->plain()
				)->plain();

				$this->renderError( $errorMessage );
			}
		}

		// columns must be integer in range
		if ( isset( $args[ static::PARAM_COLUMNS ] ) ) {
			$columnsArg = $args[ static::PARAM_COLUMNS ];
			$columns = ctype_digit( $columnsArg ) ? intval( $columnsArg ) : $columnsArg;

			if ( is_int( $columns ) &&
				$columns > self::COLUMNS_MIN &&
				$columns <= self::COLUMNS_MAX
			) {
				$parameters[ static::PARAM_COLUMNS ] = $columns;
			} else {
				$errorMessage = wfMessage( 'embeddable-discussions-parameter-error',
					static::PARAM_COLUMNS,
					wfMessage( 'embeddable-discussions-parameter-error-range', self::COLUMNS_MIN, self::COLUMNS_MAX )->plain()
				)->plain();

				$this->renderError( $errorMessage );
			}
		}

		if ( isset( $args[ static::PARAM_CATEGORY ] ) ) {
				$parameters[ static::PARAM_CATEGORY ] = $args[ static::PARAM_CATEGORY ];
		}



		return $parameters;
	}

	private function checkCategory( $modelData, array $args ) {
		// category must be a valid category
		if ( !empty( $modelData[ 'invalidCategory' ] ) ) {
			$errorMessage = wfMessage( 'embeddable-discussions-parameter-error',
				$args[ static::PARAM_CATEGORY ],
				wfMessage( 'embeddable-discussions-parameter-error-category' )->plain()
			)->plain();

			return $this->renderError( $errorMessage );
		}

		return true;
	}

	/**
	 * @param array $args
	 * @return string
	 */
	public function render( array $args ) {
		global $wgCityId;

		$params = $this->processArguments( $args );
		$modelData = ( new DiscussionsThreadModel( $wgCityId ) )
			->getData( $params[ static::PARAM_MOSTRECENT ], $params[ static::PARAM_SIZE ], $params[ static::PARAM_CATEGORY ] );

		$this->checkCategory( $args, $modelData );

		return F::app()->checkSkin( 'wikiamobile' ) ?
			$this->renderMobile( $modelData, $params[ static::PARAM_MOSTRECENT ], $params[ static::PARAM_SIZE ] ) :
			$this->renderDesktop( $modelData, $params[ static::PARAM_MOSTRECENT ], $params[ static::PARAM_CATEGORY ], $params[ static::PARAM_COLUMNS ] );
	}

	/**
	 * @param $errorMessage
	 * @return string
	 */
	private function renderError( $errorMessage ) {
		return $this->templateEngine->clearData()->setData( [
			'errorMessage' => $errorMessage
		] )->render( 'DiscussionError.mustache' );
	}

	/**
	 * @param $modelData
	 * @param $showLatest
	 * @param $itemCount
	 * @return string
	 */
	private function renderMobile( $modelData, $showLatest, $itemCount ) {
		// In Mercury, discussions are rendered client side as an Ember component
		$modelData = [
			'mercuryComponentAttrs' => json_encode( [
				'category' => $modelData[ 'categoryId' ],
				'show' => $showLatest ? 'latest' : 'trending',
				'itemCount' => $itemCount
			] ),
			'loading' => wfMessage( 'embeddable-discussions-loading' )->plain()
		];

		// In mercury, discussions app is rendered client side in an Ember container
		return $this->templateEngine
			->clearData()
			->setData( $modelData )
			->render( 'DiscussionThreadMobile.mustache' );
	}

	/**
	 * @param $modelData
	 * @param $showLatest
	 * @param $category
	 * @param $columns
	 * @return string
	 */
	private function renderDesktop( $modelData, $showLatest, $category, $columns ) {
		$modelData[ 'requestData' ] = json_encode( [
			'category' => $category,
			'columns' => $columns,
			'showLatest' => $showLatest,
			'upvoteRequestUrl' => $modelData[ 'upvoteRequestUrl' ],
		] );

		if ( $showLatest && $category ) {
			$heading = 'embeddable-discussions-show-latest-in-category';
		} elseif ( $showLatest ) {
			$heading = 'embeddable-discussions-show-latest';
		} elseif ( $category ) {
			$heading = 'embeddable-discussions-show-trending-in-category';
		} else {
			$heading = 'embeddable-discussions-show-trending';
		}

		$modelData[ 'columnsWrapperClass' ] =
			$columns === static::COLUMNS_MAX ?
				'embeddable-discussions-threads-columns' :
				'';
		$modelData[ 'heading' ] = wfMessage( $heading, $category )->plain();
		$modelData[ 'showAll' ] = wfMessage( 'embeddable-discussions-show-all' )->plain();
		$modelData[ 'loading' ] = wfMessage( 'embeddable-discussions-loading' )->plain();

		return $this->templateEngine
			->clearData()
			->setData( $modelData )
			->render( 'DiscussionThreadDesktop.mustache' );
	}
}
