function FCKeditor_OnComplete(editorInstance) {
	editorInstance.LinkedField.form.onsubmit = function() {
		if(editorInstance.EditMode == FCK_EDITMODE_SOURCE) {
			YAHOO.util.Dom.get('wysiwygData').value = '';
		} else {
			YAHOO.util.Dom.get('wysiwygData').value = YAHOO.Tools.JSONEncode(editorInstance.wysiwygData);
		}
	}
}

// start editor in source mode
function wysiwygInitInSourceMode(src) {
	var iFrame = document.getElementById('wpTextbox1___Frame');
	iFrame.style.visibility = 'hidden';

	YAHOO.log('starting in source mode...');

	var intervalId = setInterval(function() {
		// wait for FCKeditorAPI to be fully loaded
		if (typeof FCKeditorAPI != 'undefined') {
			var FCK = FCKeditorAPI.GetInstance('wpTextbox1');
			// wait for FCK to be fully loaded
			if (FCK.Status == FCK_STATUS_COMPLETE) {
				clearInterval(intervalId);
				FCK.originalSwitchEditMode.apply(FCK, []);
				FCK.WysiwygSwitchToolbars(true);
				FCK.SetData(src);
				iFrame.style.visibility = 'visible';
				document.getElementById('wysiwygTemporarySaveType').value = '1';
			}
		}
	}, 250);
}

// render and show YUI infobox
function wysiwygShowInfobox(header, body, labelOk, handlerOk) {
	Dialog = new YAHOO.widget.SimpleDialog("wysiwygInfobox",
	{
		width: "450px",
		zIndex: 999,
		effect: {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.25},
		fixedcenter: true,
		modal: true,
		draggable: true,
		close: false
	});

	var buttons = [ { text: labelOk, handler: handlerOk, isDefault: true} ];

	Dialog.setHeader(header);
	Dialog.setBody(body);
	Dialog.cfg.setProperty('icon', YAHOO.widget.SimpleDialog.ICON_INFO);
	Dialog.cfg.queueProperty("buttons", buttons);

	Dialog.render(document.body);
	Dialog.show();

	// make link to open in new window
	links = document.getElementById('wysiwygInfobox').getElementsByTagName('a');

	for (i=0; i<links.length; i++) {
		links[i].onclick = function(e) {
			var newWindow = window.open(this.getAttribute('href'), '_blank');
			newWindow.focus();
			return false;
		}
	}
}

// show first time edit message
function wysiwygShowFirstEditMessage(title, message, dismiss) {
	// client-site check for anons/logged-in
	value = $.cookies.get('wysiwyg-cities-edits');
	if (value) {
		$().log('first edit msg cookie found', 'Wysiwyg');
		return;
	}

	// tracking
	WET.byStr('wysiwyg/firstTimeEditMessage');

	// create and show YUI message
	wysiwygShowInfobox(title, message, dismiss, function() {
		this.hide();

		var checkbox = document.getElementById('wysiwyg-first-edit-dont-show-me');

		if (checkbox && checkbox.checked) {
			YAHOO.log('Wysiwyg: storing new value of wysiwyg-cities-edits');
			// for logged in store in DB
			if (wgUserName) {
				// send AJAX request
				sajax_do_call('WysiwygFirstEditMessageSave', [], function() {});
			}
			// for anon store in cookie
			else {
				$.cookies.set('wysiwyg-cities-edits', '1', {hoursToLive: 24 * 365 * 5, domain: document.domain, path: '/'});
			}
		}
	});
}

function initEditor() {
	// hide link to WikiaMiniUpload
	if($G('wmuLink')) {
		$G('wmuLink').parentNode.style.display = 'none';
	}

	var oFCKeditor = new FCKeditor("wpTextbox1");
	oFCKeditor.BasePath = window.wgWysiwygPath + '/fckeditor/';
	oFCKeditor.Config["CustomConfigurationsPath"] = window.wgWysiwygPath + '/wysiwyg_config.js';
	oFCKeditor.ready = true;
	oFCKeditor.Height = '450px';
	oFCKeditor.Width = '100%';
	oFCKeditor.ReplaceTextarea();

	// restore editor state after user returns to edit page?
	var temporarySaveType = document.getElementById('wysiwygTemporarySaveType').value;

	if (temporarySaveType != '' && !fallbackToSourceMode) {
		var content = document.getElementById('wysiwygTemporarySaveContent').value;
		YAHOO.log('restoring from temporary save', 'info', 'Wysiwyg');
		switch( parseInt(temporarySaveType) ) {
			// wysiwyg
			case 0:
				document.getElementById('wpTextbox1').value = content;
				break;

			// source
			case 1:
				wysiwygInitInSourceMode(content);
				break;
		}
	}

	// initialize editor in source mode
	if (fallbackToSourceMode) {
		wysiwygInitInSourceMode(document.getElementById('wpTextbox1').value);
	}

	// macbre: tracking
	if (typeof YAHOO != 'undefined') {
		YAHOO.util.Event.addListener(['wpSave', 'wpPreview', 'wpDiff'], 'click', function(e) {
			var elem = YAHOO.util.Event.getTarget(e);

			var buttonId = elem.id.substring(2).toLowerCase();
			var editorSourceMode = FCK.EditMode;

			WET.byStr('wysiwyg/' + buttonId + '/' + (editorSourceMode ? 'wikitextmode' : 'visualmode'));
		});
		if (fallbackToSourceMode) {
			WET.byStr('wysiwyg/edgecase');

			// track comments in wikitext
			if ($('#wpTextbox1').val().indexOf('<!--') > -1) {
				WET.byStr('wysiwyg/wikitext_comment/fallback');
			}
		}
		if (temporarySaveType != '') {
			WET.byStr('wysiwyg/temporarySave/restore');
		}
	}
}

if (typeof YAHOO.util.Event.onDOMReady != 'undefined') {
	YAHOO.util.Event.onDOMReady(function() {
		initEditor();
	});
}
else {
	addOnloadHook(initEditor);
}
