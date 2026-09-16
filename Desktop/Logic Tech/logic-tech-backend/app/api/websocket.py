from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.connection_manager import chat_manager, notification_manager
from app.core.database import SessionLocal
from app.core.notifications import push_notification
from app.models.models import Message, User

router = APIRouter(tags=["WebSocket"])


def _get_user(db, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def _serialize_message(msg: Message, sender: User | None) -> dict:
    return {
        "type": "message",
        "id": msg.id,
        "sender_id": msg.sender_id,
        "sender_name": sender.name if sender else "Unknown",
        "sender_avatar": sender.avatar_url if sender else None,
        "recipient_id": msg.recipient_id,
        "project_id": msg.project_id,
        "content": msg.content,
        "timestamp": msg.created_at.isoformat(),
        "read": msg.is_read,
    }


@router.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: str):
    await chat_manager.connect(user_id, websocket)

    await chat_manager.broadcast({
        "type": "presence",
        "user_id": user_id,
        "online": True,
    })

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type", "message")

            if event_type == "typing":
                recipient_id = data.get("recipient_id")
                if recipient_id:
                    await chat_manager.send_to_user(recipient_id, {
                        "type": "typing",
                        "user_id": user_id,
                        "is_typing": data.get("is_typing", False),
                    })
                continue

            if event_type != "message":
                continue

            recipient_id = data.get("recipient_id")
            content = (data.get("content") or "").strip()
            if not recipient_id or not content:
                continue

            db = SessionLocal()
            try:
                sender = _get_user(db, user_id)
                new_message = Message(
                    id=str(uuid.uuid4()),
                    sender_id=user_id,
                    recipient_id=recipient_id,
                    project_id=data.get("project_id"),
                    content=content,
                    is_read=False,
                )
                db.add(new_message)
                db.commit()
                db.refresh(new_message)

                payload = _serialize_message(new_message, sender)
                await chat_manager.send_to_user(user_id, payload)
                await chat_manager.send_to_user(recipient_id, payload)

                sender_name = sender.name if sender else "Someone"
                await push_notification(
                    recipient_id,
                    title="New Message",
                    message=f"{sender_name} sent you a message.",
                    notif_type="info",
                    link="/messages",
                )
            finally:
                db.close()

    except WebSocketDisconnect:
        chat_manager.disconnect(user_id, websocket)
        await chat_manager.broadcast({
            "type": "presence",
            "user_id": user_id,
            "online": False,
        })


@router.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    await notification_manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        notification_manager.disconnect(user_id, websocket)
