import os
import sqlite3
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr

from db import get_db

router = APIRouter()
_bearer = HTTPBearer()


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24


class AuthRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


def _make_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: sqlite3.Connection = Depends(get_db),
) -> dict:
    """Decode JWT and return the user row. Raises 401 on any failure."""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    row = db.execute("SELECT id, email FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return dict(row)


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "email": user["email"]}


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: AuthRequest, db: sqlite3.Connection = Depends(get_db)):
    existing = db.execute("SELECT id FROM users WHERE email = ?", (body.email,)).fetchone()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    password_hash = _hash(body.password)
    cursor = db.execute(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        (body.email, password_hash),
    )
    db.commit()
    return TokenResponse(access_token=_make_token(cursor.lastrowid))


@router.post("/signin", response_model=TokenResponse)
def signin(body: AuthRequest, db: sqlite3.Connection = Depends(get_db)):
    row = db.execute(
        "SELECT id, password_hash FROM users WHERE email = ?", (body.email,)
    ).fetchone()
    if not row or not _verify(body.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=_make_token(row["id"]))
