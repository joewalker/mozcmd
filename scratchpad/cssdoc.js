Components.utils.import("resource:///modules/devtools/gcli.jsm");

gcli.addCommand({
  name: 'cssdoc',
  description: 'Documentation for CSS properties',
  returnType: 'html',
  params: [
    {
      name: 'property',
      type: 'string',
      description: 'property name',
    }
  ],
  exec: function(args, context) {
    let promise = context.createPromise();
    let url = "https://developer.mozilla.org/en/CSS/" + args.property;
    let browserDoc = context.environment.chromeDocument;
    let iframe = browserDoc.createElement("iframe");
    iframe.setAttribute("style", "visibility:collapse");
    iframe.setAttribute("src", url);
    browserDoc.documentElement.appendChild(iframe);
    iframe.addEventListener("load", function() {
        let doc = iframe.contentDocument;
        let container = doc.getElementById("pageText");
        if (!container) {
            promise.resolve("Unexpected content: <a href='" + url + "'>link</a>.");
        } else {
            let divs = container.parentNode.querySelectorAll("#pageText > div");
            if (divs.length == 0) {
                promise.resolve("Unexpected content: <a href='" + url + "'>link</a>.");
            } else {
                this.buildResponse(promise, divs);
            }
        }
        iframe.parentNode.removeChild(iframe);
    }.bind(this), true);
    return promise;
  },
  buildResponse: function(promise, divs) {
    let doc = divs[0].ownerDocument;
    let summary = divs[0].cloneNode(divs[0]);
    
    let div = doc.createElement("div");

    let h1 = doc.createElement(h1);
    h1.textContent = doc.title;
    
    let link = doc.createElement("a");
    link.textContent = doc.defaultView.location;
    link.setAttribute("href", doc.defaultView.location);
    link.setAttribute("style", "float:right");
    link.setAttribute("target", "_blank");

    div.appendChild(h1);
    div.appendChild(link);
    div.appendChild(summary);
    
    promise.resolve(div);
  },
});