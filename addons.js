/**
 * Any copyright by Panagiotis Astithas is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
 *
 * Otherwise, copyright 2012 Pimm Hogeling
 * You can redistribute and/or modify this software under the terms of the Mozilla Public License Version 1.1, the
 * GNU Lesser General Public License version 2.1 or later or the GNU General Public License version 2 or later.
 */

Components.utils.import("resource:///modules/devtools/gcli.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AddonRepository", "resource://gre/modules/AddonRepository.jsm");

var addonCommandSpec = {
  name: 'addon',
  description: {
    "root": "Manipulate Add-ons",
    "nl-nl": "Beheer add-ons"
  }
}

gcli.addCommand(addonCommandSpec);

var addonListCommandSpec = {
  name: 'addon list',
  description: {
    "root": "List the installed Add-ons",
    "nl-nl": "Toon een lijst van geinstalleerde add-ons"
  },
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAddonsByTypes(["extension"], function (addons) {
      let enabledMap = {};
      let disabledMap = {};
      addons.forEach(function(e) {
        if (e.userDisabled) {
          disabledMap[e.name] = e;
        } else {
          enabledMap[e.name] = e;
        }
      });
      let reply = 'The following Add-ons are installed:';
      reply += '<ol>';
      let names = Object.keys(enabledMap).sort(String.localeCompare);
      for (let i of names) {
        reply += '<li><![CDATA[' + i + ']]></li>';
      }
      let names = Object.keys(disabledMap).sort(String.localeCompare);
      for (let i of names) {
        reply += '<li style="color: #888; text-decoration: line-through;"><![CDATA[' + i + ']]></li>';
      }
      reply += '</ol>';
      promise.resolve(reply);
    });
    return promise;
  }
}

gcli.addCommand(addonListCommandSpec);

var nameParameter = {
  name: 'name',
  type: 'string',
  description: {
    "root": "The name of the Add-on",
    "nl-nl": "De naam van de add-on"
  }
}

var addonEnableCommandSpec = {
  name: 'addon enable',
  description: {
    "root": "Enable the specified Add-on",
    "nl-nl": "Schakel de gespecificeerde add-on in"
  },
  params: [nameParameter],
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAddonsByTypes(["extension"], function (addons) {
      let addon, result;
      for (let i of addons) {
        if (i.name == args.name) {
          addon = i;
          break;
        }
      }
      if (addon) {
        addon.userDisabled = false;
        result = addon.name + ' was enabled';
      } else {
        result = addon.name + ' was not found';
      }
      promise.resolve(result);
    });
    return promise;
  }
}

gcli.addCommand(addonEnableCommandSpec);

var addonDisableCommandSpec = {
  name: 'addon disable',
  description: {
    "root": "Disable the specified Add-on",
    "nl-nl": "Schakel de gespecificeerde add-on uit"
  },
  params: [nameParameter],
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAddonsByTypes(["extension"], function (addons) {
      let addon, result;
      for (let i of addons) {
        if (i.name == args.name) {
          addon = i;
          break;
        }
      }
      if (addon) {
        addon.userDisabled = true;
        result = addon.name + ' was disabled';
      } else {
        result = addon.name + ' was not found';
      }
      promise.resolve(result);
    });
    return promise;
  }
}

gcli.addCommand(addonDisableCommandSpec);

