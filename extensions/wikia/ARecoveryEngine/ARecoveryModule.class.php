<?php

class ARecoveryModule {

	/**
	 * Checks whether recovery is enabled (on current wiki)
	 *
	 * @return bool
	 */
	public static function isEnabled() {
		global $wgUser, $wgEnableUsingSourcePointProxyForCSS;

		if( $wgUser instanceof User && $wgUser->isLoggedIn() ) {
			return false;
		}

		return !empty( $wgEnableUsingSourcePointProxyForCSS );
	}
	
	public static function getSourcePointBootstrapCode() {
		if ( !static::isEnabled() ) {
			return PHP_EOL . '<!-- Recovery disabled. -->' . PHP_EOL;
		}
		return F::app()->sendRequest( 'ARecoveryEngineApiController', 'getBootstrap' );
	}
	
	public static function isLockEnabled() {
		$user = F::app()->wg->User;
		return self::isEnabled() && ( $user && !$user->isLoggedIn() );
	}
	
	public static function isPageFairRecoveryEnabled() {
		//TODO: change this
		return true;
	}
}
