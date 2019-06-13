
import { getEventListener } from './util';
import { IConfig } from '../interfaces/interfaces';


class WebSocketClient {

    config: IConfig;
    eventQueueMap: Map<string, Function[]>;
    timerID: number;
    socket: null | WebSocket;
    reconnectTimeout: number;

    constructor(config: IConfig) {
        if (!config) {
            throw new Error("Config Missed");
        }
        this.config = config;
        this.eventQueueMap = new Map();
        this.reconnectTimeout = config.reconnectTimeout;
        this.timerID = null;
        this.socket = null;
    }

    _initEventListener(socket: WebSocket): void {
        socket.onclose = getEventListener.call(this, "close");
        socket.onmessage = getEventListener.call(this, "message");
        socket.onerror = getEventListener.call(this, "error");
        socket.onopen = getEventListener.call(this, "open");
    }

    _initReconnectHandler(): void {
        const config = this.config;

        let onReconnHandler = () => {
            this.timerID = window.setTimeout(() => {
                this.reconnect();
                this.timerID = null;
            }, this.reconnectTimeout);
        };

        if (typeof config.reconnectTimeoutCalculator === "function") {
            this.on("close", () => {
                onReconnHandler();
                this.reconnectTimeout = config.reconnectTimeoutCalculator.call(this, this.reconnectTimeout);
            });
        } else {
            this.on("close", onReconnHandler);
        }
    }

    on(event: string, callback: Function): void {
        let queue = this.eventQueueMap.get(event) || [];

        queue.push(callback);

        if (!this.eventQueueMap.has(event)) {
            this.eventQueueMap.set(event, queue);
        }
    }

    off(event: string, callback: Function): void {
        let queue = this.eventQueueMap.get(event) || [];

        this.eventQueueMap.set(event, queue.filter((item: Function) => item !== callback));
    }

    open(): void {
        const config = this.config;
        const {
            url,
            protocol,
            autoReconnect = false
        } = config;

        if (protocol) {
            this.socket = new WebSocket(url, protocol);
        } else {
            this.socket = new WebSocket(url);
        }

        this._initEventListener(this.socket);
        if (autoReconnect === true) {
            this._initReconnectHandler();
        }
    }

    close(): void {
        this.socket.close();
    }

    reconnect (): void {
        if (this.timerID) {
            window.clearTimeout(this.timerID);
            this.timerID = null;
        }
        this.open();
    }

    send(data: any): void {
        if (!this.socket) {
            throw new Error("Websocket not initialized");
        }
        this.socket.send(data);
    }
}

export default WebSocketClient;