var addonInstallCommandSpec = (function() {
  /**
   * Returns all of the latin characters in the passed string in one long string, converted to lower case.
   */
  function convertToSimplifiedLowerCase(input) {
    const latinCharacterFinder = /[a-zA-Z]/g;
    var match;
    const result = [];
    while (null != (match = latinCharacterFinder.exec(input))) {
      result.push(match[0]);
    }
    return result.join("").toLowerCase();
  };
  // Define the callback that will be used when the add-on repository is done searching.
  const AddonSearchCallback = function(promise, inputtedName) {
    this.promise = promise;
    this.inputtedName = inputtedName;
  }
  AddonSearchCallback.prototype.searchSucceeded = function(addons, addonCount) {
    // If no add-ons were found, display a message to the user.
    if (0 == addonCount) {
      // nl-nl: Kan niet installeren. De add-on is niet gevonden.
      this.promise.resolve("Unable to install. Could not find the add-on.");
      return;
    }
    // Find the add-on the user was looking for from the search results. Ignore the case of the add-on names and user input,
    // as well as any non-Latin characters. Ignoring the case and non-Latin characters makes trivial "mistakes" by the user 
    // insignificant. This is probably not the most user-friendly way if said user is actually inputting non-Latin add-on
    // names. Ideally, such input would be taken seriously.
    this.inputtedName = convertToSimplifiedLowerCase(this.inputtedName);
    for each (addon in addons) {
      let addonName = convertToSimplifiedLowerCase(addon.name);
      if (addonName.substr(0, this.inputtedName.length) == this.inputtedName) {
        // Inform the user the add-on was found.
        // nl-nl: Bezig met downloaden van {$1}...
        // promise.setProgress("<![CDATA[Downloading " + addon.name + " " + addon.version + "&hellip;]]>");
        addon.install.addListener(new AddonInstallListener(this.promise));
        addon.install.install();
        return;
      }
    }
    // If not one of the add-ons returned by the repository seems to be what the user was looking for, show a suggestion.
    // nl-nl: Kan niet installeren. De add-on is niet gevonden.
    this.promise.resolve("Unable to install. Could not find the add-on. Perhaps you meant <code><![CDATA[addon install \"" + addons[0].name + "\"]]></code>.");
  }
  AddonSearchCallback.prototype.searchFailed = function() {
    // nl-nl: Kan niet installeren. Zoekopdracht mislukt. Misschien kon er geen verbinding worden gemaakt met het add-on magazijn.
    this.promise.resolve("Unable to install. Search failed. Perhaps no connection to the add-on repository could be made.");
  }
  // Define the listener that will be used when an add-on is being installed.
  const AddonInstallListener = function(promise) {
    this.promise = promise;
  };
  const nop = function() {
  };
  AddonInstallListener.prototype = {
    /**
     * Called when a new instance of AddonInstall is created, primarily so UI can display some kind of progress for all
     * installs.
     */
    onNewInstall: nop,
    /**
     * Called when downloading begins for an add-on install. Only called for add-ons that need to be downloaded. A listener may
     * return false to cancel the download.
     */
    onDownloadStarted: nop,
    /**
     * Called as data is received during a download. Check the AddonInstall.progress property for the amount of data downloaded
     * and the AddonInstall.maxProgress property for the total data expected. A listener may return false to cancel the
     * download.
     */
    onDownloadProgress: function(install) {
      // Show the how much of the add-on has been downloaded. TODO Perhaps make this a percentage.
      // nl-nl: Download op {$1}.
      // this.promise.setProgress("Download at " + (install.progress / install.maxProgress) + ".");
    },
    /**
     * Called when downloading completes successfully for an add-on install. Only called for add-ons that need to be
     * downloaded.
     */
    onDownloadEnded: function() {
      // nl-nl: Klaar met downloaden.
      //this.promise.setProgress("Download completed.");
    },
    /**
     * Called when downloading is cancelled. Only called for add-ons that need to be downloaded.
     */
    onDownloadCancelled: function() {
      // nl-nl: Download geannuleerd.
      //this.promise.setProgress("Download cancelled.");
    },
    /**
     * Called if there is some error downloading the add-on. Only called for add-ons that need to be downloaded.
     */
    onDownloadFailed: function() {
      // nl-nl: Download mislukt.
      //this.promise.setProgress("Download failed.");
    },
    /**
     * Called when installation of an add-on begins. A listener may return false to cancel the install.
     */
    onInstallStarted: function() {
      // nl-nl: Bezig met installeren van {$1}...
      // promise.setProgress("<![CDATA[Installing " + addon.name + " " + addon.version + "&hellip;]]>");
    },
    /**
     * Called when installation of an add-on is complete. The newly installed add-on may require a restart in order to become
     * active.
     */
    onInstallEnded: function(install, addon) {
      // The add-on was successfully installed. Love!
      // nl-nl {$1} is succesvol geinstalleerd.
      this.promise.resolve(addon.name + " " + addon.version + " has been successfully installed.");
      // TODO Determine whether the add-on needs a restart. Inform the user of this fact if so.
    },
    /**
     * Called when installation is cancelled.
     */
    onInstallCancelled: function() {
      // nl-nl: Installatie geannuleerd.
      //this.promise.setProgress("Installation cancelled.");
    },
    /**
     * Called when there is a failure installing the add-on.
     */
    onInstallFailed: function() {
      // nl-nl: Installatie mislukt.
      //this.promise.setProgress("Installation failed.");
    },
    /**
     * Called when an add-on is installed through some system other than an AddonInstall.
     */
    onExternalInstall: nop
  };
  const forceParameter = {
    name: "force",
    type: "boolean",
    description: {
      "root": "Whether an add-on search currently in progress, if existent, should be cancelled.",
      "nl-nl": "Of een zoekopdracht naar add-ons die op dit moment bezig is geannuleerd moet worden, mits deze bestaat."
    },
    defaultValue: false
  }
  return {
    name: "addon install",
    description: {
      "root": "Find and install the specified Add-on",
      "nl-nl": "Zoek en installeer de gespecificeerde add-on"
    },
    params: [nameParameter, forceParameter],
    exec: function(cliArguments, context) {
      // Check whether an add-on search is currently in progress.
      if (AddonRepository.isSearching) {
        // Cancel the currently-in-progress search, or explain how this can be done, depending on the "force" parameter.
        if (cliArguments[forceParameter.name]) {
          AddonRepository.cancelSearch();
        } else {
          // nl-nl: Kan niet installeren. Een zoekopdracht naar add-ons is op dit moment bezig. Als je vindt dat dit te lang duurt, gebruik dan "addon install {$1} true" om deze te annuleren.
          return "Unable to install. Another search for add-ons is already in progress. If you feel this search is taking too long, use <code><![CDATA[addon install " + cliArguments[nameParameter.name] + " true]]></code> to cancel it.";
        }
      }
      // Create the promise that will be resolved when the search for add-ons has ended.
      const promise = context.createPromise();
      // Inform the user a search has been initiated.
      // nl-nl: Aan het zoeken naar {$1}...
      // promise.setProgress("<![CDATA[Searching for " + cliArguments[nameParameter.name] + "&hellip;]]>");
      // Search for the add-on.
      AddonRepository.searchAddons(cliArguments[nameParameter.name], 4, new AddonSearchCallback(promise, cliArguments[nameParameter.name]));
      return promise;
    }
  }
})();

gcli.addCommand(addonInstallCommandSpec);