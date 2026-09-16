import asyncio
import uuid
from datetime import datetime
from typing import Iterable

from app.core.connection_manager import notification_manager


async def push_notification(
    recipient_id: str,
    title: str,
    message: str,
    notif_type: str = "info",
    link: str | None = None,
) -> None:
    payload = {
        "type": "notification",
        "id": str(uuid.uuid4()),
        "user_id": recipient_id,
        "title": title,
        "message": message,
        "notif_type": notif_type,
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
        "link": link,
    }
    await notification_manager.send_to_user(recipient_id, payload)


async def push_project_update(
    user_ids: Iterable[str],
    project: dict,
    title: str,
    message: str,
) -> None:
    payload = {
        "type": "project_update",
        "project": project,
        "title": title,
        "message": message,
        "created_at": datetime.utcnow().isoformat(),
    }
    for user_id in user_ids:
        if not user_id:
            continue
        await notification_manager.send_to_user(user_id, payload)
        await push_notification(
            user_id,
            title=title,
            message=message,
            notif_type="info",
            link=f"/projects/{project.get('id', '')}",
        )


def schedule_coroutine(coro) -> None:
    """Run an async notification coroutine from sync FastAPI route handlers."""
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(coro)
    except RuntimeError:
        asyncio.run(coro)
