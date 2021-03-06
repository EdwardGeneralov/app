<?php
/**
 * Implements Special:Userlogout
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 * @ingroup SpecialPage
 */

/**
 * Implements Special:Userlogout
 *
 * @ingroup SpecialPage
 */
class SpecialUserlogout extends UnlistedSpecialPage {

	function __construct() {
		parent::__construct( 'Userlogout' );
	}

	function execute( $par ) {
		global $wgUser;		/* wikia change */

		/**
		 * Some satellite ISPs use broken precaching schemes that log people out straight after
		 * they're logged in (bug 17790). Luckily, there's a way to detect such requests.
		 */
		if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], '&amp;' ) !== false ) {
			wfDebug( "Special:Userlogout request {$_SERVER['REQUEST_URI']} looks suspicious, denying.\n" );
			throw new HttpError( 400, wfMessage( 'suspicious-userlogout' ), wfMessage( 'loginerror' ) );
		}

		$this->setHeaders();
		$this->outputHeader();

		$user = $this->getUser();
		$oldName = $user->getName();
		$user->logout();

		/*
		 * Special pages use the new-style context-based user object.  However, much of the rest of the world
		 * (e.g. Global Nav) uses the old-style global wgUser object.  As such, when we log out we need to
		 * ensure that both copies of the user object are properly addressed, or else parts of the page will still
		 * believe they have an authenticated user object.
		 *
		 * Once the old-style global wgUser object is fully deprecated, this line can be removed.
		*/
		$wgUser->logout();	 /* wikia change */

		// Wikia change
		// regenerate session ID on user logout to avoid race conditions with
		// long running requests logging the user back in (@see PLATFORM-1028)
		wfResetSessionID();

		$out = $this->getOutput();

		$loginUrl = ( F::app()->wg->EnableNewAuth && F::app()->checkSkin( 'wikiamobile' ) )
			? ( new UserLoginHelper() )->getNewAuthUrl()
			: SpecialPage::getTitleFor( 'UserLogin' )->getLocalURL();
		$loginLink = '<a href="' . $loginUrl . '">' . wfMessage( 'logouttext-link-text' )->escaped() . '</a>';
		$out->addHTML( wfMessage( 'logouttext' )->rawParams( $loginLink )->parse() );

		// Hook.
		$injected_html = '';
		wfRunHooks( 'UserLogoutComplete', array( &$user, &$injected_html, $oldName ) );
		$out->addHTML( $injected_html );

		$mReturnTo = $this->getRequest()->getVal( 'returnto' );
		$mReturnToQuery = $this->getRequest()->getVal( 'returntoquery' );

		$title = Title::newFromText($mReturnTo);
		if ( !empty($title) ) {
			$mResolvedReturnTo = strtolower( array_shift( SpecialPageFactory::resolveAlias( $title->getDBKey() ) ) );
			if ( in_array( $mResolvedReturnTo,array('userlogout','signup','connect') ) ) {
				$titleObj = Title::newMainPage();
				$mReturnTo = $titleObj->getText( );
				$mReturnToQuery = '';
			}
		}

		if ( empty( $mReturnTo ) && empty( $mReturnToQuery ) ) {
			$redirectUrl = $this->getRequest()->getVal( 'redirect' );

			if ( $redirectUrl && $this->isValidRedirectUrl( $redirectUrl ) ) {
				$out->redirect( $redirectUrl );
				return;
			}
		}

		$out->returnToMain( false, $mReturnTo, $mReturnToQuery );
	}

	/**
	 * Verifies that a log-out redirect URL is for a Wikia/Fandom domain
	 *
	 * @param string $url
	 * @return boolean True if the URL can be used for a redirect
	 */
	protected function isValidRedirectUrl( $url ) {
		$hostname = parse_url( $url, PHP_URL_HOST );
		return preg_match( '/(\.|^)(wikia|fandom)\.com$/', $hostname );
	}
}
