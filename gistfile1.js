/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text,
 * 2. Inspect to bring up an Object Inspector on the result, or,
 * 3. Display to insert the result in a comment after the selection.
 */

Components.utils.import("resource:///modules/devtools/gcli.jsm");

gcli.addCommand({
  name: 'find',
  description: 'Find text',
  params: [
    {
      name: 'search',
      type: 'string',
      description: 'What to look for',
    }
  ],
  exec: function(args, context) {    
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    browser.fastFind.find(args.search, false);
  }
});

gcli.addCommand({
  name: 'findnext',
  description: 'Find next occurrence of previously searched for text',
  exec: function(args, context) {
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    browser.fastFind.findAgain(false, false);
  }
});

gcli.addCommand({
  name: 'findprev',
  description: 'Find previous occurrence of previously searched for text',
  exec: function(args, context) {
    let browser = context.environment.chromeDocument.defaultView.gBrowser;
    browser.fastFind.findAgain(true, false);
  }
});