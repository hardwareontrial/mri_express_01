import { Server as IOServer, Socket, ServerOptions } from 'socket.io';
import type { PluginContext } from './../types/plugin.interface';

const WEBSOCKET_CORS = {
  origin: '*'
}

export class SocketioService {
  private static instance: SocketioService
  private io?: IOServer
  private initialized: boolean = false;

  constructor() {}

  public static getInstance(): SocketioService {
    if(!SocketioService.instance) {
      SocketioService.instance = new SocketioService();
    }
    return SocketioService.instance;
  }

  public init(httpServer: PluginContext['httpServer'], opts?: Partial<ServerOptions>): IOServer {
    if(this.initialized && this.io) {
      return this.io
    }

    const defaultOpts: Partial<ServerOptions> = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      ...opts,
    }

    this.io = new IOServer(httpServer, defaultOpts);
    this.initialized = true;

    this.io.on('connection', (socket: Socket) => {
      console.log(`[INFO][Socket-Io] terhubung: ${socket.id}`);
      
      socket.on('disconnect', (reason) => {
        console.log(`[INFO][Socket-Io] terputus: ${socket.id}: ${reason}`)
      });

      // example
      socket.on('ping', (d) => socket.emit('pong', d));

      socket.on("subscribe", (room: string) => {
        socket.join(room);
        this.emit("subscribed", { room });
      });

      socket.on("publish", (payload) => {
        this.emit("broadcast", payload);
      });

      // socket.on('timbangan-kompos:test', (data) => {
      //   this.emit('timbangan-kompos:scaleData', {
      //     status: 'ST',
      //     value: 1000,
      //     timestamp: ''
      //   })
      // })
    });

    return this.io;
  }

  public getIO(): IOServer {
    if(!this.io) throw new Error(`[ERR] Socket-Io belum diinisiasi `);
    return this.io;
  }

  public emit(event: string, ...args: any[]) {
    this.getIO().emit(event, ...args);
  }

  public to(room: string) {
    return this.getIO().to(room);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    this.getIO().on(event as any, listener);
  }

  public async close(): Promise<void> {
    if(!this.io) return;
    await this.io.close();
    this.io = undefined;
    this.initialized = false;
  }
}

export const socketIoService = SocketioService.getInstance();
export default socketIoService;