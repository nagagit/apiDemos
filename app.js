chrome.app.runtime.onLaunched.addListener(function () {
  chrome.app.window.create("window.html", {
  	id: "mainwin",
  	bounds: {width:600, height:400}
  });
});

chrome.app.window.get("viewWindow").onload = function(){
	var a = document.createElement('a');
	a.href = options.link;
	createdWindow.document.body.appendChild(a);
};


