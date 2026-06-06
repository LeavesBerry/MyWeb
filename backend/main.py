#第三方库
from fastapi import FastAPI, Request, HTTPException, Depends, status, Response
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, event
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from dotenv import load_dotenv
import uvicorn
#标准库
from email.message import EmailMessage
from datetime import datetime, timedelta, timezone
from typing import Optional
import random
import smtplib
import time
import os
import re

# 环境变量
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "leavesberry-helloworld-520")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_AUTH_CODE = os.getenv("EMAIL_AUTH_CODE")

# FastAPI 实例
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/refreshToken")

# 静态文件
frontend_public_dir = os.path.abspath(r"../frontend/LeavesBerry-project/public")
app.mount("/static", StaticFiles(directory=frontend_public_dir), name="static")

# 数据库配置
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "LeavesBerry#Zzy")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "leavesberry")
 # MySQL 连接串
database_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
connect_args = {}

engine = create_engine(
    database_url,
    pool_pre_ping=True,  # MySQL 连接保活
    pool_recycle=3600
)
 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 自定义异常
class APIError(Exception):
    def __init__(self, error: str):
        self.error = error

@app.exception_handler(APIError)
async def handle_api_error(request: Request, exc: APIError):
    return JSONResponse({"error": exc.error})

@app.exception_handler(HTTPException)
async def handle_http_error(request: Request, exc: HTTPException):
    return JSONResponse({"error": exc.detail})

@app.exception_handler(Exception)
async def handle_global_error(request: Request, exc: Exception):
    return JSONResponse({"error": "服务器异常"})

# 工具函数
def send_email(user_email: str, text: str, subject: str) -> bool:
    try:
        sender = smtplib.SMTP_SSL("smtp.qq.com", 465)
        sender.login(EMAIL_SENDER, EMAIL_AUTH_CODE)
        msg = EmailMessage()
        msg.set_content(text, subtype="plain", charset="utf-8")
        msg["From"] = f"LeavesBerry <{EMAIL_SENDER}>"
        msg["To"] = user_email
        msg["Subject"] = subject
        sender.send_message(msg)
        sender.quit()
        return True
    except Exception as e:
        print(f"邮件发送失败: {e}")
        return False

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_pw: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_pw.encode("utf-8"))

def check_password_strength(password: str):
    if len(password) < 8:
        raise APIError("密码至少8位")
    if not re.search(r"[A-Za-z]", password) or not re.search(r"[0-9]", password):
        raise APIError("密码必须包含字母+数字")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) 

async def check_code_rate(user_email: str, db: Session):
    now = time.time()
    last = db.query(Code).filter(Code.user_email == user_email).first()
    if last and now - last.create_time < 60:
        raise APIError("验证码发送过于频繁")

def clean_expired_codes(db: Session):
    now = time.time()
    db.query(Code).filter(now - Code.create_time > 300).delete()
    db.commit()

# 鉴权
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="登录已失效",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
        user = db.query(User).filter(User.user_id == int(user_id)).first()
        if not user:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception

# 数据库模型
class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_email = Column(String(120), unique=True, nullable=False, index=True)
    user_name = Column(String(80), nullable=False)
    password_hash = Column(String(256), nullable=False)

class Code(Base):
    __tablename__ = "code"
    user_id = Column(Integer, primary_key=True)
    user_email = Column(String(120), unique=True, nullable=False, index=True)
    code = Column(String(10), unique=True, nullable=False)
    create_time = Column(Float, default=time.time)

class LimLogin(Base):
    __tablename__ = "lim_login"
    user_ip = Column(String(20), primary_key=True, unique=True, index=True, nullable=False)
    try_times = Column(Integer, default=0, nullable=False)
    lim_start_time = Column(Float, default=0, nullable=False)
    lim_time = Column(Integer, default=0, nullable=False)

class Coll(Base):
    __tablename__ = "coll"
    user_id = Column(Integer, ForeignKey("user.user_id"), primary_key=True, nullable=False)
    url = Column(String(100), primary_key=True, nullable=False)
    title = Column(String(255), default="未知界面", nullable=False)

class Pages(Base):
    __tablename__ = "pages"
    url = Column(String(100), primary_key=True, unique=True, nullable=False)
    title = Column(String(255), default="未知界面", nullable=False)

# 请求模型
class SendCodeRequest(BaseModel):
    user_email: EmailStr

class RegisterRequest(BaseModel):
    user_name: str
    user_email: EmailStr
    code: str
    password: str

    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 8 or not re.search(r"[A-Za-z]", value) or not re.search(r"[0-9]", value):
            raise APIError("密码必须8位以上，包含字母+数字")
        return value

