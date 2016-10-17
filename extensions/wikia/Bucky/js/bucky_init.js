jsWC=window.jsWC || {}; jsWC["./extensions/wikia/Bucky/js/bucky_init.js"]=569;

/* global Weppy */
(function (context) {
	'use strict';

	context.Bucky = context.Weppy;

	if (context.define && context.define.amd) {
		context.define('bucky', [], function () {
			return context.Weppy;
		});
		context.define('weppy', [], function () {
			return context.Weppy;
		});
	}

	$(function () {
		var config = $.extend({}, context.wgWeppyConfig, {
			'context': context.wgTransactionContext
		});
		$(context).on('load', function () {
			setTimeout(function () {
				Weppy.sendPagePerformance();
			}, 0);
		});
	});

})(window);
