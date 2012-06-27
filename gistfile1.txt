/* Any copyright is dedicated to the Public Domain.
* http://creativecommons.org/publicdomain/zero/1.0/ */

Components.utils.import("resource:///modules/devtools/gcli.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");

var addonCommandSpec = {
  name: 'plugin',
  description: 'Manipulate plugins'
}

gcli.addCommand(addonCommandSpec);

var addonListCommandSpec = {
  name: 'plugin list',
  description: 'List the available plugins',
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAddonsByTypes(["plugin"], function (addons) {
      let enabledMap = {};
      let disabledMap = {};
      addons.forEach(function(e) {
        if (e.userDisabled) {
          disabledMap[e.name] = e;
        } else {
          enabledMap[e.name] = e;
        }
      });
      let reply = 'The following plug-ins are installed:';
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

var addonEnableCommandSpec = {
  name: 'plugin enable',
  description: 'Enable the specified plugin',
  params: [
    {
      name: 'name',
      type: 'string',
      description: 'The name of the plugin',
    }
  ],
  exec: function(args, context) {
    let promise = context.createPromise();
    AddonManager.getAddonsByTypes(["plugin"], function (addons) {
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
  name: 'plugin disable',
  description: 'Disable the specified plugin',
  params: [
    {
      name: 'name',
      type: 'string',
      description: 'The name of the plugin',
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
