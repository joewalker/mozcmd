/**
* Restart command
*
* @param number url_part
*        a matching string to match the url of tabs.
*        if this value is provided, the tabs not matching the criteria would not be shifted.
*/

Components.utils.import("resource:///modules/devtools/gcli.jsm");
gcli.addCommand({
  name: "sorttabs",
  description: "Sorts tabs based on their url.",
  params: [
    {
      name: "url_part",
      type: "string",
      defaultValue: "",
      description: "Sorts tabs that contain this url part."
    }
  ],
  returnType: "null",
  exec: function Restart(args, context) {
    let gBrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let visibleTabIndex = [];
    let visibleTabs = [];
    let url_part = "";
    try {
      url_part = args.domain.replace(/^http(s)?:\/\/(www\.)?/, "").replace(/\/./, "");
    } catch (ex) {}
    for (let tab of gBrowser.visibleTabs) {
      if (!tab.pinned) {
        if (args.url_part == "" ||
            gBrowser.getBrowserForTab(tab).currentURI.spec.search(url_part) > -1) {
          visibleTabIndex.push(tab._tPos);
          visibleTabs.push(tab);
        }
      }
    }

    visibleTabs.sort(function(a, b) {
      let urlA = gBrowser.getBrowserForTab(a).currentURI.spec;
      let urlB = gBrowser.getBrowserForTab(b).currentURI.spec;
      urlA = urlA.replace(/^http(s)?:\/\/(www\.)?/, "");
      urlB = urlB.replace(/^http(s)?:\/\/(www\.)?/, "");
      return urlA > urlB;
    });
    visibleTabs.forEach(function (tab, index) {
      gBrowser.moveTabTo(tab, visibleTabIndex[index]);
    });
    return null;
  }
});
