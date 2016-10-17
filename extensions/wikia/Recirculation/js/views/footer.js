jsWC=window.jsWC || {}; jsWC["./extensions/wikia/Recirculation/js/views/footer.js"]=735;

define('ext.wikia.recirculation.views.footer', [
	'jquery',
	'wikia.window',
	'ext.wikia.recirculation.tracker',
	'ext.wikia.recirculation.utils'
], function ($, w, tracker, utils) {
	'use strict';

	function render(data) {

		return utils.renderTemplate('footer.mustache', data).then(function($html) {
			$('#WikiaArticle').append($html);

			return $html;
		});
	}

	function setupTracking(experimentName) {
		return function($html) {
			tracker.trackVerboseImpression(experimentName, 'footer');

			$html.on('mousedown', 'a', function() {
				tracker.trackVerboseClick(experimentName, utils.buildLabel(this, 'footer'));
			});
		};
	}

	return function() {
		return {
			render: render,
			setupTracking: setupTracking
		};
	};
});
