import os
import struct
import base64
from typing import List, Dict
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.settings import settings

def encrypt_embedding(embedding: List[float]) -> Dict[str, str]:
    """
    Criptografa embedding facial usando AES-256-GCM
    e retorna dados em Base64 (JSON-safe).
    """

    embedding_bytes = b"".join(
        struct.pack("!d", value) for value in embedding
    )

    key = base64.b64decode(settings.AES_ENCRYPTION_KEY)

    if len(key) != 32:
        raise ValueError("AES_ENCRYPTION_KEY deve ter 32 bytes (Base64 de 256 bits)")

    aesgcm = AESGCM(key)
    nonce = os.urandom(12)

    ciphertext = aesgcm.encrypt(
        nonce=nonce,
        data=embedding_bytes,
        associated_data=None
    )

    return {
        "ciphertext": base64.b64encode(ciphertext).decode("utf-8"),
        "nonce": base64.b64encode(nonce).decode("utf-8")
    }



def decrypt_embedding(
    ciphertext: bytes,
    nonce: bytes,
    key: bytes
) -> List[float]:
    """
    Descriptografa um embedding facial usando AES-256-GCM
    e reconstrói a lista de floats.
    """

    # 1️ Inicializa AES-GCM com a chave
    aesgcm = AESGCM(key)

    # 2️ Descriptografa (verifica integridade automaticamente)
    plaintext = aesgcm.decrypt(
        nonce=nonce,
        data=ciphertext,
        associated_data=None
    )

    # 3️ Reconstrói o embedding (8 bytes por float64)
    embedding = [
        struct.unpack("!d", plaintext[i:i + 8])[0]
        for i in range(0, len(plaintext), 8)
    ]

    return embedding
