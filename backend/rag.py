import os
from typing import List, Dict, Any
from uuid import uuid4
from datetime import datetime

# Se as bibliotecas estivessem instaladas, seriam importadas:
# import openai
# from sqlalchemy import text

def format_fact_for_sentence(fact: str) -> str:
    clean = fact.strip().lower()
    if not clean:
        return ""

    if clean.startswith("por ") or clean.startswith("na ") or clean.startswith("no ") or clean.startswith("em ") or clean.startswith("com "):
        return fact

    verb_participles = {
        'bati': 'batido', 'bater': 'batido',
        'perdi': 'perdido', 'perder': 'perdido',
        'errei': 'errado', 'errar': 'errado',
        'briguei': 'brigado', 'brigar': 'brigado',
        'falei': 'falado', 'falar': 'falado',
        'discuti': 'discutido', 'discutir': 'discutido',
        'fiz': 'feito', 'fazer': 'feito',
        'gastei': 'gastado', 'gastar': 'gastado',
        'comprei': 'comprado', 'comprar': 'comprado',
        'fui': 'ido', 'ir': 'ido',
        'tive': 'tido', 'ter': 'tido',
        'recebi': 'recebido', 'receber': 'recebido',
        'senti': 'sentido', 'sentir': 'sentido',
        'fiquei': 'ficado', 'ficar': 'ficado',
        'gritei': 'gritado', 'gritar': 'gritado',
        'chorei': 'chorado', 'chorar': 'chorado',
        'quebrei': 'quebrado', 'quebrar': 'quebrado',
        'falhei': 'falhado', 'falhar': 'falhado',
        'minto': 'mentido', 'menti': 'mentido', 'mentir': 'mentido'
    }

    words = clean.split()
    verb_index = -1
    participle = ""
    for i, w in enumerate(words):
        if w in verb_participles:
            verb_index = i
            participle = verb_participles[w]
            break

    if verb_index != -1:
        words_before = " ".join(words[:verb_index])
        words_after = " ".join(words[verb_index+1:])
        result = f"por eu ter {participle}"
        if words_after:
            result += f" {words_after}"
        if words_before:
            result += f" {words_before}"
        return result

    feminine_nouns = ["briga", "discussão", "conversa", "perda", "demissão", "reunião", "viagem", "morte", "separação", "traição", "crítica", "fofoca"]
    masculine_nouns = ["conflito", "desentendimento", "erro", "acidente", "assalto", "problema", "gasto", "atraso"]

    if not words:
        return fact
    first_word = words[0]
    if first_word in feminine_nouns:
        return f"na {fact}"
    if first_word in masculine_nouns:
        return f"no {fact}"

    return f"em relação a '{fact}'"

