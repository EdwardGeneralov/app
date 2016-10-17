jsWC=window.jsWC || {}; jsWC["./extensions/wikia/AdEngine/js/AdLogicDartSubdomain.js"]=703;

/*global define*/
define('ext.wikia.adEngine.adLogicDartSubdomain', ['wikia.geo'], function (Geo) {
	'use strict';

	function getSubdomain() {
		switch (Geo.getContinentCode()) {
		case 'AF':
		case 'EU':
			return 'ad-emea';
		case 'AS':
			switch (Geo.getCountryCode()) {
			// Middle East
			case 'AE':
			case 'CY':
			case 'BH':
			case 'IL':
			case 'IQ':
			case 'IR':
			case 'JO':
			case 'KW':
			case 'LB':
			case 'OM':
			case 'PS':
			case 'QA':
			case 'SA':
			case 'SY':
			case 'TR':
			case 'YE':
				return 'ad-emea';
			default:
				return 'ad-apac';
			}
		case 'OC':
			return 'ad-apac';
		default: // NA, SA
			return 'ad';
		}
	}

	return {
		getSubdomain: getSubdomain
	};
});
