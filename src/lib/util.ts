import { WebsocketEventHandler } from '../interfaces/interfaces';

export function getEventListener(eventName: string): WebsocketEventHandler {
    const client = this;
    return (res: any) => {
        if (!client.eventQueueMap.has(eventName)) {
            return;
        }
        let queue = client.eventQueueMap.get(eventName);
        queue.forEach((fn: Function) => {
            fn(res);
        });
    };
}