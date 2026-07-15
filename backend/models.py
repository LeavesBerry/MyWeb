import time

from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey

from database import Base


class UserBase(Base):
    __tablename__ = "user_base"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_email = Column(String(120), unique=True, nullable=False, index=True)
    user_name = Column(String(80), nullable=False)
    password_hash = Column(String(256), nullable=False)


class UserProfile(Base):
    __tablename__ = "user_profile"

    user_id = Column(
        Integer,
        ForeignKey("user_base.user_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
        unique=True,
        index=True,
    )
    avatar_url = Column(
        String(100),
        default="http://localhost:5000/static/avatar/default_avatar.jpg",
        unique=False,
    )
    bio = Column(String(30), default="你好,世界")
    level_xp = Column(Integer, default=1000, nullable=False)


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

    user_id = Column(Integer, ForeignKey("user_base.user_id"), primary_key=True, nullable=False)
    url = Column(String(1000), nullable=False)
    url_hash = Column(String(64), primary_key=True, nullable=False)
    title = Column(String(255), default="未知界面", nullable=False)
    type = Column(String(10), default="other", nullable=False)


class Anno(Base):
    __tablename__ = "anno"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), default="公告", nullable=False)
    type = Column(String(10), default="other", nullable=False)
    main_text = Column(Text(), nullable=False)
    cur_date = Column(Integer, nullable=False)


class Pages(Base):
    __tablename__ = "pages"

    url = Column(String(100), primary_key=True, unique=True, nullable=False)
    title = Column(String(255), default="未知界面", nullable=False)
