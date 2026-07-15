from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from auth import get_current_user
from config import MAX_UPLOADIMG_SIZE
from database import get_db
from exceptions import APIError
from models import UserBase, UserProfile
from schemas import BioRequest
from services.user_service import change_avatar

router = APIRouter()


@router.post("/api/getUserInfo")
def get_user_info(
    user: UserBase = Depends(get_current_user("user")),
    db: Session = Depends(get_db),
):
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.user_id).first()
    return JSONResponse(
        {
            "is_logined": "true",
            "user_id": user.user_id,
            "user_name": user.user_name,
            "user_email": user.user_email,
            "avatar_url": user_profile.avatar_url,
            "bio": user_profile.bio,
            "level": user_profile.level_xp // 1000,
            "xp": user_profile.level_xp % 1000,
        }
    )


@router.post("/api/changeBio")
def change_bio(
    data: BioRequest,
    user_id: int = Depends(get_current_user("user_id")),
    db: Session = Depends(get_db),
):
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user_profile:
        raise APIError("用户资料不存在")

    user_profile.bio = data.bio
    db.commit()
    return JSONResponse({"msg": "成功修改个人简介"})


@router.post("/api/changeAvatar")
async def change_user_avatar(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user("user_id")),
    db: Session = Depends(get_db),
):
    suffix = file.filename.split(".")[-1].lower()
    if suffix not in ["jpg", "jpeg", "png"]:
        raise APIError("不支持该文件类型")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_UPLOADIMG_SIZE:
        raise APIError("图片尺寸过大")

    avatar_url, result = change_avatar(user_id, file_bytes, db)
    if result:
        return JSONResponse({"msg": "修改头像成功", "avatar_url": avatar_url})

    raise APIError("修改头像失败")
