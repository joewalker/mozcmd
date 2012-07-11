Components.utils.import("resource:///modules/devtools/gcli.jsm");

gcli.addCommand({
  name: 'find',
  description: 'Find text within the page',
  params: [
    {
      name: 'search',
      type: 'string',
      description: 'The text to search for',
    },
    {
      name: 'ignorecase',
      type: 'boolean',
      defaultValue: false
    }
  ],
  exec: function(args, context) {
    let tabbrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let browser = tabbrowser.getBrowserForTab(tabbrowser.selectedTab);
    
    // We need to use a seperate nsITypeaheadFind or we will interfere with
    // the browser's findbar. If we didn't do this, you could type find foo,
    // open the findbar and search for bar, return to the command line and type
    // findnext -  the findnext would look for the next occurrence of bar 
    // instead of foo
    if (typeof browser.__cliFastFind == 'undefined') {
      browser.__cliFastFind = Components.classes["@mozilla.org/typeaheadfind;1"]
                               .createInstance(Components.interfaces.nsITypeAheadFind);
      browser.__cliFastFind.init(browser.docShell);
    }
    if (args.ignorecase)
      browser.__cliFastFind.caseSensitive = false;
    else
      browser.__cliFastFind.caseSensitive = true;
    let res = browser.__cliFastFind.find(args.search, false);
    if (res == Components.interfaces.nsITypeAheadFind.FIND_NOTFOUND)
      context.exec("echo Phrase not found");
  }
});

gcli.addCommand({
  name: 'findnext',
  description: 'Find next occurrence of the text previously searched for',
  exec: function(args, context) {
    let tabbrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let browser = tabbrowser.getBrowserForTab(tabbrowser.selectedTab);
    if (typeof browser.__cliFastFind == 'undefined')
      return;
    browser.__cliFastFind.findAgain(false, false);
  }
});

gcli.addCommand({
  name: 'findprev',
  description: 'Find previous occurrence of the text previously searched for',
  exec: function(args, context) {
    let tabbrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let browser = tabbrowser.getBrowserForTab(tabbrowser.selectedTab);
    if (typeof browser.__cliFastFind == 'undefined')
      return;
    browser.__cliFastFind.findAgain(true, false);
  }
});