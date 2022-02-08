import PluginControllerDebug from "./PluginControllerDebug";

const pluginController = new PluginControllerDebug();
pluginController.setActivePlugin('opgg');
const plugin = pluginController.getActivePlugin();
(async ()=>{
  console.log(await plugin.getPages('annie'));
})()
