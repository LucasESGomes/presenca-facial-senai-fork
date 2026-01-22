import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.routes.routes import router as api_router

app = FastAPI(
    title="Presença Facial SENAI - Facial API"
)

# =========================================================
# 🔐 CORS Configuration
# =========================================================

production = settings.PRODUCTION

if production:
    # Produção: apenas origens específicas
    allowed_origins = [
        "https://presenca-facial-senai.com",
        "https://www.presenca-facial-senai.com"
    ]
else:
    # Desenvolvimento: localhost e outras origens de teste
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://localhost:8080",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "x-facial-api-key",
        "Accept",
        "Origin",
        "User-Agent"
    ],
    expose_headers=["*"],
    max_age=3600  # Cache preflight por 1 hora
)

# =========================================================
# 📌 ROTAS
# =========================================================
app.include_router(api_router)

# =========================================================
# ❤️ HEALTHCHECK
# =========================================================
@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
