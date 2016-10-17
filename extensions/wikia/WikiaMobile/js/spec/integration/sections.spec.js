jsWC=window.jsWC || {}; jsWC["./extensions/wikia/WikiaMobile/js/spec/integration/sections.spec.js"]=2930;

/*global describe, it, runs, waitsFor, expect, require, document*/
xdescribe("Sections module", function () {
	'use strict';

	var sections = modules.sections(jQuery);

	it('should be defined', function(){
		expect(sections).toBeDefined();
		expect(typeof sections).toBe('object');
		expect(typeof sections.scrollTo()).toBe('function');
		expect(typeof sections.current).toBe('function');
		expect(typeof sections.list).toBe('object`');
	});

	it('should init sections', function(){

		getBody().innerHTML = '<div id="wkPage"><div id="mw-content-text"><h2>one</h2><p>test</p>test<p>test</p><p>test</p><h2>two</h2><p>test</p><div>test</div></div></div>';


		var h2s = document.querySelectorAll('h2');

		expect(h2s).toBeDefined();

		for(var i = 0, l = h2s.length; i < l; i++) {
			expect(h2s[i].className).toMatch('collSec');
			expect(h2s[i].children[0].className).toMatch('chev');
			expect(h2s[i].nextElementSibling).toBeDefined();
			expect(h2s[i].nextElementSibling.className).toMatch('artSec');
		}
	});

	it('should open/close/toggle section', function(){
		getBody().innerHTML = '<div id="wkPage"><div id="mw-content-text"><div></div><h2 id="one">one</h2><p>test</p>test<p>test</p><p>test</p><h2>two</h2><p>test</p><div>test</div></div></div>';

		sections.init();

		var h2s = document.querySelectorAll('h2');

		for(var i = 0, l = h2s.length; i < l; i++) {
			sections.open(h2s[i]);
			expect(h2s[i].className).toMatch('open');
			expect(h2s[i].nextElementSibling.className).toMatch('open');
		}

		for(i = 0; i < l; i++) {
			sections.close(h2s[i]);
			expect(h2s[i].className).not.toMatch('open');
			expect(h2s[i].nextElementSibling.className).not.toMatch('open');
		}

		for(i = 0; i < l; i++) {
			sections.toggle(h2s[i]);
			expect(h2s[i].className).toMatch('open');
			expect(h2s[i].nextElementSibling.className).toMatch('open');
		}

		for(i = 0; i < l; i++) {
			sections.toggle(h2s[i]);
			expect(h2s[i].className).not.toMatch('open');
			expect(h2s[i].nextElementSibling.className).not.toMatch('open');
		}

		sections.open('one');
		expect(h2s[0].className).toMatch('open');
		expect(h2s[0].nextElementSibling.className).toMatch('open');


		sections.close('one');
		expect(h2s[0].className).not.toMatch('open');
		expect(h2s[0].nextElementSibling.className).not.toMatch('open');
	});

	it('should fire events', function(){
		getBody().innerHTML = '<div id="wkPage"><div id="mw-content-text"><h2>one</h2><p>test</p>test<p>test</p><p>test</p><h2>two</h2><p>test</p><div>test</div></div></div>';

		jasmine.Clock.useMock();

		sections.init();

		var success = false;

		$(document).on({
			'sections:open': function(){
				sections.close(document.getElementsByTagName('h2')[0]);
			},
			'sections:close': function(){
				success = true;
			}
		});

		sections.open(document.getElementsByTagName('h2')[0]);

		jasmine.Clock.tick(2);

		expect(success).toBeTruthy('Both callbacks should be called');
	});
});
