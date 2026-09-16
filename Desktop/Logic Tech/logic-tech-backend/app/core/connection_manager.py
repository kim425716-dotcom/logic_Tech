from fastapi import WebSocket
from typing import Dict, List, Set


class ConnectionManager:
    """Tracks active WebSocket connections per user."""

    def __init__(self) -> None:
        self._connections: Dict[str, List[WebSocket]] = {}
        self._online_users: Set[str] = set()

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        if user_id not in self._connections:
            self._connections[user_id] = []
        self._connections[user_id].append(websocket)
        self._online_users.add(user_id)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        if user_id in self._connections:
            self._connections[user_id] = [
                ws for ws in self._connections[user_id] if ws is not websocket
            ]
            if not self._connections[user_id]:
                del self._connections[user_id]
                self._online_users.discard(user_id)

    def is_online(self, user_id: str) -> bool:
        return user_id in self._online_users

    async def send_to_user(self, user_id: str, message: dict) -> None:
        if user_id not in self._connections:
            return
        dead: List[WebSocket] = []
        for ws in self._connections[user_id]:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(user_id, ws)

    async def broadcast(self, message: dict) -> None:
        for user_id in list(self._connections.keys()):
            await self.send_to_user(user_id, message)


chat_manager = ConnectionManager()
notification_manager = ConnectionManager()
