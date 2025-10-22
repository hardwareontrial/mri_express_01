import dotenv from "dotenv";
dotenv.config();
import mqtt, { MqttClient } from "mqtt";
import { socketIoService } from './socketio-service';

const PORT: string = process.env.MQTT_BROKER_PORT || '1883';
const broker = `mqtt://${process.env.MQTT_BROKER}:${parseInt(PORT)}` || "mqtt://127.0.0.1:1883"

export class MqttService {
  private static instance: MqttService;
  private client!: MqttClient

  private constructor() {}

  static getInstance(): MqttService {
    if(!MqttService.instance) {
      MqttService.instance = new MqttService();
    }
    return MqttService.instance;
  }

  async init() {
    try {
      if(!this.client) this.client = mqtt.connect(broker, {
        clientId: 'mri-server-001',
        clean: true,
      });

      this.client.on('connect', () => {
        console.log(`[INFO] Mqtt terhubung ke broker: ${broker}`);

        this.client.subscribe('timbangan-kompos/data-timbang-mesin', { qos: 1 }, (err) => {
          if(err) console.log('Error on subscribe: timbangan-kompos/data-timbang-mesin')
        });

        this.client.subscribe('timbangan-kompos/client-status', { qos: 1 }, (err) => {
          if(err) console.log('Error on subscribe: timbangan-kompos/client-status')
        });

      });

      this.client.on('close', () => {
        console.log(`[INFO] Koneksi Mqtt ke broker ${broker} ditutup`);
      });


      this.client.on('message', (topic, message) => {
        if(topic === 'timbangan-kompos/data-timbang-mesin') {
          const data = message.toString();
          socketIoService.emit('timbangan-kompos:data-timbang-mesin', data);
        }
        
        else if(topic === 'timbangan-kompos/client-status') {
          const data = message.toString();
          if(data) socketIoService.emit('timbangan-kompos:client-status', data);
        }
      })

      return this.client;
    } catch (e) {
      console.error(`[ERROR] Mqtt init error: ${e}`);
    }
  }

  async close() {
    if(this.client?.connected) { this.client.end(true); }
  }
}

export const mqttService = MqttService.getInstance();