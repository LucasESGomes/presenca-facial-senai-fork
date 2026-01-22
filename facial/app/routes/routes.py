import json
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.services.recognition_service import recognize_student

router = APIRouter()


@router.post(
    "/recognize",
    tags=["recognize"]
)
async def recognize_face(
    room: str = Form(...),
    candidates: str = Form(...),  # continua sendo string
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
        print(f"🔍 Tipo do primeiro candidato: {type(candidates_list[0])}")

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
