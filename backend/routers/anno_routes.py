from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Anno

router = APIRouter()


@router.post("/api/getAllAnno")
async def get_all_anno(db: Session = Depends(get_db)):
    annos = db.query(Anno).all()
    return JSONResponse(
        [
            {
                "title": item.title,
                "main_text": item.main_text,
                "type": item.type,
            }
            for item in annos
        ]
    )
