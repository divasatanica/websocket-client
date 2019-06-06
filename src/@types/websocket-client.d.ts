import { IConfig, TimeoutCalculator } from '../interfaces/interfaces';

declare class WebSocketClient {
    config: IConfig;
    socket: WebSocket;
    eventQueueMap: Map<string, Array<Function>>;
    reconnectTimeout: number;
    timerID: number;

    constructor(config: IConfig);

    _initEventListener(socket: WebSocket): void;
}