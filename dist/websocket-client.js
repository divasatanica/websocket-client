function getEventListener(eventName) {
    var client = this;
    return function (res) {
        if (!client.eventQueueMap.has(eventName)) {
            return;
        }
        var queue = client.eventQueueMap.get(eventName);
        queue.forEach(function (fn) {
            fn(res);
        });
    };
}

var WebSocketClient = /** @class */ (function () {
    function WebSocketClient(config) {
        this.config = config;
        this.eventQueueMap = new Map();
        this.reconnectTimeout = config.reconnectTimeout;
        this.timerID = null;
        this.socket = null;
    }
    WebSocketClient.prototype._initEventListener = function (socket) {
        socket.onclose = getEventListener.call(this, "close");
        socket.onmessage = getEventListener.call(this, "message");
        socket.onerror = getEventListener.call(this, "error");
        socket.onopen = getEventListener.call(this, "open");
    };
    WebSocketClient.prototype._initReconnectHandler = function () {
        var _this = this;
        var config = this.config;
        var onReconnHandler = function () {
            _this.timerID = window.setTimeout(function () {
                _this.reconnect();
                _this.timerID = null;
            }, _this.reconnectTimeout);
        };
        if (typeof config.reconnectTimeoutCalculator === "function") {
            this.on("close", function () {
                onReconnHandler();
                _this.reconnectTimeout = config.reconnectTimeoutCalculator.call(_this, _this.reconnectTimeout);
            });
        }
        else {
            this.on("close", onReconnHandler);
        }
    };
    WebSocketClient.prototype.on = function (event, callback) {
        var queue = this.eventQueueMap.get(event) || [];
        queue.push(callback);
        if (!this.eventQueueMap.has(event)) {
            this.eventQueueMap.set(event, queue);
        }
    };
    WebSocketClient.prototype.off = function (event, callback) {
        var queue = this.eventQueueMap.get(event) || [];
        this.eventQueueMap.set(event, queue.filter(function (item) { return item !== callback; }));
    };
    WebSocketClient.prototype.open = function () {
        var config = this.config;
        var url = config.url, protocol = config.protocol, _a = config.autoReconnect, autoReconnect = _a === void 0 ? false : _a;
        if (protocol) {
            this.socket = new WebSocket(url, protocol);
        }
        else {
            this.socket = new WebSocket(url);
        }
        this._initEventListener(this.socket);
        if (autoReconnect === true) {
            this._initReconnectHandler();
        }
    };
    WebSocketClient.prototype.close = function () {
        this.socket.close();
    };
    WebSocketClient.prototype.reconnect = function () {
        if (this.timerID) {
            window.clearTimeout(this.timerID);
            this.timerID = null;
        }
        this.open();
    };
    WebSocketClient.prototype.send = function (data) {
        if (!this.socket) {
            throw new Error("Websocket not initialized");
        }
        this.socket.send(data);
    };
    return WebSocketClient;
}());

export default WebSocketClient;
