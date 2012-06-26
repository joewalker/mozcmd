/**
 * Restart command
 *
 * @param number delay
 *        delay in seconds for the restart
 * @param boolean disableFastload
 *        disabled loading from cache upon restart.
 */

Components.utils.import("resource:///modules/devtools/gcli.jsm");
gcli.addCommand({
  name: "restart",
  description: "Restarts Firefox",
  params: [
    {
      name: "delay",
      type: "number",
      defaultValue: 0,
      description: "Delay (in seconds) for the restart"
    },
    {
      name: "disableFastload",
      type: "boolean",
      defaultValue: false,
      description: "Disables Fastload Cache while restarting"
    }
  ],
  returnType: "html",
  exec: function Restart(args, context) {
    let {classes: Cc, interfaces: Ci} = Components;
    let HTML = "http://www.w3.org/1999/xhtml";
    let browserDoc = context.environment.chromeDocument;
    let canceled = Cc["@mozilla.org/supports-PRBool;1"]
      .createInstance(Ci.nsISupportsPRBool);
    Services.obs.notifyObservers(canceled, "quit-application-requested", "restart");
    if (canceled.data) {
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "Restart request cancelled by user.";
      return div;
    }

    // disable fastload cache
    if (args.disableFastload) {
      Services.appinfo.invalidateCachesOnRestart();
    }

    function restart() {
      Cc['@mozilla.org/toolkit/app-startup;1']
        .getService(Ci.nsIAppStartup)
        .quit(Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
    }

    // restart after the delay
    if (args.delay && args.delay > 0) {
      let delay = Math.floor(args.delay);
      function countdownTimer() {
        delay--;
        div.innerHTML = "Restarting in " + delay + " seconds.";
        if (delay > 0) {
          browserDoc.defaultView.setTimeout(countdownTimer, 1000);
        }        
      }
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "Restarting in " + delay + " seconds.";
      browserDoc.defaultView.setTimeout(countdownTimer, 1000);
      browserDoc.defaultView.setTimeout(restart, delay*1000);
      return div;
    }
    else {
      restart();
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "Restarting...";
      return div;
    }
  }
});