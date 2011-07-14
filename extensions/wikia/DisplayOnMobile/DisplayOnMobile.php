<?php
/**
 * DisplayOnMobile
 *
 * @file
 * @ingroup Extensions
 * @author Łukasz Garczewski (TOR) <tor@wikia-inc.com>
 * @date 2011-07-14
 * @copyright Copyright © 2011 Łukasz Garczewski, Wikia Inc.
 * @license http://www.gnu.org/copyleft/gpl.html GNU General Public License 3.0 or later
 */

if ( !defined( 'MEDIAWIKI' ) ) {
        echo "This is a MediaWiki extension named DisplayOnMobile.\n";
        exit( 1 );
}

// Extension credits that will show up on Special:Version
$wgExtensionCredits['parserhook'][] = array(
        'name' => 'DisplayOnMobile',
        'version' => '1.0',
        'author' => "[http://www.wikia.com/wiki/User:TOR Łukasz 'TOR' Garczewski]",
);

$wgHooks['ParserFirstCallInit'][] = 'efDisplayOnMobileInit';

function efDisplayOnMobileInit(&$parser) {
        $parser->setHook( 'mobile', 'efOnMobileDisplay' );
        $parser->setHook( 'nomobile', 'efOnMobileHide' );
        return true;
}

function efOnMobileDisplay( $contents, $attributes, $parser ) {
	$wgUser;

	$skin = $wgUser->getSkin();

	if ( $skin->getSkinName() == 'wikiaphone' ) {
		return $contents;
	} else {
		return '';
	}
}

function efOnMobileHide( $contents, $attributes, $parser ) {
	global $wgUser;

	$skin = $wgUser->getSkin();

	if ( $skin->getSkinName() == 'wikiaphone' ) {
		return '';
	} else {
		return $contents;
	}
}
