from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import SECRET_KEY, ALGORITHM
from database import get_db
from models import UserBase

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/refreshToken")


def get_current_user(target: str):
    if target not in ["user", "user_id"]:
        raise ValueError("参数错误")

    async def get_id_only(token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录已失效",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
            if not user_id:
                raise credentials_exception
            return user_id
        except (JWTError, TypeError, ValueError):
            raise credentials_exception

    async def get_all_info(
        user_id: int = Depends(get_id_only),
        db: Session = Depends(get_db),
    ):
        user = db.query(UserBase).filter(UserBase.user_id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户不存在",
            )
        return user

    if target == "user_id":
        return get_id_only
    return get_all_info
