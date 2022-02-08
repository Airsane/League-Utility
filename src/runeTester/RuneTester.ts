import PluginControllerDebug from "./PluginControllerDebug";

const pluginController = new PluginControllerDebug();
const plugin = pluginController.getActivePlugin();
(async ()=>{
  console.log(await plugin.getPages('Annie'));
})()
