Components.utils.import("resource:///modules/devtools/gcli.jsm");
/*
 * bugzilla command
 * use: bug #id
 */
gcli.addCommand({
  name: 'bug',
  description: 'Shows a Mozilla Bugzilla bug',
  params: [
    {
      name: 'num',
      type: 'number',
      description: 'bug id'
    }
  ],
  exec: function(args, context) {
    let gBrowser = context.environment.chromeDocument.defaultView.gBrowser;
    let url = "https://bugzilla.mozilla.org/show_bug.cgi?id=" + args.num;
    gBrowser.selectedTab = gBrowser.addTab(url);
  }
});
