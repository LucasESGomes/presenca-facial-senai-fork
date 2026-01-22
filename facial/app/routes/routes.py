import json
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.services.face_service import generate_embedding_from_image
from app.services.encryption_service import encrypt_embedding
from app.services.recognition_service import recognize_student

router = APIRouter()

# =========================================================
# 🔐 GERAR EMBEDDING FACIAL (CADASTRO)
# =========================================================
# - Recebe apenas uma imagem
# - Retorna embedding criptografado + nonce (Base64)
# =========================================================
@router.post(
    "/encode",
    tags=["encoding"]
)
async def encode_face(
    image: UploadFile = File(...)
):
    try:
        # ===========================
        # 1️⃣ BYTES DA IMAGEM
        # ===========================
        file_bytes = await image.read()

        if not file_bytes:
            raise ValueError("Imagem vazia")

        # ===========================
        # 2️⃣ GERAR EMBEDDING
        # ===========================
        embedding = generate_embedding_from_image(file_bytes)

        # ===========================
        # 3️⃣ CRIPTOGRAFAR EMBEDDING
        # ===========================
        encrypted = encrypt_embedding(embedding.tolist())

        return {
            "embedding": encrypted["ciphertext"],
            "nonce": encrypted["nonce"],
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# =========================================================
# 🎯 RECONHECER ALUNO PELO ROSTO (TOTEM)
# =========================================================
# - Recebe room + candidates + imagem
# - Faz matching facial em memória
# =========================================================
@router.post(
    "/recognize",
    tags=["recognize"]
)
async def recognize_face(
    room: str = Form(...),
    candidates: str = Form(...),  # JSON string
    image: UploadFile = File(...)
):
    print("🔵 Começando recognize_face")

    try:
        # ===========================
        # 1️⃣ BYTES DA IMAGEM
        # ===========================
        image_bytes = await image.read()
        print(f"🖼️ Bytes da imagem: {len(image_bytes)}")

        if not image_bytes:
            raise ValueError("Imagem vazia")

        # ===========================
        # 2️⃣ PARSE DOS CANDIDATOS
        # ===========================
        try:
            candidates_list = json.loads(candidates)
        except json.JSONDecodeError:
            raise ValueError("Campo 'candidates' não é um JSON válido")

        if not isinstance(candidates_list, list):
            raise ValueError("'candidates' deve ser uma lista")

        print(f"👥 Candidatos recebidos: {len(candidates_list)}")

        # ===========================
        # 3️⃣ RECONHECIMENTO
        # ===========================
        result = recognize_student(
            room_id=room,
            image_bytes=image_bytes,
            candidates=candidates_list
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
