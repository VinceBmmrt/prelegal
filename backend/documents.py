import json
import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from db import get_db

router = APIRouter()


class SaveDocumentRequest(BaseModel):
    document_type: str
    document_name: str
    fields: dict[str, Any]


@router.post("/documents", status_code=201)
def save_document(
    body: SaveDocumentRequest,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db),
):
    cursor = db.execute(
        "INSERT INTO documents (user_id, document_type, document_name, fields) VALUES (?, ?, ?, ?)",
        (user["id"], body.document_type, body.document_name, json.dumps(body.fields, ensure_ascii=False)),
    )
    db.commit()
    return {"id": cursor.lastrowid}


@router.get("/documents")
def list_documents(
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db),
):
    rows = db.execute(
        "SELECT id, document_type, document_name, fields, created_at "
        "FROM documents WHERE user_id = ? ORDER BY created_at DESC",
        (user["id"],),
    ).fetchall()
    return [
        {
            "id": r["id"],
            "document_type": r["document_type"],
            "document_name": r["document_name"],
            "fields": json.loads(r["fields"]),
            "created_at": r["created_at"],
        }
        for r in rows
    ]


@router.delete("/documents/{doc_id}", status_code=204)
def delete_document(
    doc_id: int,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db),
):
    result = db.execute(
        "DELETE FROM documents WHERE id = ? AND user_id = ?",
        (doc_id, user["id"]),
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "Document introuvable")
