/**
 * Flickr URL that will give us lots and lots of whatever we're looking for.
 * 
 * See http://www.flickr.com/services/api/flickr.photos.search.html for details
 * about the construction of this URL.
 * 
 * @type {string}
 * @private
 */
var fetchLiveScores_ = "http://pipes.yahoo.com/pipes/pipe.run?_id=KHkpIfCz3BGVw853JxOy0Q&_render=rss";
var notID = 0;
var feedLinks = [];
var notificationId = null;
var viewWindow = null;
var webView = null;

// List of sample notifications. These are further customized
// in the code according the UI settings.
var notOptions_ = [ {
	type : "basic",
	title : "Basic Notification",
	message : "Short message part",
	expandedMessage : "Longer part of the message",
}, {
	type : "image",
	title : "Image Notification",
	message : "Short message plus an image",
}, {
	type : "list",
	title : "List Notification",
	message : "List of items in a message",
	items : []
}, {
	type : "progress",
	title : "Progress Notification",
	message : "Short message plus an image",
	progress : 60
}

];

/**
 * Sends an XHR GET request to grab photos of lots and lots of kittens. The
 * XHR's 'onload' event is hooks up to the 'listMatches_' method.
 * 
 * @public
 */
function requestScores() {
	$.get(this.fetchLiveScores_, listMatches_);
};

/**
 * Handle the 'onload' event of our kitten XHR request, generated in
 * 'requestScores', by generating 'img' elements, and stuffing them into the
 * document for display.
 * 
 * @param {ProgressEvent}
 *            e The XHR ProgressEvent.
 * @private
 */
function listMatches_(result) {
	var title = null;
	var $singleItem = null;
	var imageLink = null;
	var options = null;
	var feedLink = null;
	$(result).find('item').each(function() {
		$singleItem = $(this);
		title = $singleItem.find('title').text();
		imageLink = $singleItem.find('media\\:content, content').attr('url');
		feedLink = $singleItem.find('link').text();
		if (imageLink != null && imageLink != 'undefined') {
			options = notOptions_[1];
			options.iconUrl = chrome.runtime.getURL("icon.png");
			options.title = "";
			options.message = title;
			getImageSynchronousReq(imageLink, options, feedLink);
		} else {
			options = notOptions_[0];
			options.iconUrl = chrome.runtime.getURL("icon.png");
			options.title = "";
			options.message = title;
			showNotification(options, feedLink);
		}
		options = null;
	});

};

function showNotification(options, feedLink) {
	notificationId = "id" + notID++;
	chrome.notifications.create(notificationId, options, creationCallback_);
	feedLinks[notificationId] = feedLink;
}

function openTab(url) {
	var a = document.createElement('a');
	a.href = url;
	a.target = '_blank';
	a.click();
}

function getImageSynchronousReq(imageLink, options, feedLink) {
	var img = null;
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("image/png");
	xhr.open('GET', imageLink, true);
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
		img = document.createElement('img');
		img.src = window.webkitURL.createObjectURL(this.response);
		options.imageUrl = img.src;
		console.log(options.imageUrl);
		showNotification(options, feedLink);
	};
	xhr.send();
}

function creationCallback_(notID) {
	console.log("Succesfully created " + notID + " notification");
}

$(document).ready(
		function() {
			document.getElementById("sample").addEventListener("click",
					doSomething);
			chrome.notifications.onClicked.addListener(createViewWindow);
			onload = function() {
				webView = viewWindow.contentWindow.document
						.getElementById('myWebView');
				webView.addEventListener("loadstart", showLoading);
				webView.addEventListener("loadstop", stopLoading);
			};
		});

function createViewWindow(notID) {
	chrome.app.window
			.create(
					"view.html",
					{
						id : "viewWindow",
						bounds : {
							width : 600,
							height : 400
						}
					},
					function(createdWindow) {
						createdWindow.contentWindow.onload = function() {
							createdWindow.contentWindow.document
									.getElementById('myWebView').src = feedLinks[notID];
							viewWindow = createdWindow;
							viewWindow.onClosed.addListener(function() {
								viewWindow = null;
							});
						};
					});

	if (viewWindow != null && viewWindow != 'undefined') {
		if (webView != null && webView != 'undefined') {
			webView.src = feedLinks[notID];
		} else {
			webView = viewWindow.contentWindow.document
					.getElementById('myWebView');
			webView.src = feedLinks[notID];
		}
	}
}

function showLoading(event) {
	if (event.currentTarget.getAttribute('id') == 'myWebView'
			&& !event.isTopLevel && event.url == webView.src) {
		webView.style.display = 'none';
		// viewWindow.contentWindow.document.getElementById('spanImg').style.display
		// = 'inline';
		viewWindow.contentWindow.document.getElementById('spanImg').innerText = 'LOADING>>>>>>>>>';
	}
}

function stopLoading(event) {
	if (event.currentTarget.getAttribute('id') == 'myWebView'
			&& !event.isTopLevel && event.url == webView.src) {
		// viewWindow.contentWindow.document.getElementById('spanImg').style.display
		// = 'none';
		webView.style.display = 'inline';
		viewWindow.contentWindow.document.getElementById('spanImg').innerText = '';
	}
}

function closeWindow(viewWindow) {
	console.log(viewWindow);
}

function doSomething() {
	requestScores();
	setInterval(requestScores, 3600000);
}
