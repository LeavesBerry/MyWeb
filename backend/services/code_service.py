import time

from sqlalchemy.orm import Session

from exceptions import APIError
from models import Code


async def check_code_rate(user_email: str, db: Session):
    now = time.time()
    last = db.query(Code).filter(Code.user_email == user_email).first()
    if last and now - last.create_time < 60:
        raise APIError("验证码发送过于频繁")


def clean_expired_codes(db: Session):
    now = time.time()
    db.query(Code).filter(now - Code.create_time > 300).delete()
    db.commit()
