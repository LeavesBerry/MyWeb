from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse


class APIError(Exception):
    def __init__(self, error: str):
        self.error = error


async def handle_api_error(request: Request, exc: APIError):
    return JSONResponse({"error": exc.error}, status_code=400)


async def handle_http_error(request: Request, exc: HTTPException):
    return JSONResponse(
        {"error": exc.detail},
        status_code=exc.status_code,
        headers=exc.headers,
    )


async def handle_global_error(request: Request, exc: Exception):
    return JSONResponse({"error": "服务器异常"}, status_code=500)


def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(APIError, handle_api_error)
    app.add_exception_handler(HTTPException, handle_http_error)
    app.add_exception_handler(Exception, handle_global_error)
