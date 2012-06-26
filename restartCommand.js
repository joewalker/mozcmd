/**
 * Restart command
 *
 * @param number delay
 *        delay in seconds for the restart
 * @param boolean disableFastload
 *        disabled loading from cache upon restart.
 *
 * Examples :
 * >> restart
 *    - restarts browser immediately
 * >> restart 20
 *    - restarts after 20 seconds
 * >> restart --abort
 *    - stops any scheduled restart (via the above example)
 * >> restart 0 true
 *    - restarts immediately and starts Firefox without using cache
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
    },
    {
      name: "abort",
      type: "boolean",
      defaultValue: false,
      description: "Abort the current scheduled restart."
    },
  ],
  returnType: "html",
  exec: function Restart(args, context) {
    let {classes: Cc, interfaces: Ci} = Components;
    let HTML = "http://www.w3.org/1999/xhtml";
    let browserDoc = context.environment.chromeDocument;
    let chromeWin = context.environment.chromeDocument.defaultView;
    let canceled = Cc["@mozilla.org/supports-PRBool;1"]
      .createInstance(Ci.nsISupportsPRBool);
    Services.obs.notifyObservers(canceled, "quit-application-requested", "restart");
    if (canceled.data) {
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "Restart request cancelled by user.";
      return div;
    }

    if (args.abort) {
      if (chromeWin.restartTimer) {
        chromeWin.clearTimeout(chromeWin.restartTimer);
        chromeWin.restartTimer = null;
        delete chromeWin.restartTimer;
        try {
          chromeWin.clearTimeout(chromeWin.countdownTimer);
          chromeWin.countdownTimer = null;
          delete chromeWin.countdownTimer;
        } catch(ex) {}
        let div = browserDoc.createElementNS(HTML, "div");
        div.innerHTML = "Restart request cancelled by user.";
        return div;
      }
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "No scheduled restart to abort.";
      return div;
    }

    // disable fastload cache
    if (args.disableFastload) {
      Services.appinfo.invalidateCachesOnRestart();
    }

    function restart() {
      chromeWin.restartTimer = null;
      delete chromeWin.restartTimer;
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
          chromeWin.countdownTimer = chromeWin.setTimeout(countdownTimer, 1000);
        }
        else {
          chromeWin.countdownTimer = null;
          delete chromeWin.countdownTimer;
        }
      }
      let div = browserDoc.createElementNS(HTML, "div");
      div.innerHTML = "Restarting in " + delay + " seconds.";
      chromeWin.countdownTimer = chromeWin.setTimeout(countdownTimer, 1000);
      chromeWin.restartTimer = chromeWin.setTimeout(restart, delay*1000);
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