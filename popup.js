// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */

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
  fetchLiveScores_: "http://feeds.feedburner.com/SoccerBoards?format=xml",

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'listMatches_' method.
   *
   * @public
   */
  requestScores: function() {
    var req = new XMLHttpRequest();
    console.log("fetchLiveScores_ ::::" + this.fetchLiveScores_);
    req.open("GET", this.fetchLiveScores_, true);
    req.onload = this.listMatches_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestScores', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  listMatches_: function (e) {
    var items = e.target.responseXML.querySelectorAll('item');
    var ul = document.createElement('ul');
    for (var i = 0; i < items.length; i++) {
      //alert(items[i].tagName);
      //alert(title[0].firstChild.nodeValue);
      var li = document.createElement('li');
      var linkBuilder = "<a href='" +  items[i].getElementsByTagName('link')[0].firstChild.nodeValue + "' id='" 
      					+ items[i].getElementsByTagName('guid')[0].id + "'>" 
      					+ items[i].getElementsByTagName('title')[0].firstChild.nodeValue + "</a>";
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML+=items[i].getElementsByTagName('description')[0].firstChild.nodeValue;
      li.innerHTML+= linkBuilder + "<br/>" + items[i].getElementsByTagName('description')[0].firstChild.nodeValue.split('<br/>')[0] 
      				+ "<br/>" + tempDiv.getElementsByTagName('b')[0].firstChild.nodeValue ;
      ul.appendChild(li);
    }
    document.body.appendChild(ul);
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }*/
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  scoreGenerator.requestScores();
});