class RAGPipeline:
    def __init__(self):
        # Chaves de API seriam carregadas do arquivo .env
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "mock_key")
        self.embeddings_model = "text-embedding-3-small"
        self.chat_model = "gpt-4o-mini"

    async def get_embedding(self, text_input: str) -> List[float]:
        """
        Gera o vetor de embeddings de 1536 dimensões via OpenAI API
        """
        # Exemplo real de integração caso a chave exista
        if self.openai_api_key != "mock_key":
            try:
                # import openai
                # response = openai.Embedding.create(input=[text_input], model=self.embeddings_model)
                # return response['data'][0]['embedding']
                pass
            except Exception:
                pass
        
        # Fallback / Mock de Vetor de 1536 dimensões (normalizado para teste)
        import random
        random.seed(hash(text_input))
        mock_vector = [random.uniform(-1.0, 1.0) for _ in range(1536)]
        # Normalizar o vetor para similaridade cosseno
        norm = sum(x**2 for x in mock_vector)**0.5
        return [x/norm for x in mock_vector]

    async def retrieve_context(self, query_embedding: List[float], limit: int = 2) -> List[Dict[str, Any]]:
        """
        Efetua a busca vetorial por similaridade cosseno no PostgreSQL usando pgvector
        Query correspondente em SQL:
        SELECT content, rating, 1 - (embedding <=> :embedding) AS similarity
        FROM journal_entries
        WHERE role = 'user'
        ORDER BY embedding <=> :embedding
        LIMIT :limit;
        """
        # Exemplo de código SQLAlchemy ativo para recuperação:
        # async with async_session() as session:
        #     query = text("""
        #         SELECT je.content, je.created_at, je.rating, j.category
        #         FROM journal_entries je
        #         JOIN journeys j ON je.journey_id = j.id
        #         WHERE je.role = 'user' AND je.embedding IS NOT NULL
        #         ORDER BY je.embedding <=> :embedding
        #         LIMIT :limit
        #     """)
        #     result = await session.execute(query, {"embedding": str(query_embedding), "limit": limit})
        #     return [{"content": row[0], "rating": row[2], "category": row[3]} for row in result.fetchall()]
        
        # Retorna mock de recuperação local (simulada pelo backend)
        return []

    def build_prompt(self, query: str, context: List[Dict[str, Any]]) -> str:
        """
        Constrói o prompt final injetando o contexto recuperado semanticamente
        """
        system_instruction = (
            "Você é o InnerMap, um assistente de desenvolvimento pessoal especializado em reestruturar padrões de "
            "comportamento limitantes. Sua resposta deve conter:\n"
            "1. AJUSTE: Explicação de como a mente associa esse conflito a um padrão limitante inconsciente.\n"
            "2. MOVIMENTO: Proposta prática de acolhimento e mudança cognitiva.\n"
            "3. 1 - Movimento Sistêmico Informacional - MSI (Liberação de Alma/Espírito para registros hereditários).\n"
            "4. 2 - Movimento Factual Informacional - MFI (Liberação de Alma para cada sentimento do fato + encerramento de Alma e Espírito).\n"
            "5. 3 - Movimento de Reinterpretação Informacional - MRI (Escolha ativa de Espírito e Alma no presente).\n"
        )
        
        context_str = ""
        if context:
            context_str = "\n--- MEMÓRIA INTELIGENTE (Histórico relevante recuperado) ---\n"
            for i, item in enumerate(context):
                context_str += f"- Registro antigo {i+1}: '{item['content']}' | Feedback emocional pós-prática: {item['rating']}\n"
            context_str += "---------------------------------------------------------\n"

        prompt = (
            f"{system_instruction}"
            f"{context_str}"
            f"\nPergunta atual do usuário: '{query}'\n"
            f"Gere a resposta estruturada com base no estado interno atual e no histórico de memória injetado."
        )
        return prompt

    async def process_user_message(self, phrase: str, is_hereditary: bool = False, fact_detail: Optional[str] = None) -> Dict[str, Any]:
        """
        Tópico principal: Executa o ciclo completo do pipeline RAG
        """
        # 1. Gerar o vetor de embeddings da frase atual
        embedding = await self.get_embedding(phrase)
        
        # 2. Buscar registros semanticamente semelhantes no pgvector
        context = await self.retrieve_context(embedding, limit=2)
        
        # 3. Montar o prompt contextual
        prompt = self.build_prompt(phrase, context)
        
        # 4. Chamar LLM (Exemplo simulado rápido / motor de categorização)
        # Classificação básica para manter coerência sem requisições reais lentas
        category = "Autoconhecimento"
        if any(w in phrase.lower() for w in ["dinheiro", "escassez", "trabalho", "vender", "negócio"]):
            category = "Prosperidade"
        elif any(w in phrase.lower() for w in ["relacionamento", "amor", "abandono", "ciúme", "marido", "esposa"]):
            category = "Relacionamentos"

        # Simular leitura informacional da IA
        result_id = uuid4()
        journey_id = uuid4()
        
        # Sentimentos e estrutura MSI/MFI/MRI adaptada
        sentiments = ["tristeza", "raiva", "injustiça"] if category == "Relacionamentos" else ["insegurança", "pressão", "frustração"]
        
        # MSI
        msi_text = ""
        if is_hereditary:
            msi_text = (
                f"Alma, comportamentos e registros hereditários de '{phrase.lower()}' que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n"
                f"Espírito, pensamentos hereditários de '{phrase.lower()}' que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n"
            )
        
        # MFI
        mfi_text = ""
        if fact_detail and fact_detail.strip():
            clean_fact = fact_detail.strip()
            formatted_fact = format_fact_for_sentence(clean_fact)
            # Procurar sentimentos na frase do fato
            matched = []
            for s in ["culpa", "injustiça", "dor", "tristeza", "solidão", "rejeição", "desaprovação", "carência", "raiva", "ódio", "decepção", "incompetência", "incapacidade", "inferioridade", "pressão", "invasão", "usada", "manipulada", "desrespeitada", "ser controlada", "não controlar", "perder o controle", "sensação de estar ou ser feia", "pânico", "medo", "trocada", "frustração", "sensação de perder o sentido da vida", "insegurança", "nojo", "desânimo", "não servir pra nada", "vontade de morrer", "angústia", "incerteza", "sensação de não ter estabilidade", "abandonada", "submissão"]:
                if s in clean_fact.lower():
                    matched.append(s)
            
            # Heurísticas
            if "briga" in clean_fact.lower() or "discuti" in clean_fact.lower() or "carro" in clean_fact.lower() or "bati" in clean_fact.lower():
                if "tristeza" not in matched: matched.append("tristeza")
                if "raiva" not in matched: matched.append("raiva")
                if "injustiça" not in matched: matched.append("injustiça")

            if not matched:
                matched = sentiments
            
            for s in matched:
                mfi_text += f"Alma, {s} que senti {formatted_fact} acabou!\n"
            mfi_text += f"Alma, todos os sentimentos que senti {formatted_fact} acabaram!\n"
            mfi_text += f"Espírito, todas as informações negativas que recebi {formatted_fact} acabou!\n"
            mfi_text += f"Espírito, todas as informações negativas que gerei {formatted_fact} acabou!\n\n"
        
        # MRI
        mri_text = ""
        if category == "Prosperidade":
            mri_text = f"Espírito, minha consciência escolhe, eu escolho direcionar minha atenção para possibilidades, soluções e expansão.\nAlma, eu já construo riqueza com presença, consistência e equilíbrio."
        else:
            mri_text = f"Espírito, minha consciência escolhe, eu escolho focar em equilíbrio interno, clareza e novas soluções.\nAlma, eu já organizo meu estado interno com consistência, presença e leveza."

        response_text = (
            f"Ajuste observado: O padrão de '{phrase.lower()}' está gerando registros ativos que influenciam suas escolhas automáticas.\n\n"
            f"Movimento sugerido: Acolher este registro factual conscientemente para liberar a carga emocional e atualizar seu padrão de percepção.\n\n"
            f"{msi_text}{mfi_text}{mri_text}"
        )

        return {
            "id": journey_id,
            "title": f"Jornada sobre {phrase[:30]}...",
            "category": category,
            "created_at": datetime.now(),
            "messages": [
                {
                    "id": uuid4(),
                    "role": "user",
                    "content": phrase,
                    "rating": None,
                    "created_at": datetime.now()
                },
                {
                    "id": uuid4(),
                    "role": "assistant",
                    "content": response_text,
                    "rating": None,
                    "created_at": datetime.now()
                }
            ]
        }
