import os

from fastapi import APIRouter
from fastapi.responses import FileResponse

from config import PUBLIC_DIR

router = APIRouter()


@router.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join(PUBLIC_DIR, "favicon.ico"))


