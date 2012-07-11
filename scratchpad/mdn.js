/*
 * mdn command
 * use: mdn <query>
 */
gcli.addCommand({
  name: 'mdn',
  description: 'Searches the Mozilla Developer Network',
  params: [
    {
      name: 'query',
      type: { name: 'array', subtype: 'string' },
      description: 'Query to search for on MDN'
    }
  ],
  exec: function(args, context) {
    let gBrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let url = "https://developer.mozilla.org/en-US/search?q=" + encodeURIComponent(args.query.join(' '));
    gBrowser.selectedTab = gBrowser.addTab(url);
  }
});