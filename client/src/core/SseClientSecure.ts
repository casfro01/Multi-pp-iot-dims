export type SseClientStatus = 'connecting' | 'connected' | 'disconnected';

type Subscription = {
    register: (connectionId: string) => Promise<{ group?: string; data?: unknown }>;
    onData: (data: unknown) => void;
    onError?: (error: unknown) => void;
    listenerKey: symbol | null;
};

type Listener = {
    group: string;
    handler: (data: unknown) => void;
};

type HttpClient = { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };

function createAuthenticatedHttp(bearerToken: string): HttpClient {
    return {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
            return window.fetch(url, {
                ...init,
                headers: {
                    ...init?.headers,
                    Authorization: `Bearer ${bearerToken}`,
                },
            });
        },
    };
}

export class StateleSSEClient {
    private _reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    private _connectionId: string | null = null;
    private _status: SseClientStatus = 'disconnected';
    private _generation = 0;
    private readonly _url: string;
    private readonly _connectEvent: string;
    private readonly _http: HttpClient;
    private readonly _subscriptions = new Map<symbol, Subscription>();
    private readonly _listeners = new Map<symbol, Listener>();
    private readonly _groupHandlers = new Map<string, (data: unknown) => void>();

    onStatusChange?: (status: SseClientStatus) => void;

    get connectionId(): string | null { return this._connectionId; }
    get status(): SseClientStatus { return this._status; }

    constructor(
        url: string,
        connectEvent = 'connected',
        httpOrToken?: string | null // kun token nu
    ) {
        this._url = url;
        this._connectEvent = connectEvent;
        if (typeof httpOrToken === 'string') {
            this._http = createAuthenticatedHttp(httpOrToken);
        } else {
            this._http = httpOrToken ?? (window as never);
        }
        this.connect();
    }

    listen<T>(
        register: (connectionId: string) => Promise<{ group?: string | null; data?: T | null }>,
        onData: (data: T & {}) => void,
        onError?: (error: unknown) => void
    ): () => void {
        const key = Symbol();
        const sub: Subscription = {
            register: register as Subscription['register'],
            onData: onData as (data: unknown) => void,
            onError,
            listenerKey: null,
        };
        this._subscriptions.set(key, sub);

        if (this._connectionId)
            this.executeSubscription(key, this._generation);

        return () => {
            if (sub.listenerKey) this.removeListener(sub.listenerKey);
            this._subscriptions.delete(key);
        };
    }

    disconnect() {
        this._generation++;
        this._reader?.cancel();
        this._reader = null;
        this._connectionId = null;
        this.clearGroupHandlers();
        this._subscriptions.clear();
        this.setStatus('disconnected');
    }

    private connect() {
        this.setStatus('connecting');

        this._http.fetch(this._url).then(response => {
            if (!response.ok || !response.body) {
                this.setStatus('disconnected');
                return;
            }
            this._reader = response.body.getReader();
            this.readStream(this._reader);
        }).catch(() => {
            this.setStatus('disconnected');
        });
    }

    private async readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) { this.setStatus('disconnected'); return; }

                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split('\n\n');
                buffer = events.pop() ?? '';

                for (const raw of events) {
                    const parsed = this.parseSseEvent(raw);
                    if (parsed) this.dispatchSseEvent(parsed.event, parsed.data);
                }
            }
        } catch {
            this.setStatus('disconnected');
        }
    }

    private parseSseEvent(raw: string): { event: string; data: string } | null {
        let event = 'message';
        let data = '';
        for (const line of raw.split('\n')) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data:')) data = line.slice(5).trim();
        }
        return data ? { event, data } : null;
    }

    private dispatchSseEvent(event: string, rawData: string) {
        if (event === this._connectEvent) {
            const parsed = JSON.parse(rawData);
            this.handleConnected(parsed?.connectionId);
            return;
        }
        const handler = this._groupHandlers.get(event);
        if (handler) {
            try { handler(JSON.parse(rawData)); } catch { /* ignore malformed */ }
        }
    }

    private handleConnected(connectionId: string) {
        this._generation++;
        const gen = this._generation;
        this._connectionId = connectionId;

        this.clearGroupHandlers();
        for (const sub of this._subscriptions.values())
            sub.listenerKey = null;

        this.setStatus('connected');

        for (const key of this._subscriptions.keys())
            this.executeSubscription(key, gen);
    }

    private async executeSubscription(key: symbol, gen: number) {
        const sub = this._subscriptions.get(key);
        if (!sub || !this._connectionId || gen !== this._generation) return;

        try {
            const { group, data } = await sub.register(this._connectionId);
            if (gen !== this._generation || !this._subscriptions.has(key)) return;
            if (data != null) sub.onData(data);
            if (group) sub.listenerKey = this.addListener(group, sub.onData);
        } catch (e) {
            if (gen !== this._generation || !this._subscriptions.has(key)) return;
            sub.onError?.(e);
        }
    }

    private addListener(group: string, handler: (data: unknown) => void): symbol {
        const key = Symbol();
        this._listeners.set(key, { group, handler });
        this.ensureGroupHandler(group);
        return key;
    }

    private removeListener(key: symbol) {
        const listener = this._listeners.get(key);
        if (!listener) return;
        this._listeners.delete(key);
        this.maybeRemoveGroupHandler(listener.group);
    }

    private ensureGroupHandler(group: string) {
        if (this._groupHandlers.has(group)) return;
        this._groupHandlers.set(group, (data) => {
            for (const listener of this._listeners.values()) {
                if (listener.group === group)
                    listener.handler(data);
            }
        });
    }

    private maybeRemoveGroupHandler(group: string) {
        for (const listener of this._listeners.values())
            if (listener.group === group) return;
        this._groupHandlers.delete(group);
    }

    private clearGroupHandlers() {
        this._listeners.clear();
        this._groupHandlers.clear();
    }

    private setStatus(status: SseClientStatus) {
        if (this._status === status) return;
        this._status = status;
        this.onStatusChange?.(status);
    }
}