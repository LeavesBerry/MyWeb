from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import exists
from sqlalchemy.orm import Session

from auth import get_current_user
from config import ROOT_PATH
from database import get_db
from models import Coll
from schemas import CollRequest
from services.security import hash_url

router = APIRouter()


@router.post("/api/initColl")
async def init_coll(
    data: CollRequest,
    user_id: int = Depends(get_current_user("user_id")),
    db: Session = Depends(get_db),
):
    exist = db.query(
        exists().where(Coll.user_id == user_id, Coll.url_hash == hash_url(data.url))
    ).scalar()
    return JSONResponse({"msg": "ok", "is_collected": "true" if exist else "false"})


@router.post("/api/toggleColl")
async def toggle_coll(
    data: CollRequest,
    user_id: int = Depends(get_current_user("user_id")),
    db: Session = Depends(get_db),
):
    coll = (
        db.query(Coll)
        .filter(Coll.user_id == user_id, Coll.url_hash == hash_url(data.url))
        .first()
    )
    title = data.title or data.url

    if coll:
        db.delete(coll)
        db.commit()
        return JSONResponse({"msg": "已取消收藏", "is_collected": "false"})

    new_coll = Coll(
        user_id=user_id,
        title=title,
        url=data.url,
        url_hash=hash_url(data.url),
        type=data.type,
    )
    db.add(new_coll)
    db.commit()
    return JSONResponse({"msg": "收藏成功", "is_collected": "true"})


@router.post("/api/getAllColl")
async def get_all_coll(
    user_id: int = Depends(get_current_user("user_id")),
    db: Session = Depends(get_db),
):
    colls = db.query(Coll).filter(Coll.user_id == user_id).all()
    return JSONResponse(
        [
            {
                "url": item.url.replace(ROOT_PATH, ""),
                "title": item.title,
                "type": item.type,
            }
            for item in colls
        ]
    )
