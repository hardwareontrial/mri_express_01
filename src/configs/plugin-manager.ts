import type { PluginContext, IPlugin } from '../types/plugin.interface'

export class PluginManager {
  private plugins: IPlugin[] = [];
  private ctx: PluginContext;

  constructor(ctx: PluginContext) {
    this.ctx = ctx
  }

  register(plugin: IPlugin) {
    this.plugins.push(plugin)
  }

  async init() {
    for (const p of this.plugins) {
      await p.init(this.ctx)
      console.log(`[INFO] Plugin: ${p.name} terpasang`)
    }
  }

  async close() {
    for(const p of this.plugins.reverse()) {
      if(p.close) await p.close(this.ctx)
      console.log(`[INFO] Plugin: ${p.name} dilepas`)
    }
  }
}
