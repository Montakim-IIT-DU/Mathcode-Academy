from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.db.init_db import init_db

app = FastAPI(
    title="Mathcode Academy API",
    version="1.0.0",
    description="Backend API for Mathcode Academy"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {
        "message": "Welcome to Mathcode Academy API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }