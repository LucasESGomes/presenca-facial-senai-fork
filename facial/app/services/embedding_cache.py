"""
Cache em memória para embeddings descriptografados
Evita descriptografar o mesmo aluno múltiplas vezes
"""

import base64
from functools import lru_cache
from typing import List, Dict, Tuple
from app.services.encryption_service import decrypt_embedding
from app.core.settings import settings


class EmbeddingCache:
    """
    Cache singleton para embeddings descriptografados.
    Usa LRU cache para limitar uso de memória.
    """
    
    _instance = None
    _decryption_key = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Inicializa a chave de descriptografia uma única vez"""
        self._decryption_key = base64.b64decode(settings.AES_ENCRYPTION_KEY)
        if len(self._decryption_key) != 32:
            raise ValueError("AES_ENCRYPTION_KEY deve ter 32 bytes")
    
    @lru_cache(maxsize=1000)
    def _decrypt_cached(self, ciphertext_b64: str, nonce_b64: str) -> Tuple[float, ...]:
        """
        Versão cached da descriptografia.
        Retorna tupla (imutável) para ser hashable no cache.
        
        Args:
            ciphertext_b64: Ciphertext em Base64
            nonce_b64: Nonce em Base64
            
        Returns:
            Tupla de floats (embedding descriptografado)
        """
        ciphertext = base64.b64decode(ciphertext_b64)
        nonce = base64.b64decode(nonce_b64)
        
        embedding = decrypt_embedding(
            ciphertext=ciphertext,
            nonce=nonce,
            key=self._decryption_key
        )
        
        # Converte para tupla (imutável) para cache
        return tuple(embedding)
    
    def get_decrypted_embedding(self, facial_data: Dict) -> List[float]:
        """
        Obtém embedding descriptografado (com cache).
        
        Args:
            facial_data: Dict com 'embedding' e 'nonce' em Base64
            
        Returns:
            Lista de floats (embedding)
        """
        ciphertext_b64 = facial_data['embedding']
        nonce_b64 = facial_data['nonce']
        
        # Busca no cache ou descriptografa
        embedding_tuple = self._decrypt_cached(ciphertext_b64, nonce_b64)
        
        # Retorna como lista
        return list(embedding_tuple)
    
    def clear_cache(self):
        """Limpa o cache (útil para testes ou reload de dados)"""
        self._decrypt_cached.cache_clear()
    
    def get_cache_info(self) -> Dict:
        """Retorna estatísticas do cache"""
        info = self._decrypt_cached.cache_info()
        return {
            "hits": info.hits,
            "misses": info.misses,
            "size": info.currsize,
            "maxsize": info.maxsize,
            "hit_rate": f"{(info.hits / (info.hits + info.misses) * 100):.2f}%" if (info.hits + info.misses) > 0 else "0%"
        }


# Instância global do cache
embedding_cache = EmbeddingCache()