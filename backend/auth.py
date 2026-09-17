from datetime import datetime, timedelta
from typing import Optional
import jwt

# IMPORTANTE: Mudar esta chave em produção!
SECRET_KEY = "mude-esta-chave-em-producao-use-algo-bem-aleatorio-e-seguro"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


def criar_token(usuario_id: int, email: str) -> str:
    """
    Cria JWT token para autenticação
    
    Args:
        usuario_id: ID do usuário
        email: Email do usuário
    
    Returns:
        Token JWT assinado
    """
    payload = {
        "usuario_id": usuario_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str) -> Optional[dict]:
    """
    Verifica e decodifica JWT token
    
    Args:
        token: Token JWT
    
    Returns:
        Payload do token se válido, None se inválido
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        # Token expirado
        return None
    except jwt.InvalidTokenError:
        # Token inválido
        return None
