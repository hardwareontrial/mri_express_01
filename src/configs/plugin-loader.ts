import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import { PluginManager } from './plugin-manager'
import type { PluginContext, IPlugin } from '../types/plugin.interface'

export class PluginLoader {
  private watcher: FSWatcher;
  private pm: PluginManager;
  private pluginsPath: string;
  private loadedPlugins: Map<string, IPlugin> = new Map();

  constructor(pm: PluginManager, pluginsPath: string = path.join(path.resolve(), 'plugins')) {
    this.pm = pm;
    this.pluginsPath = pluginsPath;
    this.watcher = chokidar.watch(this.pluginsPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
  }

  async start(ctx: PluginContext) {
    this.watcher
      .on('add', (file) => this.loadPlugin(file, ctx))
      .on('unlink', (file) => this.unloadPlugin(file, ctx))
      .on('change', (file) => this.reloadPlugin(file, ctx))
    console.log(`[INFO] Memantau perubahan direktori plugins: ${this.pluginsPath}`);
  }

  private async loadPlugin(file: string, ctx: PluginContext) {
    if(!file.endsWith('.plugin.js') && !file.endsWith('plugin.ts')) return;
    const name = path.basename(file);
    
    try {
      delete require.cache[require.resolve(file)];
      const mod = require(file);
      const PluginClass = mod.default || (mod[Object.keys(mod)[0]]);
      const plugin: IPlugin = new PluginClass();
      await plugin.init(ctx);

      this.pm.register(plugin);
      this.loadedPlugins.set(name, plugin);

      console.log(`[INFO] Plugin terpasang ${plugin.name}`);
    } catch (e) {
      console.error(`[ERROR] Gagal memuat plugin ${name}: ${e}`)
    }
  }

  private async reloadPlugin(file: string, ctx: PluginContext) {
    const name = path.basename(file);
    console.log(`[INFO] Reload plugin: ${name}`);
    await this.unloadPlugin(file, ctx);
    await this.loadPlugin(file, ctx);
  }

  private async unloadPlugin(file: string, ctx: PluginContext) {
    const name = path.basename(file);
    const plugin = this.loadedPlugins.get(name);
    if(!plugin) return;

    try {
      if(plugin.close) await plugin.close(ctx)
      this.loadedPlugins.delete(name);
      console.log(`[INFO] Plugin ${name} dilepas`);
    } catch (e) {
      console.error(`[ERROR] Gagal melepas plugin ${name}: ${e}`)
    }
  }
}