import http from "http";
import express from "express";
import { MqttClient } from 'mqtt';
import { Server as IOServer } from 'socket.io';

export type PluginContext = {
  services: Record<string, any>
  httpServer: http.Server
  expressApp: express.Express
  mqttClient: MqttClient | undefined
  // socketIo: IOServer
}

export interface IPlugin {
  name: string
  init(ctx: PluginContext): Promise<void> | void
  close(ctx: PluginContext): Promise<void> | void
}