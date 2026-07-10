import os
from dotenv import load_dotenv

load_dotenv()

ROOT_PATH = os.getenv("ROOT_PATH", "http://localhost:5173")

SECRET_KEY = os.getenv("SECRET_KEY", "leavesberry-helloworld-520")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_AUTH_CODE = os.getenv("EMAIL_AUTH_CODE")

MAX_UPLOADIMG_SIZE = 2 * 1024 * 1024

PUBLIC_DIR = os.path.abspath("./data/static/")

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "LeavesBerry#Zzy")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "leavesberry")

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?charset=utf8mb4"
)
