/* Any copyright is dedicated to the Public Domain.
* http://creativecommons.org/publicdomain/zero/1.0/ */

Components.utils.import("resource:///modules/devtools/gcli.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");

var addonCommandSpec = {
  name: 'addon',
  description: 'Manipulate Add-ons'
}

gcli.addCommand(addonCommandSpec);

var addonListCommandSpec = {
  name: 'addon list',
  description: 'List the available Add-ons',
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAllAddons(function (addons) {
      let reply = 'The following Add-ons were found:';
      reply += '<ol>';
      let names = addons.filter(function(e) { return e.type == 'extension'; })
                        .map(function(e) { return e.name; }).sort();
      for (let i of names) {
        reply += '<li><img<![CDATA[' + i + ']]></li>';
      }
      reply += '</ol>';
      promise.resolve(reply);
    });
    return promise;
  }
}

gcli.addCommand(addonListCommandSpec);

var addonEnableCommandSpec = {
  name: 'addon enable',
  description: 'Enable the specified Add-on',
  params: [
    {
      name: 'name',
      type: 'string',
      description: 'The name of the Add-on',
    }
  ],
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAllAddons(function (addons) {
      let reply = 'The following Add-ons were found:';
      reply += '<ol>';
      let names = addons.filter(function(e) { return e.type == 'extension'; })
                        .map(function(e) { return e.name; }).sort();
      for (let i of names) {
        reply += '<li><img<![CDATA[' + i + ']]></li>';
      }
      reply += '</ol>';
      promise.resolve(reply);
    });
    return promise;
  }
}

gcli.addCommand(addonEnableCommandSpec);
