import dotenv from "dotenv";
dotenv.config();

import http from 'http';
import path from 'path';
import { App } from './app'
import { MongoDB } from './configs/mongo'
import { mysqlService } from './configs/mysql'
import { mariadbService } from './configs/mariadb'
import { PluginManager } from './configs/plugin-manager'
import { PluginLoader } from './configs/plugin-loader'
import { PluginContext } from './types/plugin.interface'
import { mqttService } from './services/mqtt-service'
import { socketIoService } from "./services/socketio-service"
import { emailService } from './services/email-service'

const PORT = process.env.PORT || 3001

async function start() {
  const mongoDB = new MongoDB();

  await mongoDB.connect();
  await mysqlService.createPool();
  await mariadbService.createPool();

  const app = new App();
  const server = http.createServer(app.expressApp);
  const mqtt = await mqttService.init();

  socketIoService.init(server)

  const ctx: PluginContext = {
    services: {},
    httpServer: server,
    expressApp: app.expressApp,
    mqttClient: mqtt,
  }

  const pm = new PluginManager(ctx);
  const pmLoader = new PluginLoader(pm, path.join(path.resolve(), 'plugins'));
  await pmLoader.start(ctx);

  emailService.registerConfig('admin', {
    host: 'mail.demo.com',
    port: 587,
    secure: false,
    user: 'admin@demo.com',
    password: 'admin123'
  })

  server.listen(PORT, () => {
    console.log(`[INFO] Server listening on port: ${PORT}`);
  });

  process.on('SIGINT', async () => {
    console.log('[INFO] Menutup Server');
    await mysqlService.close();
    await mariadbService.close();
    await mqttService.close();
    await socketIoService.close();
    server.close();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error('Failed to start Server: ', err);
  process.exit(1);
});