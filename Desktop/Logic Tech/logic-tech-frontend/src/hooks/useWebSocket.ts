import { useCallback, useEffect, useRef, useState } from 'react';
import { buildWebSocketUrl } from '../lib/ws';

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  reconnect?: boolean;
  reconnectIntervalMs?: number;
}

export function useWebSocket(path: string | null, options: UseWebSocketOptions = {}) {
  const { onMessage, reconnect = true, reconnectIntervalMs = 3000 } = options;
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number | undefined>(undefined);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!path) {
      setReadyState(WebSocket.CLOSED);
      return;
    }

    let mounted = true;

    const connect = () => {
      const ws = new WebSocket(buildWebSocketUrl(path));
      wsRef.current = ws;
      setReadyState(WebSocket.CONNECTING);

      ws.onopen = () => {
        if (mounted) setReadyState(WebSocket.OPEN);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (mounted) setLastMessage(data);
          onMessageRef.current?.(data);
        } catch {
          // ignore malformed payloads
        }
      };

      ws.onclose = () => {
        if (!mounted) return;
        setReadyState(WebSocket.CLOSED);
        if (reconnect) {
          reconnectRef.current = window.setTimeout(connect, reconnectIntervalMs);
        }
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      mounted = false;
      window.clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [path, reconnect, reconnectIntervalMs]);

  return { sendMessage, lastMessage, readyState, isConnected: readyState === WebSocket.OPEN };
}
