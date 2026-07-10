import os

from sqlalchemy import update
from sqlalchemy.orm import Session

from config import PUBLIC_DIR
from models import UserProfile


def change_xp(user_id: int, change_value: int, db: Session) -> bool:
    change = (
        update(UserProfile)
        .where(UserProfile.user_id == user_id)
        .values(level_xp=UserProfile.level_xp + change_value)
    )
    result = db.execute(change)
    db.commit()
    return result.rowcount > 0


def change_avatar(user_id: int, file_bytes: bytes, db: Session) -> tuple[str, bool]:
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    file_name = f"avatar_{user_id}.jpg"
    file_path = os.path.join(PUBLIC_DIR, file_name)
    avatar_url = f"http://localhost:5000/static/{file_name}"

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    change = (
        update(UserProfile)
        .where(UserProfile.user_id == user_id)
        .values(avatar_url=avatar_url)
    )
    result = db.execute(change)
    db.commit()

    if result.rowcount > 0:
        return avatar_url, True
    return "http://localhost:5000/static/avatar/default_avatar.jpg", False
