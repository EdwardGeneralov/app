<?php

/**
 * MediaTool Hooks Helper
 * @author Piotr Bablok
 */

class MediaToolHooksHelper extends WikiaModel {

	function onEditPageLayoutExecute() {

		$this->wg->Out->addScript( "<script type=\"{$this->wg->JsMimeType}\" src=\"{$this->wg->ExtensionsPath}/wikia/MediaTool/js/MediaTool.js\"></script>" );
		$this->wg->Out->addStyle( AssetsManager::getInstance()->getSassCommonURL('extensions/wikia/MediaTool/css/MediaTool.scss') );
		$this->wg->Out->addStyle( AssetsManager::getInstance()->getSassCommonURL('skins/oasis/css/core/WikiaSlider.scss') );
		return true;
	}

	function onShowEditFormInitial2($editform) {
		F::build('JSMessages')->enqueuePackage('MediaTool', JSMessages::EXTERNAL);
		F::app()->registerHook('MakeGlobalVariablesScript', 'MediaToolHooksHelper', 'onMakeGlobalVariablesScript');
		return true;
	}

	function onMakeGlobalVariablesScript($vars) {
		$vars['wgMediaToolSmallMedia'] = MediaToolController::MEDIA_SIZE_SMALL;
		$vars['wgMediaToolLargeMedia'] = MediaToolController::MEDIA_SIZE_LARGE;
		return true;
	}

}