class LoginRequest(BaseModel):
    user_email: EmailStr
    password: str

class CollRequest(BaseModel):
    url: str
    title: Optional[str] = None

    @field_validator("url")
    def validate_url(cls, value):
        if not value or len(value) > 1000:
            raise APIError("URL不合法")
        return value


Base.metadata.create_all(bind=engine)
# ------------------------------
# 路由
# ------------------------------
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")

# 连通性测试接口
@app.get("/api/ping")
async def ping():
    return {"status": "ok", "msg": "后端连接成功"}

@app.post("/api/sendCode")
async def send_code(data: SendCodeRequest, db: Session = Depends(get_db)):
    await check_code_rate(data.user_email, db)
    clean_expired_codes(db)
    old_code = db.query(Code).filter(Code.user_email == data.user_email).first()
    if old_code:
        db.delete(old_code)
    while True:
        code = random.randint(100000, 999999)
        try:
            new_code = Code(user_email=data.user_email, code=str(code), create_time=time.time())
            db.add(new_code)
            db.commit()
            break
        except IntegrityError:
            db.rollback()
            continue
    send_email(data.user_email, f"验证码：{code}", "LeavesBerry验证码")
    return {"msg": "验证码已发送"}

@app.post("/api/register")
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    clean_expired_codes(db)
    code_record = db.query(Code).filter(Code.user_email == data.user_email).first()
    if not code_record or code_record.code != data.code:
        raise APIError("验证码错误")
    if time.time() - code_record.create_time > 300:
        db.delete(code_record)
        db.commit()
        raise APIError("验证码已过期")
    exist = db.query(User).filter(User.user_email == data.user_email).first()
    if exist:
        raise APIError("用户已存在")
    hashed = hash_password(data.password)
    user = User(user_email=data.user_email, user_name=data.user_name, password_hash=hashed)
    db.add(user)
    db.delete(code_record)
    db.commit()
    return {"msg": "注册成功"}

@app.post("/api/login")
async def login(request: Request, response: Response, data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_email == data.user_email).first()
    if not user:
        raise APIError("用户不存在")
    ip = request.client.host
    lim = db.query(LimLogin).filter(LimLogin.user_ip == ip).first()
    if not lim:
        lim = LimLogin(user_ip=ip)
        db.add(lim)
        db.commit()
    now = time.time()
    if now < lim.lim_start_time + lim.lim_time:
        raise APIError("登录过于频繁，请稍后再试")
    if not verify_password(data.password, user.password_hash):
        lim.try_times += 1
        if lim.try_times >= 5:
            lim.lim_start_time = now
            lim.lim_time = 300
            lim.try_times = 0
        db.commit()
        raise APIError("密码错误")
    lim.try_times = 0
    db.commit()
    access_token = create_access_token({"sub": str(user.user_id)})
    refresh_token = create_refresh_token({"sub": str(user.user_id)})
    response.set_cookie(
        key="refresh_cookie",
        value=refresh_token,
        expires=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    return {"msg": f"欢迎回来，{user.user_name}", "access_token": access_token}

@app.post("/api/getUserInfo")
def get_user_info(user: User = Depends(get_current_user)):
    return {
        "msg": "获取成功",
        "is_logined": True,
        "user_id": user.user_id,
        "user_name": user.user_name,
        "user_email": user.user_email
    }

@app.post("/api/refreshToken")
async def refresh_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="登录已失效",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise credentials_exception
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
        user = db.query(User).filter(User.user_id == int(user_id)).first()
        if not user:
            raise credentials_exception
        new_access_token = create_access_token({"sub": str(user.user_id)})
        return {"access_token": new_access_token}
    except JWTError:
        raise credentials_exception
    
@app.post("logout")
def logout(response: Response):
    response.delete_cookie(key="refresh_cookie", path="/")
    return {"msg": "已退出登录"}

@app.post("/api/initColl")
async def init_coll(data: CollRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exist = db.query(Coll).filter(Coll.user_id == user.user_id, Coll.url == data.url).first()
    return {"msg": "ok", "is_collected": exist is not None}

@app.post("/api/toggleColl")
async def toggle_coll(data: CollRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    coll = db.query(Coll).filter(Coll.user_id == user.user_id, Coll.url == data.url).first()
    title = data.title or data.url
    if coll:
        db.delete(coll)
        db.commit()
        return {"msg": "已取消收藏", "is_collected": False}
    else:
        new_coll = Coll(user_id=user.user_id, title=title, url=data.url)
        db.add(new_coll)
        db.commit()
        return {"msg": "收藏成功", "is_collected": True}

if __name__ == "__main__":   
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
