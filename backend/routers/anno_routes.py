from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from schemas import AnnoRequest
from models import Anno

router = APIRouter()


@router.post("/api/getAllAnnoInfo")
async def get_all_anno_info(db: Session = Depends(get_db)):
    annos = db.query(Anno.title, Anno.type, Anno.id, Anno.anno_date).all()
    annos = db.query(Anno.title, Anno.type, Anno.id, Anno.anno_date).all()
    return JSONResponse(
        [
            {
                "title": item.title,
                "type": item.type,
                "id": item.id,
                "anno_date": item.anno_date
                "id": item.id,
                "anno_date": item.anno_date
            }
            for item in annos
        ]
    )

@router.post("/api/getAnnounceText")
async def get_anno_text(data: AnnoRequest, db: Session = Depends(get_db)):
    text = db.query(Anno.id, Anno.title, Anno.main_text).filter(Anno.id == data.id).first()
    return JSONResponse({"main_text": text.main_text, "title": text.title})
