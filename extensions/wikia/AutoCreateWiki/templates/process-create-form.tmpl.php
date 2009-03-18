<!-- s:<?= __FILE__ ?> -->
<style type="text/css">
#awc-process { visibility: hidden; height: 1px; }
#awc-log { text-align: center; }
</style>
<div style="text-align:center">
	<div><img src="<?=$wgExtensionsPath?>/wikia/AutoCreateWiki/images/Installation_animation.gif?<?=$wgStyleVersion?>" width="700" height="142" /></div>
	<div id="awc-log" class="note"></div>
</div>
<br />
<iframe id="awc-process" height="10" width="50"></iframe>
<script type="text/javascript">
/*<![CDATA[*/
var YD = YAHOO.util.Dom;
var YE = YAHOO.util.Event;
var YC = YAHOO.util.Connect;
var YT = YAHOO.Tools;

YE.onDOMReady(function () {
	var loop = 0;
	var ifr = YD.get('awc-process');
	var titleUrl = '<?=$mTitle->getLocalURL()."/Processing"?>'; 
	var wgAjaxPath = wgScriptPath + wgScript;
	var redirServer = '<?=$subdomain?>';
	var errorMsg = '<?=wfMsg('autocreatewiki-errordefault')?>';
	var usedMsg = new Array();

	var setLog = function (inx, text, resType)	{
		var logSteps = YD.get('awc-log');
		var styleColor = (resType == 'OK' || resType == 'END') ? "green" : "red";
		var styleMsg = (resType == 'OK' || resType == 'END') ? '<?=wfMsg('autocreatewiki-done')?>' : '<?=wfMsg('autocreatewiki-error')?>';
		var msgType = (resType != 'END') ? '&nbsp;&nbsp;<strong style="color:' + styleColor + '">' + styleMsg + '</strong>' : "";
		logSteps.innerHTML = text + ((resType != '') ? msgType : "");
		if (typeof TieDivLibrary != "undefined" ) {
			TieDivLibrary.calculate();
		};
	}

	var prevMsg = "";
	var checkProcess = function () {
		var __callback = {
			success: function( oResponse ) {
				var data = YT.JSONParse(oResponse.responseText);
				var isError = isEnd = 0;
				if (loop == 0) ifr.src = titleUrl;
				if ( data ) {
					if (data.info != 'undefined' && data.info != '') {
						if ( !usedMsg["'" + data.info + "'"] ) {
							setLog(loop, data.info, data.type);
						}
					}
					if (data.type == 'ERROR') isError++;
					if (data.type == 'END') isEnd++;
					usedMsg["'" + data.info + "'"] = data.type;
					loop++;
				}
				
				if (isEnd > 0) {
					//window.location.href = 'http://'+redirServer+'.<?=$domain?>';
				} else if ( !(isError > 0) ) {
					if (loop < 20) {
						setTimeout(checkProcess, 666);
					} else {
						setLog(loop, errorMsg, 'ERROR');
					}
				} 
			},
			failure: function( oResponse ) {
				var res = oResponse.responseText;
				setLog(loop, res, 'ERROR');
			},
			timeout: 5000
		}
				
		YC.asyncRequest( "GET", wgAjaxPath + "?action=ajax&rs=axACWRequestCheckLog", __callback);
	}
	
	checkProcess();
});
/*]]>*/
</script>
