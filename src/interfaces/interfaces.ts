interface IConfig {
    url: string;
    protocol?: string;
    autoReconnect: boolean;
    reconnectTimeout: number;
    reconnectTimeoutCalculator?: TimeoutCalculator;
}

interface TimeoutCalculator {
    (preTimeout: number): number;
}

interface WebsocketEventHandler{
    (res: any): void;
}

export {
    IConfig,
    TimeoutCalculator,
    WebsocketEventHandler
};