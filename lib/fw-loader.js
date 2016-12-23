(function(d){
	var fwScript = document.currentScript || (function() {
		 var fwScripts = document.getElementsByTagName('script');
		 return fwScripts[fwScripts.length - 1];
	})();
	var fwparam = fwScript.getAttribute("data-fw-param");
	var i='fw-iframe'+Math.floor(Math.random()*9999999999);
	d.write('\x3ciframe id="'+i+'" height="150" width="150" class="fw-iframe" scrolling="no" frameborder="0" data-fw-params="'+fwparam+'">\x3c/iframe>');
	var f=d.getElementById(i).contentWindow.document;
	f.open().write('<body onload="'
		+'window.fwIframeId=\''+i+'\';'
		+'document.body.appendChild(document.createElement(\'script\')).src =\'https://feed.mikle.com/js/fw-widget.js?v=1.0\';'
		+'">');
	f.close();
	
	if (typeof _fwMsg != "function") {
		_fwMsg = function (e) {
			if (e.origin.match(/^https?:\/\/feed\.mikle\.com$/i)) {
				var data = e.data.split('|');
				var iframes = this.document.getElementsByClassName('fw-iframe');
				for (var i=0; i<iframes.length; i++) {
					if (data[0].replace(/^https?:/i,'') == iframes[i].getAttribute('src').replace(/^https?:/i,'')) {
						iframes[i].style.width = data[1];
						iframes[i].style.height = data[2];
					}
				}
			}
		};

		if (addEventListener) {
			window.addEventListener("message", _fwMsg, false);
		} else if (attachEvent) {
			window.attachEvent("onmessage", _fwMsg, false);
		} else {
			window.onmessage = _fwMsg;
		}
	}
}(document));
