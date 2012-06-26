Components.utils.import("resource:///modules/devtools/gcli.jsm");

gcli.addCommand({
  name: 'find',
  description: 'Find text within the page',
  params: [
    {
      name: 'search',
      type: 'string',
      description: 'The text to search for',
    }
  ],
  exec: function(args, context) {
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    if (typeof browser.__cliFastFind == 'undefined') {
      browser.__cliFastFind = Components.classes["@mozilla.org/typeaheadfind;1"]
                               .createInstance(Components.interfaces.nsITypeAheadFind);
      browser.__cliFastFind.init(browser.docShell);
    }
    browser.__cliFastFind.find(args.search, false);
  }
});

gcli.addCommand({
  name: 'findnext',
  description: 'Find next occurrence of the text previously searched for',
  exec: function(args, context) {
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    if (typeof browser.__cliFastFind == 'undefined')
      return;
    browser.__cliFastFind.findAgain(false, false);
  }
});

gcli.addCommand({
  name: 'findprev',
  description: 'Find previous occurrence of the text previously searched for',
  exec: function(args, context) {
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    if (typeof browser.__cliFastFind == 'undefined')
      return;
    browser.__cliFastFind.findAgain(true, false);
  }
});