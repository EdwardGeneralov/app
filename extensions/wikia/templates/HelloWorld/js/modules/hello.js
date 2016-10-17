jsWC=window.jsWC || {}; jsWC["./extensions/wikia/templates/HelloWorld/js/modules/hello.js"]=275;

define('hello', ['wikia.nirvana'], function(nirvana) {
	function getContent(callback) {
		nirvana.sendRequest({
			controller: 'HelloWorld',
			method: 'index',
			format: 'html',
			type: 'get',
			callback: callback
		});
	}

	// module export list
	return getContent;
});
