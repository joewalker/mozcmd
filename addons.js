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
    AddonManager.getAddonsByTypes(["extension"], function (addons) {
      let map = {};
      addons.forEach(function(e) { map[e.name] = e; });
      let reply = 'The following Add-ons were found:';
      reply += '<ol>';
      let names = Object.keys(map).sort();
      for (let i of names) {
        let a = map[i];
        if (a.userDisabled) {
          reply += '<li style="text-decoration: line-through;"><![CDATA[' + i + ']]></li>';
        } else {
          reply += '<li><![CDATA[' + i + ']]></li>';
        }
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
        result = args.name + ' was enabled';
      } else {
        result = args.name + ' was not found';
      }
      promise.resolve(result);
    });
    return promise;
  }
}

gcli.addCommand(addonEnableCommandSpec);

var addonDisableCommandSpec = {
  name: 'addon disable',
  description: 'Disable the specified Add-on',
  params: [
    {
      name: 'name',
      type: 'string',
      description: 'The name of the Add-on',
    }
  ],
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
        result = args.name + ' was disabled';
      } else {
        result = args.name + ' was not found';
      }
      promise.resolve(result);
    });
    return promise;
  }
}

gcli.addCommand(addonDisableCommandSpec);
