import os
from typing import List, Optional
from uuid import UUID
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Importar pipeline RAG
try:
    from backend.rag import RAGPipeline
except ImportError:
    from rag import RAGPipeline

app = FastAPI(
    title="InnerMap API",
    description="Backend API de Memória Inteligente (RAG) para Reorganização Informacional",
    version="1.0.0"
)

# Permitir CORS para conexões locais do Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, especificar domínios reais
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar o Pipeline RAG (Mock ou Ativo se chaves configuradas)
rag_pipeline = RAGPipeline()

# ==========================================================================
# Pydantic Schemas (Validação de Dados)
# ==========================================================================
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

class JourneyCreate(BaseModel):
    phrase: str
    is_hereditary: Optional[bool] = False
    fact_detail: Optional[str] = None

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    rating: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class JourneyResponse(BaseModel):
    id: UUID
    title: str
    category: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        orm_mode = True

class RatingUpdate(BaseModel):
    rating: str

class StatsResponse(BaseModel):
    total_journeys: int
    positive_percentage: int
    category_distribution: dict
    rating_distribution: dict


# ==========================================================================
# API Endpoints
# ==========================================================================

@app.get("/")
def read_root():
    return {
        "status": "active",
        "service": "InnerMap Smart Memory (RAG)",
        "docs": "/docs"
    }

# --- Autenticação ---
@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    # Mock do cadastro de usuário
    # Em produção, salvar no PostgreSQL gerando a senha criptografada (bcrypt)
    mock_id = UUID("11111111-1111-1111-1111-111111111111")
    return {
        "id": mock_id,
        "email": user_data.email,
        "created_at": datetime.now()
    }

@app.post("/auth/login")
async def login(user_data: UserRegister):
    # Mock do login com geração de JWT Token
    return {
        "access_token": "mock_jwt_token_for_innermap",
        "token_type": "bearer",
        "email": user_data.email,
        "is_premium": True,
        "subscription_plan": "yearly"
    }


# --- Jornadas e RAG Flow ---
@app.get("/journeys", response_model=List[JourneyResponse])
async def list_journeys(user_id: Optional[UUID] = None):
    # Em produção, recuperar as jornadas filtradas pelo user_id do token JWT
    # Query SQL: SELECT * FROM journeys WHERE user_id = :user_id ORDER BY created_at DESC
    return []

@app.post("/journeys", response_model=JourneyResponse)
async def create_journey(journey_data: JourneyCreate):
    phrase = journey_data.phrase.strip()
    if not phrase:
        raise HTTPException(
            status_code=400, 
            detail="A frase de entrada não pode ser vazia."
        )

    try:
        # Executar RAG Pipeline
        # 1. Recuperar contexto histórico relevante via similaridade vetorial (pgvector)
        # 2. Sintetizar prompt contextualizado
        # 3. Chamar o modelo de IA e gerar a resposta (ajuste, movimento, comandos)
        # 4. Salvar tudo no banco de dados relacional e vetorial
        result = await rag_pipeline.process_user_message(
            phrase, 
            is_hereditary=journey_data.is_hereditary, 
            fact_detail=journey_data.fact_detail
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar RAG: {str(e)}"
        )

@app.get("/journeys/{journey_id}", response_model=JourneyResponse)
async def get_journey(journey_id: UUID):
    # Retorna uma jornada com suas respectivas mensagens
    # Query SQL: SELECT * FROM journal_entries WHERE journey_id = :journey_id
    raise HTTPException(status_code=404, detail="Jornada não encontrada")

@app.post("/journeys/{journey_id}/rating")
async def submit_rating(journey_id: UUID, rating_data: RatingUpdate):
    # Atualiza o feedback pós-reorganização da última mensagem do usuário na jornada
    # Query SQL: UPDATE journal_entries SET rating = :rating WHERE id = (SELECT id FROM journal_entries WHERE journey_id = :journey_id AND role = 'user' ORDER BY created_at DESC LIMIT 1)
    return {
        "status": "success",
        "journey_id": journey_id,
        "rating": rating_data.rating
    }


# --- Estatísticas ---
@app.get("/stats", response_model=StatsResponse)
async def get_statistics(user_id: Optional[UUID] = None):
    # Calcula as métricas de evolução com base no histórico
    # Query SQL: Agrupamento por categorias de jornadas e contagem de ratings das entradas
    return {
        "total_journeys": 0,
        "positive_percentage": 0,
        "category_distribution": {},
        "rating_distribution": {
            "Igual": 0,
            "Mais leve": 0,
            "Mais claro": 0,
            "Mais confiante": 0,
            "Outro": 0
        }
    }
