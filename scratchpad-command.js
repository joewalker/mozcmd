// GCLI Browser Scratchpad
// via https://bugzilla.mozilla.org/show_bug.cgi?id=724055#c7

// gBrowser.ownerDocument.defaultView

Cu.import("resource:///modules/devtools/gcli.jsm");
gcli.addCommand({
  name: "scratchpad",
  description: "Open a Scratchpad",
  params: [
    {
      name: "file",
      type: "string",
      description: "filename of scratchpad file to open"
    },
    {
      name: "url",
      type: "string",
      description: "url of scratchpad file to open"
    },
    {
      name: "gist",
      type: "string",
      description: "gist url of scratchpad file to open"
    },
    {
      name: "pastebin",
      type: "string",
      description: "pastebin url of scratchpad file to open"
    }
  ],
  returnType: "null",
  exec: function Command_scratchpad(args, context) {
    let chromeWin = context.environment.chromeDocument.defaultView;
    let console = context.environment.contentDocument.defaultView.console;
    console.log("args: " + args.names.join(', '));
    chromeWin.Scratchpad.openScratchpad();
  }
});
