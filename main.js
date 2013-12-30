var scoreGenerator = {
	/**
	 * Flickr URL that will give us lots and lots of whatever we're looking for.
	 * 
	 * See http://www.flickr.com/services/api/flickr.photos.search.html for
	 * details about the construction of this URL.
	 * 
	 * @type {string}
	 * @private
	 */
	fetchLiveScores_ : "http://scorespro.com/rss2/live-soccer.xml",

	/**
	 * Sends an XHR GET request to grab photos of lots and lots of kittens. The
	 * XHR's 'onload' event is hooks up to the 'listMatches_' method.
	 * 
	 * @public
	 */
	requestScores : function() {
		var req = new XMLHttpRequest();
		console.log("fetchLiveScores_ ::::" + this.fetchLiveScores_);
		req.open("GET", this.fetchLiveScores_, true);
		req.onload = this.listMatches_.bind(this);
		req.send(null);
	},

	/**
	 * Handle the 'onload' event of our kitten XHR request, generated in
	 * 'requestScores', by generating 'img' elements, and stuffing them into the
	 * document for display.
	 * 
	 * @param {ProgressEvent}
	 *            e The XHR ProgressEvent.
	 * @private
	 */
	listMatches_ : function(e) {
		var itemList = e.target.responseXML.querySelectorAll('item');
		var notID = 0;
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
			items : [ {
				title : "Item1",
				message : "This is item 1"
			}, {
				title : "Item2",
				message : "This is item 2"
			}, {
				title : "Item3",
				message : "This is item 3"
			}, {
				title : "Item4",
				message : "This is item 4"
			}, {
				title : "Item5",
				message : "This is item 5"
			}, {
				title : "Item6",
				message : "This is item 6"
			}, ]
		}, {
			type : "progress",
			title : "Progress Notification",
			message : "Short message plus an image",
			progress : 60
		}

		];
		var options = notOptions_[2];
		options.title = "Score Board";
		options.message = "All league scores";
		var path = chrome.runtime.getURL("icon.png");
		console.log(itemList.length);
		var itemz = new Array();
		for ( var i = 0; i < itemList.length; i++) {
			// alert(items[i].tagName);
			// alert(title[0].firstChild.nodeValue);
			/*itemz[i].title = "fasjdflkaj";
			itemz[i].message = itemList[i]
			.getElementsByTagName('title')[0].firstChild.nodeValue;*/
			console
					.log(itemList[i].getElementsByTagName('title')[0].firstChild.nodeValue);
		}
		
		//options.items = itemz;
		console.log(options);
		options.iconUrl = path;
		options.buttons = [];
		options.buttons.push({ title: "AJ" });

		chrome.notifications.create("id" + notID++, options, creationCallback_);
	},
};

function creationCallback_(notID) {
	console.log("Succesfully created " + notID + " notification");
};

// Window initialization code. Set up the various event handlers
window.addEventListener("load", function() {
	document.getElementById("sample").addEventListener("click",
			scoreGenerator.requestScores());
});
