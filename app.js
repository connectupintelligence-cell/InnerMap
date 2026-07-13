// Global Error Debugging Handler
window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = `Erro JavaScript: ${message}\nFonte: ${source}:${lineno}:${colno}`;
    console.error(errorMsg);
    alert(errorMsg);
    return false;
};

window.appLoaded = true;

/**
 * InnerMap - Motor de Reorganização Informacional
 * Core Logic, State Management & Supabase Backend Integration
 */

// ==========================================================================
// CONFIGURAÇÃO DO SUPABASE (BANCO DE DADOS & AUTH REMOTO)
// ==========================================================================
// Insira as chaves do seu projeto do Supabase aqui para ativar o login real com Google
// e sincronização das reorganizações na nuvem de forma 100% gratuita e sem servidor.
// Caso fiquem vazias, o aplicativo entrará em modo de simulação local automática.
const SUPABASE_URL = "https://vyhwpjktsdvfnwvvjnbh.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_vfK43gvWRToO8gR9cd9ttA_dzDrAqHI";

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client inicializado com sucesso!");
    } catch (err) {
        console.error("Erro de inicialização do Supabase:", err);
    }
}
// ==========================================================================
// CONFIGURAÇÃO DO INFINITEPAY (GATEWAY DE PAGAMENTOS)
// ==========================================================================
// Insira sua InfiniteTag (sem o @) para gerar cobranças dinâmicas via API.
// Caso queira usar links estáticos diretos gerados no app, preencha-os abaixo.
const INFINITEPAY_TAG = "connectup"; // Ex: "wavequantum"
const INFINITEPAY_LINK_MONTHLY = "https://link.infinitepay.io/connectup/VC1DLUMtSQ-GaCy6VClhl-49,90"; // Opcional: Link estático mensal (R$ 49,90)
const INFINITEPAY_LINK_YEARLY = "https://link.infinitepay.io/connectup/VC1DLUMtSQ-n9UsJS7UiU-478,80"; // Opcional: Link estático anual (R$ 478,80)

// Banco de dados de padrões predefinidos para o motor de conteúdo
const INFORMATIONAL_DATABASE = {
    "medo_crescer": {
        keywords: ["crescer", "sucesso", "expandir", "escala", "tamanho", "responsabilidade", "liderança", "crescimento"],
        category: "Trabalho",
        categoryEmoji: "📁 Trabalho",
        title: "Medo de Crescer",
        ajuste: "Você pode estar associando crescimento a sobrecarga de responsabilidade, perda de liberdade ou solidão.",
        movimento: "Desenvolver uma expansão sustentável, delegando com confiança e acolhendo novas oportunidades.",
        objetivo: "Crescer de forma leve, segura e alinhada.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, receio e comportamentos de medo de crescer, autossabotagem e medo da sobrecarga que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\nEspírito, pensamentos de que crescer é arriscado ou perigoso que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, insegurança que senti ao encarar novas responsabilidades e crescimento nos negócios acabaram!\nAlma, todos os sentimentos que senti em relação ao medo de crescer acabaram!\nEspírito, todas as informações negativas que recebi sobre crescer acabou!\nEspírito, todas as informações negativas que gerei sobre crescer acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho acolher a expansão com segurança, leveza e consistência.\nAlma, eu já construo crescimento seguro e delego tarefas com total tranquilidade e merecimento.",
        pergunta: "Qual o menor passo de crescimento que você pode dar hoje que não assuste sua percepção racional?",
        microacao: "Escrever uma meta de crescimento para o próximo mês e listar duas tarefas que você pode delegar ou simplificar."
    },
    "culpa_descansar": {
        keywords: ["descansar", "pausa", "parar", "lazer", "tempo livre", "ócio", "dormir", "férias", "descanso"],
        category: "Prosperidade",
        categoryEmoji: "📁 Prosperidade",
        title: "Culpa por Descansar",
        ajuste: "A percepção de que seu valor pessoal depende exclusivamente do seu nível de produtividade diária.",
        movimento: "Reconhecer que a pausa é essencial para a criatividade e a sustentabilidade de suas realizações.",
        objetivo: "Descansar sem culpa e com paz interna profunda.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos e crenças de que preciso trabalhar em esforço extremo para ter valor que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, culpa que senti ao parar para descansar e relaxar acabaram!\nAlma, ansiedade que senti ao ter tempo livre acabaram!\nAlma, todos os sentimentos de culpa por descansar acabaram!\nEspírito, todas as informações negativas que recebi sobre descansar acabou!\nEspírito, todas as informações negativas que gerei sobre descansar acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho silenciar minha mente e restabelecer minha energia vital.\nAlma, eu já descanso com tranquilidade e paz, reconhecendo que a pausa potencializa minha prosperidade.",
        pergunta: "O que você estaria evitando encarar se decidisse silenciar e descansar agora?",
        microacao: "Bloquear 30 minutos na sua agenda hoje para fazer algo puramente por lazer, sem fins produtivos."
    },
    "dificuldade_vender": {
        keywords: ["vender", "vendas", "cobrar", "preço", "dinheiro", "cliente", "oferta", "negociar", "pedir valor"],
        category: "Trabalho",
        categoryEmoji: "📁 Trabalho",
        title: "Dificuldade de Vender ou Cobrar",
        ajuste: "A associação da venda e da cobrança a importunar os outros, medo da rejeição ou sensação sutil de não merecimento.",
        movimento: "Enxergar a venda como uma troca justa de valor, onde você apoia genuinamente a resolução de uma necessidade real.",
        objetivo: "Fluidez, valorização e segurança na entrega de suas soluções.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos e receios de cobrar pelo meu valor ou oferecer meus produtos que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, vergonha que senti ao falar de preços ou vender acabaram!\nAlma, rejeição que senti quando clientes disseram não acabaram!\nAlma, todos os sentimentos de dificuldade de vender e cobrar acabaram!\nEspírito, todas as informações negativas que recebi sobre vendas acabou!\nEspírito, todas as informações negativas que gerei sobre vendas acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho ver a venda como uma troca justa de valor e auxílio mútuo.\nAlma, eu já recebo dinheiro com fluidez, merecimento e autoconfiança plena em minha entrega.",
        pergunta: "Se o seu produto ou serviço pudesse transformar positivamente a vida de alguém hoje, você ainda teria vergonha de oferecê-lo?",
        microacao: "Enviar uma mensagem para um cliente antigo perguntando como ele está ou fazer uma oferta direta para um potencial cliente."
    },
    "medo_negocios": {
        keywords: ["medo nos negócios", "errar", "falhar", "quebrar", "falência", "empreender", "risco", "perder dinheiro", "decisão"],
        category: "Coragem",
        categoryEmoji: "📁 Coragem",
        title: "Medo de Errar ou Falhar nos Negócios",
        ajuste: "O receio do fracasso ou da perda de controle organizando suas decisões sob um viés de paralisação e autoproteção.",
        movimento: "Compreender cada resultado como um feedback de aprendizado, fortalecendo sua capacidade de resposta e adaptação.",
        objetivo: "Decisão consciente, resiliência e clareza profissional.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos e receio de perder o controle e falhar nos negócios que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\nEspírito, pensamentos de falência e quebra nos negócios que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, medo que senti de errar in decisões de negócios acabaram!\nAlma, frustração que senti com resultados insatisfatórios acabaram!\nAlma, todos os sentimentos de insegurança e medo de falhar nos negócios acabaram!\nEspírito, todas as informações negativas que recebi nos negócios acabou!\nEspírito, todas as informações negativas que gerei nos negócios acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho focar em soluções estratégicas, aprendizado constante e resiliência.\nAlma, eu já decido com clareza profissional, guiando meus negócios rumo à solidez e prosperidade.",
        pergunta: "Qual decisão importante você está adiando ou evitando por medo do que pode acontecer depois?",
        microacao: "Tomar hoje uma decisão simples que você vem adiando nos últimos 7 dias."
    },
    "carencia_emocional": {
        keywords: ["carência", "abandono", "rejeição", "solteiro", "solidão", "ciúmes", "dependência", "relacionamento", "amor", "parceiro", "carência emocional"],
        category: "Relacionamentos",
        categoryEmoji: "📁 Relacionamentos",
        title: "Carência e Dependência Emocional",
        ajuste: "A busca externa pela validação, segurança e afeto que você sente faltar em sua própria organização interna.",
        movimento: "Fortalecer seu autocuidado e acolhimento interno, construindo sua própria base de segurança afetiva.",
        objetivo: "Autonomia afetiva, amor-próprio e conexões saudáveis.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos de dependência afetiva e medo da solidão que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, carência que senti pela falta de atenção ou afeto acabaram!\nAlma, abandono que senti em meus relacionamentos antigos acabaram!\nAlma, todos os sentimentos de carência e solidão acabaram!\nEspírito, todas as informações negativas que recebi em minhas relações acabou!\nEspírito, todas as informações negativas que gerei em minhas relações acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho nutrir meu amor-próprio e encontrar estabilidade dentro de mim.\nAlma, eu já me sinto pleno(a) e seguro(a), me relacionando com liberdade e maturidade emocional.",
        pergunta: "Que tipo de atenção ou validação você está esperando dos outros que você mesmo(a) não está se dando?",
        microacao: "Escrever uma pequena lista com 3 qualidades reais suas ou preparar um momento especial de autocuidado hoje."
    },
    "medo_julgamento": {
        keywords: ["julgamento", "crítica", "opinião", "exposição", "falar em público", "vergonha", "timidez", "esconder", "aparência"],
        category: "Autoestima",
        categoryEmoji: "📁 Autoestima",
        title: "Medo do Julgamento e da Crítica",
        ajuste: "A necessidade de aprovação externa atuando como um filtro limitador da sua expressão e do seu potencial autêntico.",
        movimento: "Acolher sua verdade interna e compreender que a percepção do outro reflete a realidade dele, não o seu valor real.",
        objetivo: "Liberdade de expressão e segurança pessoal profunda.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos de autoanulação e vergonha de me expor que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\nEspírito, pensamentos de desaprovação e críticas dos outros que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, insegurança que senti ao falar em público ou me expor acabaram!\nAlma, rejeição que senti quando fui criticado(a) acabaram!\nAlma, todos os sentimentos de medo do julgamento alheio acabaram!\nEspírito, todas as informações negativas que recebi da opinião pública acabou!\nEspírito, todas as informações negativas que gerei sobre me expressar acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho expressar minha verdade interna com liberdade e segurança.\nAlma, eu já me exponho com autovalorização e reconheço o real valor de minha própria voz.",
        pergunta: "O que você começaria a criar ou fazer hoje mesmo se soubesse que não seria criticado ou julgado?",
        microacao: "Expressar uma opinião autêntica ou compartilhar um pensamento pessoal com alguém de confiança."
    },
    "sobrecarga_cansaco": {
        keywords: ["cansaço", "cansado", "esgotado", "sobrecarga", "estresse", "ansiedade", "energia", "vitalidade", "corpo", "limite"],
        category: "Saúde emocional",
        categoryEmoji: "📁 Saúde emocional",
        title: "Sobrecarga e Falta de Energia",
        ajuste: "Assumir responsabilidades e demandas que não são suas como uma forma inconsciente de buscar utilidade ou aceitação.",
        movimento: "Estabelecer limites claros e saudáveis, preservando seu estado interno e sua energia para o que é essencial.",
        objetivo: "Equilíbrio emocional, leveza e clareza de prioridades pessoais.",
        declaracao: "1 - Movimento Sistêmico Informacional - MSI\nAlma, comportamentos de assumir cargas alheias e dificuldade de dizer não que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, cansaço e pressão que senti por excesso de responsabilidades acabaram!\nAlma, invasão que senti ao ter meus limites desrespeitados acabaram!\nAlma, todos os sentimentos de sobrecarga e esgotamento acabaram!\nEspírito, todas as informações negativas que recebi por carregar pesos alheios acabou!\nEspírito, todas as informações negativas que gerei no excesso de tarefas acabou!",
        fortalecimento: "3 - Movimento de Reinterpretação Informacional - MRI\nEspírito, minha consciência escolhe, eu escolho respeitar os limites do meu corpo e priorizar meu bem-estar.\nAlma, eu já estabeleço limites saudáveis e gerencio minhas responsabilidades com total leveza.",
        pergunta: "De quem é a responsabilidade que você está carregando hoje além da sua própria?",
        microacao: "Dizer um 'não' gentil, mas firme, a uma tarefa secundária que não seja de sua real responsabilidade."
    }
};

// ==========================================================================
// Lógica de embeddings matemáticos e RAG no Frontend (Simulador)
// ==========================================================================

// Função geradora de embeddings normatizados de 1536 dimensões (baseado no caractere hash)
function generateMockEmbedding(phrase) {
    const text = phrase.toLowerCase().trim();
    // Gerar semente determinística baseado nas letras do texto
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const vector = [];
    for (let i = 0; i < 1536; i++) {
        // Criar componente de vetor de forma pseudo-aleatória determinística
        const val = Math.sin(hash + i) * Math.cos(hash - i * 3);
        vector.push(val);
    }
    
    // Normalização L2 (para distância cosseno/produto escalar simples ser direto)
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => parseFloat((val / magnitude).toFixed(6)));
}

// Produto Escalar simples para vetores normatizados (Equivale a Similaridade Cosseno)
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }
    return dotProduct; // Como estão normalizados, a magnitude A e B é 1.0
}

// Função auxiliar para reestruturar gramaticalmente o fato do cliente na frase
function formatFactForSentence(fact) {
    let clean = fact.trim().toLowerCase();
    if (!clean) return "";

    // Se já começar com conectores comuns, deixar como está
    if (clean.startsWith("por ") || clean.startsWith("na ") || clean.startsWith("no ") || clean.startsWith("em ") || clean.startsWith("com ")) {
        return fact;
    }

    const VERB_PARTICIPLES = {
        'bati': 'batido',
        'bater': 'batido',
        'perdi': 'perdido',
        'perder': 'perdido',
        'errei': 'errado',
        'errar': 'errado',
        'briguei': 'brigado',
        'brigar': 'brigado',
        'falei': 'falado',
        'falar': 'falado',
        'discuti': 'discutido',
        'discutir': 'discutido',
        'fiz': 'feito',
        'fazer': 'feito',
        'gastei': 'gastado',
        'gastar': 'gastado',
        'comprei': 'comprado',
        'comprar': 'comprado',
        'fui': 'ido',
        'ir': 'ido',
        'tive': 'tido',
        'ter': 'tido',
        'recebi': 'recebido',
        'receber': 'recebido',
        'senti': 'sentido',
        'sentir': 'sentido',
        'fiquei': 'ficado',
        'ficar': 'ficado',
        'gritei': 'gritado',
        'gritar': 'gritado',
        'chorei': 'chorado',
        'chorar': 'chorado',
        'quebrei': 'quebrado',
        'quebrar': 'quebrado',
        'falhei': 'falhado',
        'falhar': 'falhado',
        'minto': 'mentido',
        'menti': 'mentido',
        'mentir': 'mentido'
    };

    const words = clean.split(/\s+/);
    
    // Procurar por verbo conjugado no mapa para reformulação "por eu ter + particípio"
    let verbIndex = -1;
    let participle = "";
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (VERB_PARTICIPLES[w]) {
            verbIndex = i;
            participle = VERB_PARTICIPLES[w];
            break;
        }
    }

    if (verbIndex !== -1) {
        const wordsBefore = words.slice(0, verbIndex).join(" ");
        const wordsAfter = words.slice(verbIndex + 1).join(" ");
        let result = `por eu ter ${participle}`;
        if (wordsAfter) result += ` ${wordsAfter}`;
        if (wordsBefore) result += ` ${wordsBefore}`;
        return result;
    }

    // Caso comece com substantivos de eventos comuns
    const feminineNouns = ["briga", "discussão", "conversa", "perda", "demissão", "reunião", "viagem", "morte", "separação", "traição", "crítica", "fofoca"];
    const masculineNouns = ["conflito", "desentendimento", "erro", "acidente", "assalto", "problema", "gasto", "atraso"];

    const firstWord = words[0];
    if (feminineNouns.includes(firstWord)) {
        return `na ${fact}`;
    }
    if (masculineNouns.includes(firstWord)) {
        return `no ${fact}`;
    }

    // Fallback geral
    return `em relação a "${fact}"`;
}

// Função auxiliar para construir as frases de MSI e MFI de acordo com a seleção e sentimentos
function buildDeclarations(phrase, isHereditary, factDetail, category) {
    let parts = [];
    const cleanConcept = phrase.replace(/eu tenho/gi, '')
                            .replace(/estou com/gi, '')
                            .replace(/sinto muito/gi, '')
                            .replace(/sinto/gi, '')
                            .replace(/tenho/gi, '')
                            .replace(/medo de/gi, 'medo de ')
                            .trim();

    if (isHereditary) {
        // MSI - Movimento Sistêmico Informacional (Alma e Espírito se for genérico/comportamento)
        let msi = `Alma, comportamentos e registros hereditários de "${cleanConcept.toLowerCase()}" que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n`;
        msi += `Espírito, pensamentos hereditários de "${cleanConcept.toLowerCase()}" que recebi do primeiro dia de minha existência até a primeira infância, acabaram!`;
        parts.push(msi);
    }

    if (factDetail && factDetail.trim() !== "") {
        // MFI - Movimento Factual Informacional
        const formattedFact = formatFactForSentence(factDetail);
        const text = factDetail.toLowerCase().trim();
        const SENTIMENTS_LIST = [
            "culpa", "injustiça", "dor", "tristeza", "solidão", "rejeição", "desaprovação", 
            "carência", "raiva", "ódio", "decepção", "incompetência", "incapacidade", 
            "inferioridade", "pressão", "invasão", "usada", "manipulada", "desrespeitada", 
            "ser controlada", "não controlar", "perder o controle", "sensação de estar ou ser feia", 
            "pânico", "medo", "trocada", "frustração", "sensação de perder o sentido da vida", 
            "insegurança", "nojo", "desânimo", "não servir pra nada", "vontade de morrer", 
            "angústia", "incerteza", "sensação de não ter estabilidade", "abandonada", "submissão"
        ];

        let matchedSentiments = [];
        SENTIMENTS_LIST.forEach(s => {
            if (text.includes(s)) {
                matchedSentiments.push(s);
            }
        });

        // Heurísticas de sentimentos baseados em contexto
        if (text.includes("briga") || text.includes("discuti") || text.includes("conflito") || text.includes("discussão") || text.includes("marido") || text.includes("esposa") || text.includes("carro") || text.includes("bati")) {
            if (!matchedSentiments.includes("tristeza")) matchedSentiments.push("tristeza");
            if (!matchedSentiments.includes("raiva")) matchedSentiments.push("raiva");
            if (!matchedSentiments.includes("injustiça")) matchedSentiments.push("injustiça");
        }
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("perda")) {
            if (!matchedSentiments.includes("insegurança")) matchedSentiments.push("insegurança");
            if (!matchedSentiments.includes("pressão")) matchedSentiments.push("pressão");
            if (!matchedSentiments.includes("frustração")) matchedSentiments.push("frustração");
        }

        if (matchedSentiments.length === 0) {
            if (category === "Relacionamentos") {
                matchedSentiments = ["tristeza", "rejeição", "raiva"];
            } else if (category === "Prosperidade" || category === "Trabalho") {
                matchedSentiments = ["insegurança", "incerteza", "frustração"];
            } else {
                matchedSentiments = ["tristeza", "insegurança", "angústia"];
            }
        }

        matchedSentiments = [...new Set(matchedSentiments)];

        let mfi = "";
        matchedSentiments.forEach(s => {
            mfi += `Alma, ${s} que senti ${formattedFact} acabou!\n`;
        });
        mfi += `Alma, todos os sentimentos que senti ${formattedFact} acabaram!\n`;
        mfi += `Espírito, todas as informações negativas que recebi ${formattedFact} acabou!\n`;
        mfi += `Espírito, todas as informações negativas que gerei ${formattedFact} acabou!`;
        parts.push(mfi);
    }

    return parts.join("\n\n");
}

// Lógica de processamento e classificação de texto
class ReorganizationEngine {
    static analyzeInput(inputPhrase, isHereditary, factDetail) {
        const text = inputPhrase.toLowerCase().trim();
        if (!text) return null;

        // Gerar embedding do texto atual para o fluxo relacional
        const embedding = generateMockEmbedding(inputPhrase);

        // 1. Tentar encontrar correspondência por palavras-chave
        let matchedKey = null;
        let maxMatches = 0;

        const dbToSearch = (window.patternsDatabase && Object.keys(window.patternsDatabase).length > 0) 
            ? window.patternsDatabase 
            : INFORMATIONAL_DATABASE;

        for (const key in dbToSearch) {
            const entry = dbToSearch[key];
            let matches = 0;
            
            if (entry.keywords) {
                entry.keywords.forEach(kw => {
                    if (text.includes(kw)) {
                        matches++;
                    }
                });
            }

            if (matches > maxMatches) {
                maxMatches = matches;
                matchedKey = key;
            }
        }

        let category, categoryEmoji, title, ajuste, movimento, objetivo, pergunta, microacao, rawMRI;

        if (matchedKey && maxMatches > 0) {
            const preset = dbToSearch[matchedKey];
            category = preset.category;
            categoryEmoji = preset.categoryEmoji;
            title = preset.title;
            ajuste = preset.ajuste;
            movimento = preset.movimento;
            objetivo = preset.objetivo;
            pergunta = preset.pergunta;
            microacao = preset.microacao;
            rawMRI = preset.fortalecimento;
        } else {
            const fallback = this.generateDynamicFallback(inputPhrase);
            category = fallback.category;
            categoryEmoji = fallback.categoryEmoji;
            title = fallback.title;
            ajuste = fallback.ajuste;
            movimento = fallback.movimento;
            objetivo = fallback.objetivo;
            pergunta = fallback.pergunta;
            microacao = fallback.microacao;
            rawMRI = fallback.fortalecimento;
        }

        // Remover cabeçalhos caso venham dos presets
        let cleanMRI = rawMRI.replace(/3 - Movimento de Reinterpretação Informacional - MRI\n?/gi, "").trim();

        // Construir declarações MSI/MFI dinamicamente de acordo com as respostas do cliente
        const finalDeclaracao = buildDeclarations(inputPhrase, isHereditary, factDetail, category);

        return {
            category: category,
            categoryEmoji: categoryEmoji,
            title: title,
            ajuste: ajuste,
            movimento: movimento,
            objetivo: objetivo,
            declaracao: finalDeclaracao,
            fortalecimento: cleanMRI,
            pergunta: pergunta,
            microacao: microacao,
            embedding: embedding,
            originalPhrase: inputPhrase
        };
    }

    static generateDynamicFallback(phrase) {
        const text = phrase.toLowerCase().trim();
        let category = "Autoconhecimento";
        let categoryEmoji = "📁 Autoconhecimento";
        let title = "Processo de Reorganização";
        
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("financeiro") || text.includes("rico") || text.includes("pobre") || text.includes("prosperar") || text.includes("economia")) {
            category = "Prosperidade";
            categoryEmoji = "📁 Prosperidade";
            title = "Ajuste de Prosperidade";
        } else if (text.includes("trabalho") || text.includes("empresa") || text.includes("negócio") || text.includes("carreira") || text.includes("vender") || text.includes("chefe") || text.includes("emprego")) {
            category = "Trabalho";
            categoryEmoji = "📁 Trabalho";
            title = "Ajuste de Trabalho";
        } else if (text.includes("relacionamento") || text.includes("namorado") || text.includes("amor") || text.includes("casamento") || text.includes("traição") || text.includes("solidão") || text.includes("abandono") || text.includes("ciúme") || text.includes("marido") || text.includes("esposa")) {
            category = "Relacionamentos";
            categoryEmoji = "📁 Relacionamentos";
            title = "Ajuste de Relacionamento";
        } else if (text.includes("saúde") || text.includes("dor") || text.includes("doente") || text.includes("corpo") || text.includes("sono") || text.includes("cansado") || text.includes("energia") || text.includes("doença")) {
            category = "Saúde emocional";
            categoryEmoji = "📁 Saúde emocional";
            title = "Ajuste de Saúde Emocional";
        } else if (text.includes("medo") || text.includes("receio") || text.includes("pavor")) {
            category = "Coragem";
            categoryEmoji = "📁 Coragem";
            title = "Ajuste de Coragem";
        }

        let cleanConcept = phrase.replace(/eu tenho/gi, '')
                                .replace(/estou com/gi, '')
                                .replace(/sinto muito/gi, '')
                                .replace(/sinto/gi, '')
                                .replace(/tenho/gi, '')
                                .replace(/medo de/gi, 'medo de ')
                                .trim();

        cleanConcept = cleanConcept.charAt(0).toUpperCase() + cleanConcept.slice(1);

        // 1. Rastrear sentimentos no Fato
        const SENTIMENTS_LIST = [
            "culpa", "injustiça", "dor", "tristeza", "solidão", "rejeição", "desaprovação", 
            "carência", "raiva", "ódio", "decepção", "incompetência", "incapacidade", 
            "inferioridade", "pressão", "invasão", "usada", "manipulada", "desrespeitada", 
            "ser controlada", "não controlar", "perder o controle", "sensação de estar ou ser feia", 
            "pânico", "medo", "trocada", "frustração", "sensação de perder o sentido da via", 
            "insegurança", "nojo", "desânimo", "não servir pra nada", "vontade de morrer", 
            "angústia", "incerteza", "sensação de não ter estabilidade", "abandonada", "submissão"
        ];

        let matchedSentiments = [];
        
        // Scan standard list
        SENTIMENTS_LIST.forEach(s => {
            if (text.includes(s)) {
                matchedSentiments.push(s);
            }
        });

        // Heurísticas adicionais baseadas em palavras-chave do Fato
        if (text.includes("briga") || text.includes("discuti") || text.includes("conflito") || text.includes("discussão")) {
            if (!matchedSentiments.includes("tristeza")) matchedSentiments.push("tristeza");
            if (!matchedSentiments.includes("raiva")) matchedSentiments.push("raiva");
            if (!matchedSentiments.includes("injustiça")) matchedSentiments.push("injustiça");
        }
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("perda")) {
            if (!matchedSentiments.includes("insegurança")) matchedSentiments.push("insegurança");
            if (!matchedSentiments.includes("pressão")) matchedSentiments.push("pressão");
            if (!matchedSentiments.includes("frustração")) matchedSentiments.push("frustração");
        }
        if (text.includes("vender") || text.includes("cobrar") || text.includes("trabalho")) {
            if (!matchedSentiments.includes("incompetência")) matchedSentiments.push("incompetência");
            if (!matchedSentiments.includes("rejeição")) matchedSentiments.push("rejeição");
            if (!matchedSentiments.includes("desaprovação")) matchedSentiments.push("desaprovação");
        }
        if (text.includes("cansaço") || text.includes("exaustão") || text.includes("sobrecarga")) {
            if (!matchedSentiments.includes("pressão")) matchedSentiments.push("pressão");
            if (!matchedSentiments.includes("invasão")) matchedSentiments.push("invasão");
            if (!matchedSentiments.includes("desânimo")) matchedSentiments.push("desânimo");
        }

        // Se ainda não encontrou nada, usar um fallback por categoria
        if (matchedSentiments.length === 0) {
            if (category === "Relacionamentos") {
                matchedSentiments = ["tristeza", "rejeição", "raiva"];
            } else if (category === "Prosperidade" || category === "Trabalho") {
                matchedSentiments = ["insegurança", "incerteza", "frustração"];
            } else {
                matchedSentiments = ["tristeza", "insegurança", "angústia"];
            }
        }

        // Remover duplicados
        matchedSentiments = [...new Set(matchedSentiments)];

        // Formatar MSI
        let msiText = `1 - Movimento Sistêmico Informacional - MSI\n`;
        msiText += `Alma, comportamentos e padrões involuntários de "${cleanConcept.toLowerCase()}" que recebi do primeiro dia de minha existência até a primeira infância, acabaram!\n`;
        
        // Formatar MFI
        let mfiText = `2 - Movimento Factual Informacional - MFI\n`;
        matchedSentiments.forEach(s => {
            mfiText += `Alma, ${s} que senti na "${cleanConcept.toLowerCase()}" acabou!\n`;
        });
        mfiText += `Alma, todos os sentimentos que senti na "${cleanConcept.toLowerCase()}" acabaram!\n`;
        mfiText += `Espírito, todas as informações negativas que recebi na "${cleanConcept.toLowerCase()}" acabou!\n`;
        mfiText += `Espírito, todas as informações negativas que gerei na "${cleanConcept.toLowerCase()}" acabou!`;

        const finalDeclaracao = `${msiText}\n${mfiText}`;

        // Formatar MRI
        let mriText = `3 - Movimento de Reinterpretação Informacional - MRI\n`;
        if (category === "Prosperidade") {
            mriText += `Espírito, minha consciência escolhe, eu escolho direcionar minha atenção para possibilidades, soluções e expansão.\nAlma, eu já construo riqueza com presença, consistência e equilíbrio.`;
        } else if (category === "Relacionamentos") {
            mriText += `Espírito, minha consciência escolhe, eu escolho acolher minha autonomia afetiva e estabelecer relações saudáveis.\nAlma, eu já me sinto seguro(a), pleno(a) e vivencio conexões estáveis com maturidade.`;
        } else {
            mriText += `Espírito, minha consciência escolhe, eu escolho focar em equilíbrio interno, clareza e novas soluções.\nAlma, eu já organizo meu estado interno com consistência, presença e leveza.`;
        }

        return {
            category: category,
            categoryEmoji: categoryEmoji,
            title: title,
            ajuste: `O padrão de "${cleanConcept.toLowerCase()}" está gerando registros ativos que influenciam suas escolhas automáticas.`,
            movimento: `Acolher este registro factual conscientemente para liberar a carga emocional e atualizar seu padrão de percepção.`,
            objetivo: "Reorganização factual e atualização de padrões internos.",
            declaracao: finalDeclaracao,
            fortalecimento: mriText,
            pergunta: `O que o registro de "${cleanConcept.toLowerCase()}" está protegendo ou sinalizando na sua experiência atual?`,
            microacao: "Escrever o fato em um papel, mentalizar as frases de liberação (MSI/MFI), e depois rasgá-lo, focando na reinterpretação sugerida (MRI).",
            originalPhrase: phrase
        };
    }
}

// Gerenciamento de Estado do App
class AppStateManager {
    constructor() {
        this.currentStep = 1;
        this.currentData = null; // Guarda o resultado da reorganização atual
        this.history = this.loadHistory();
        this.timerInterval = null;
        this.isHereditary = false;
        this.factDetail = "";
        
        // Autenticação e Assinatura persistidas
        this.currentUser = this.loadUser();
        this.subscription = this.loadSubscription();
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem("innermap_history");
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn("Erro ao ler historico no localStorage:", e);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem("innermap_history", JSON.stringify(this.history));
        } catch (e) {
            console.warn("Erro ao salvar historico no localStorage:", e);
        }
    }

    loadUser() {
        try {
            const stored = localStorage.getItem("innermap_user");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn("Erro ao ler usuario no localStorage:", e);
            return null;
        }
    }

    saveUser(user) {
        this.currentUser = user;
        try {
            if (user) {
                localStorage.setItem("innermap_user", JSON.stringify(user));
            } else {
                localStorage.removeItem("innermap_user");
            }
        } catch (e) {
            console.warn("Erro ao salvar usuario no localStorage:", e);
        }
    }

    loadSubscription() {
        try {
            const stored = localStorage.getItem("innermap_subscription");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn("Erro ao ler assinatura no localStorage:", e);
            return null;
        }
    }

    async saveSubscription(sub) {
        this.subscription = sub;
        try {
            if (sub) {
                localStorage.setItem("innermap_subscription", JSON.stringify(sub));
            } else {
                localStorage.removeItem("innermap_subscription");
            }
        } catch (e) {
            console.warn("Erro ao salvar assinatura no localStorage:", e);
        }
        // Sincronizar com o banco do Supabase se o usuário estiver logado
        if (sub && supabaseClient && this.currentUser) {
            try {
                await supabaseClient.from("subscriptions").upsert({
                    user_id: this.currentUser.id || this.currentUser.email,
                    email: this.currentUser.email,
                    plan: sub.plan,
                    active: sub.active,
                    date: sub.date
                });
            } catch (err) {
                console.error("Erro ao sincronizar assinatura no Supabase:", err);
            }
        }
    }

    async loadDataFromSupabase() {
        if (!supabaseClient || !this.currentUser) return;
        
        try {
            // 0. Buscar perfil (role) no Supabase
            const { data: profData, error: profErr } = await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", this.currentUser.id)
                .maybeSingle();

            if (!profErr && profData) {
                this.currentUser.role = profData.role;
            } else {
                this.currentUser.role = "client";
            }
            this.saveUser(this.currentUser);

            // 1. Buscar Assinatura Remota
            const { data: subData, error: subErr } = await supabaseClient
                .from("subscriptions")
                .select("*")
                .eq("user_id", this.currentUser.id || this.currentUser.email)
                .maybeSingle();

            if (!subErr && subData) {
                this.subscription = {
                    plan: subData.plan,
                    active: subData.active,
                    date: subData.date
                };
                localStorage.setItem("innermap_subscription", JSON.stringify(this.subscription));
            }

            // 2. Buscar Histórico de Reorganizações Remoto
            const { data: histData, error: histErr } = await supabaseClient
                .from("reorganizations")
                .select("*")
                .eq("user_id", this.currentUser.id || this.currentUser.email)
                .order("id", { ascending: false });

            if (!histErr && histData) {
                this.history = histData.map(d => ({
                    id: d.id,
                    date: d.date,
                    phrase: d.phrase,
                    category: d.category,
                    categoryEmoji: d.categoryEmoji,
                    title: d.title,
                    rating: d.rating,
                    data: d.data
                }));
                this.saveHistory();
            }
        } catch (err) {
            console.error("Erro na carga do Supabase:", err);
        }
    }

    async addReorganization(phrase, result, rating) {
        const entry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('pt-BR'),
            phrase: phrase,
            category: result.category,
            categoryEmoji: result.categoryEmoji,
            title: result.title,
            rating: rating,
            embedding: result.embedding || generateMockEmbedding(phrase),
            data: result
        };
        this.history.unshift(entry);
        this.saveHistory();

        if (supabaseClient && this.currentUser) {
            try {
                await supabaseClient.from("reorganizations").insert({
                    id: entry.id,
                    user_id: this.currentUser.id || this.currentUser.email,
                    email: this.currentUser.email,
                    date: entry.date,
                    phrase: entry.phrase,
                    category: entry.category,
                    categoryEmoji: entry.categoryEmoji,
                    title: entry.title,
                    rating: entry.rating,
                    data: entry.data
                });
            } catch (err) {
                console.error("Erro ao salvar reorganização no Supabase:", err);
            }
        }
    }

    getStats() {
        const total = this.history.length;
        const categories = {};
        const ratings = {
            "Igual": 0,
            "Mais leve": 0,
            "Mais claro": 0,
            "Mais confiante": 0,
            "Outro": 0
        };

        this.history.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
            if (ratings[item.rating] !== undefined) {
                ratings[item.rating]++;
            } else {
                ratings["Outro"]++;
            }
        });

        return { total, categories, ratings };
    }
}

// Inicialização da UI e Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const state = new AppStateManager();
    
    const screens = {
        step1: document.getElementById("screen-step1"),
        step2: document.getElementById("screen-step2"),
        step3: document.getElementById("screen-step3"),
        step4: document.getElementById("screen-step4"),
        auth: document.getElementById("screen-auth"),
        paywall: document.getElementById("screen-paywall")
    };
    
    const inputPhrase = document.getElementById("input-phrase");
    const btnGenerate = document.getElementById("btn-generate");
    
    // Sub-screens da Tela 1 (Questionário)
    const subStep1a = document.getElementById("sub-step-1a");
    const subStep1b = document.getElementById("sub-step-1b");
    const subStep1c = document.getElementById("sub-step-1c");
    const btnSubNext1 = document.getElementById("btn-sub-next1");
    const btnFamilyYes = document.getElementById("btn-family-yes");
    const btnFamilyNo = document.getElementById("btn-family-no");
    const btnFamilyBack = document.getElementById("btn-family-back");
    const btnFactBack = document.getElementById("btn-fact-back");
    const inputFactDetail = document.getElementById("input-fact-detail");
    
    // Tela 2
    const outputAjuste = document.getElementById("output-ajuste");
    const outputMovimento = document.getElementById("output-movimento");
    const btnToStep3 = document.getElementById("btn-to-step3");
    
    // Tela 3
    const outputCategory = document.getElementById("output-category");
    const outputObjetivo = document.getElementById("output-objetivo");
    const outputDeclaracao = document.getElementById("output-declaracao");
    const outputFortalecimento = document.getElementById("output-fortalecimento");
    const outputMicroacao = document.getElementById("output-microacao");
    const btnToStep4 = document.getElementById("btn-to-step4");
    const timerProgress = document.getElementById("timer-progress");
    
    // Tela 4
    const ratingOptions = document.querySelectorAll(".rating-option");
    const inputRatingCustom = document.getElementById("rating-custom-input");
    const btnFinish = document.getElementById("btn-finish");
    
    // Biblioteca e Menu
    const libraryContainer = document.getElementById("library-container");
    const emptyLibrary = document.getElementById("empty-library");
    
    // Abas e Workspaces
    const navApp = document.getElementById("nav-app");
    const navLib = document.getElementById("nav-lib");
    const navNav = document.getElementById("nav-rag"); // matches nav-rag
    const navTherapist = document.getElementById("nav-therapist"); // matches nav-therapist
    const sectionApp = document.getElementById("app-workspace");
    const sectionLib = document.getElementById("library-workspace");
    const sectionRag = document.getElementById("rag-workspace");
    
    // Elementos do Simulador RAG
    const ragInputPhrase = document.getElementById("rag-input-phrase");
    const btnSimulateRag = document.getElementById("btn-simulate-rag");
    const ragConsoleLogs = document.getElementById("rag-console-logs");
    const ragVectorList = document.getElementById("rag-vector-list");
    
    // Stats Dashboard
    const statTotal = document.getElementById("stat-total");
    const statLighter = document.getElementById("stat-lighter");
    const statsCategoryList = document.getElementById("stats-category-list");

    // Lógica Centralizada de Tabs
    function switchTab(activeNav, activeSection) {
        [navApp, navLib, navNav, navTherapist].forEach(el => el && el.classList.remove("active"));
        [sectionApp, sectionLib, sectionRag].forEach(el => el && (el.style.display = "none"));
        
        if (activeNav) activeNav.classList.add("active");
        if (activeSection) activeSection.style.display = "block";
    }

    if (navApp) {
        navApp.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(navApp, sectionApp);
            if (!state.currentUser) {
                showScreen("auth");
            } else if (!state.subscription) {
                showScreen("paywall");
            } else if (state.currentStep === 0) {
                showScreen("step1");
            }
        });
    }

    if (navTherapist) {
        navTherapist.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser || state.currentUser.role !== "therapist") {
                showToast("Acesso restrito a terapeutas.");
                return;
            }
            switchTab(navTherapist, sectionApp);
            showScreen("therapist");
            loadTherapistDashboardData();
        });
    }

    if (navLib) {
        navLib.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser) {
                showToast("Acesse sua conta para ver suas Reorganizações.");
                switchTab(navApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription) {
                showToast("Assine um plano para ver suas Reorganizações.");
                switchTab(navApp, sectionApp);
                showScreen("paywall");
                return;
            }
            switchTab(navLib, sectionLib);
            renderLibrary();
            renderStats();
        });
    }

    if (navNav) {
        navNav.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser) {
                showToast("Acesse sua conta para rodar o simulador RAG.");
                switchTab(navApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription) {
                showToast("Assine um plano para rodar o simulador RAG.");
                switchTab(navApp, sectionApp);
                showScreen("paywall");
                return;
            }
            switchTab(navNav, sectionRag);
            renderVectorList();
        });
    }

    // Lógica de Navegação e Transição dos Sub-Passos da Tela 1
    function switchSubStep(hideEl, showEl) {
        hideEl.classList.remove("active");
        setTimeout(() => {
            hideEl.style.display = "none";
            showEl.style.display = "block";
            setTimeout(() => {
                showEl.classList.add("active");
            }, 50);
        }, 150);
    }

    btnSubNext1.addEventListener("click", () => {
        const val = inputPhrase.value.trim();
        if (!val) {
            alert("Por favor, digite seu objetivo ou padrão limitante.");
            return;
        }
        switchSubStep(subStep1a, subStep1b);
    });

    btnFamilyYes.addEventListener("click", () => {
        state.isHereditary = true;
        btnFamilyYes.classList.add("active");
        btnFamilyNo.classList.remove("active");
        setTimeout(() => {
            switchSubStep(subStep1b, subStep1c);
        }, 300);
    });

    btnFamilyNo.addEventListener("click", () => {
        state.isHereditary = false;
        btnFamilyNo.classList.add("active");
        btnFamilyYes.classList.remove("active");
        setTimeout(() => {
            switchSubStep(subStep1b, subStep1c);
        }, 300);
    });

    btnFamilyBack.addEventListener("click", () => {
        switchSubStep(subStep1b, subStep1a);
    });

    btnFactBack.addEventListener("click", () => {
        switchSubStep(subStep1c, subStep1b);
    });

    function resetStep1Wizard() {
        state.isHereditary = false;
        state.factDetail = "";
        
        btnFamilyYes.classList.remove("active");
        btnFamilyNo.classList.remove("active");
        
        inputPhrase.value = "";
        inputFactDetail.value = "";
        
        subStep1a.style.display = "block";
        subStep1a.classList.add("active");
        subStep1b.style.display = "none";
        subStep1b.classList.remove("active");
        subStep1c.style.display = "none";
        subStep1c.classList.remove("active");
    }

    // Tela 1 -> Tela 2: Gerar Ajustes Informacionais
    btnGenerate.addEventListener("click", () => {
        const phrase = inputPhrase.value.trim();
        if (!phrase) {
            alert("Por favor, digite seu objetivo ou padrão limitante.");
            return;
        }

        state.factDetail = inputFactDetail.value.trim();

        btnGenerate.disabled = true;
        btnGenerate.innerHTML = '<span class="spinner"></span> Analisando padrões...';
        
        setTimeout(() => {
            const result = ReorganizationEngine.analyzeInput(phrase, state.isHereditary, state.factDetail);
            state.currentData = result;
            
            // Popula Tela 2 (Consciência)
            outputAjuste.innerText = result.ajuste;
            outputMovimento.innerText = result.movimento;
            
            // Popula Tela 3 (Práticas Guiadas)
            outputCategory.innerHTML = `<span class="category-pill">${result.categoryEmoji}</span>`;
            outputObjetivo.innerText = result.objetivo;
            
            // Habilita/Desabilita o card de Liberação dinamicamente dependendo da presença de MSI/MFI
            if (!result.declaracao || result.declaracao.trim() === "") {
                outputDeclaracao.closest(".hqi-item").style.display = "none";
            } else {
                outputDeclaracao.closest(".hqi-item").style.display = "block";
                outputDeclaracao.innerText = result.declaracao;
            }

            outputFortalecimento.innerText = result.fortalecimento;
            outputMicroacao.innerText = result.microacao;
            
            showScreen("step3");
            startPracticeTimer();
            
            btnGenerate.disabled = false;
            btnGenerate.innerText = "Gerar Ajustes Informacionais →";
        }, 1200);
    });

    // Tela 2 (Consciência) -> Tela 4: Ir para Registro & Acompanhamento
    btnToStep3.addEventListener("click", () => {
        showScreen("step4");
    });

    // Lógica do Timer de Prática (Tela 3)
    function startPracticeTimer() {
        btnToStep4.disabled = true;
        btnToStep4.innerText = "Realize a prática com atenção... (10s)";
        let timeLeft = 10;
        timerProgress.style.width = "100%";
        
        if (state.timerInterval) clearInterval(state.timerInterval);
        
        state.timerInterval = setInterval(() => {
            timeLeft--;
            const percentage = (timeLeft / 10) * 100;
            timerProgress.style.width = `${percentage}%`;
            
            if (timeLeft <= 0) {
                clearInterval(state.timerInterval);
                btnToStep4.disabled = false;
                btnToStep4.innerText = "Concluir Prática e Ver Leitura Informacional →";
                btnToStep4.classList.add("pulse-glow");
            } else {
                btnToStep4.innerText = `Realize a prática com atenção... (${timeLeft}s)`;
            }
        }, 1000);
    }

    // Tela 3 (Práticas Guiadas) -> Tela 2: Ir para Consciência
    btnToStep4.addEventListener("click", () => {
        if (state.timerInterval) clearInterval(state.timerInterval);
        showScreen("step2");
    });

    // Seleção de sentimentos na Tela 4
    let selectedRating = "Mais leve"; // default
    ratingOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            ratingOptions.forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            selectedRating = opt.dataset.value;
            
            if (selectedRating === "Outro") {
                inputRatingCustom.style.display = "block";
                inputRatingCustom.focus();
            } else {
                inputRatingCustom.style.display = "none";
            }
        });
    });

    // Tela 4 -> Finalizar e Salvar
    btnFinish.addEventListener("click", () => {
        let ratingValue = selectedRating;
        if (selectedRating === "Outro") {
            const customVal = inputRatingCustom.value.trim();
            ratingValue = customVal ? customVal : "Outro";
        }

        state.addReorganization(inputPhrase.value.trim(), state.currentData, ratingValue);
        
        ratingOptions.forEach(o => o.classList.remove("selected"));
        document.querySelector('[data-value="Mais leve"]').classList.add("selected");
        selectedRating = "Mais leve";
        inputRatingCustom.style.display = "none";
        inputRatingCustom.value = "";
        
        resetStep1Wizard();
        showScreen("step1");
        showToast("Processo salvo na sua biblioteca!");
    });

    // Helper: Mostrar tela específica com interceptações de autenticação e paywall
    function showScreen(screenId) {
        Object.keys(screens).forEach(key => {
            if (screens[key]) {
                screens[key].classList.remove("active");
            }
        });
        
        // Interceptação de segurança e faturamento
        if (!state.currentUser) {
            if (screens["auth"]) screens["auth"].classList.add("active");
            state.currentStep = 0;
            updateUserUI();
            return;
        }
        
        if (!state.subscription && screenId !== "auth" && screenId !== "paywall") {
            if (screens["paywall"]) screens["paywall"].classList.add("active");
            state.currentStep = 0;
            updateUserUI();
            return;
        }

        if (screens[screenId]) {
            screens[screenId].classList.add("active");
            if (screenId.startsWith("step")) {
                state.currentStep = parseInt(screenId.replace("step", ""));
            } else {
                state.currentStep = 0;
            }
        }
        updateUserUI();
    }

    // ==========================================================================
    // Lógica de Autenticação e Assinaturas (Simulador SaaS)
    // ==========================================================================
    const userNavContainer = document.getElementById("user-nav-container");
    const userEmailDisplay = document.getElementById("user-email-display");
    const userStatusDisplay = document.getElementById("user-status-display");
    const btnLogout = document.getElementById("btn-logout");

    function updateUserUI() {
        if (!userNavContainer) return;
        if (state.currentUser) {
            userNavContainer.style.display = "flex";
            if (userEmailDisplay) userEmailDisplay.innerText = state.currentUser.email;
            
            // Controle de visibilidade do link de administrador
            if (navTherapist) {
                if (state.currentUser.role === "therapist") {
                    navTherapist.style.display = "inline-block";
                } else {
                    navTherapist.style.display = "none";
                }
            }

            if (userStatusDisplay) {
                if (state.subscription) {
                    if (state.subscription.plan === "trial") {
                        // Calcular dias restantes
                        const activationDate = new Date(state.subscription.date);
                        const currentDate = new Date();
                        let diffTime = currentDate - activationDate;
                        if (isNaN(diffTime)) {
                            const parts = state.subscription.date.split('/');
                            if (parts.length === 3) {
                                const parsedDate = new Date(parts[2], parts[1]-1, parts[0]);
                                diffTime = currentDate - parsedDate;
                            }
                        }
                        const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        const daysRemaining = Math.max(0, 15 - daysElapsed);
                        
                        userStatusDisplay.innerText = `Teste: ${daysRemaining}d rest.`;
                        userStatusDisplay.style.background = "rgba(251, 188, 5, 0.15)";
                        userStatusDisplay.style.color = "#FBBC05";
                        userStatusDisplay.style.borderColor = "#FBBC05";
                    } else {
                        userStatusDisplay.innerText = state.subscription.plan === "yearly" ? "Premium Anual" : "Premium Mensal";
                        userStatusDisplay.style.background = "rgba(102, 252, 241, 0.15)";
                        userStatusDisplay.style.color = "var(--color-primary)";
                        userStatusDisplay.style.borderColor = "var(--color-primary)";
                    }
                } else {
                    userStatusDisplay.innerText = "Pendente";
                    userStatusDisplay.style.background = "rgba(234, 67, 53, 0.15)";
                    userStatusDisplay.style.color = "#EA4335";
                    userStatusDisplay.style.borderColor = "#EA4335";
                }
            }
        } else {
            userNavContainer.style.display = "none";
            if (navTherapist) navTherapist.style.display = "none";
        }
    }

    // Elementos do Auth
    const authTabLogin = document.getElementById("auth-tab-login");
    const authTabRegister = document.getElementById("auth-tab-register");
    const authForm = document.getElementById("auth-form");
    const authEmailInput = document.getElementById("auth-email");
    const authPasswordInput = document.getElementById("auth-password");
    const btnAuthSubmit = document.getElementById("btn-auth-submit");
    const btnAuthGoogle = document.getElementById("btn-auth-google");

    let authMode = "login";

    if (authTabLogin) {
        authTabLogin.addEventListener("click", () => {
            authMode = "login";
            authTabLogin.classList.add("active");
            if (authTabRegister) authTabRegister.classList.remove("active");
            if (btnAuthSubmit) btnAuthSubmit.innerText = "Acessar Conta";
        });
    }

    if (authTabRegister) {
        authTabRegister.addEventListener("click", () => {
            authMode = "register";
            authTabRegister.classList.add("active");
            if (authTabLogin) authTabLogin.classList.remove("active");
            if (btnAuthSubmit) btnAuthSubmit.innerText = "Criar Conta";
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = authEmailInput.value.trim();
            const pwd = authPasswordInput.value.trim();
            
            if (!email || !pwd) return;
            
            if (btnAuthSubmit) {
                btnAuthSubmit.disabled = true;
                btnAuthSubmit.innerHTML = `<span class="spinner"></span> ${authMode === 'login' ? 'Entrando' : 'Cadastrando'}...`;
            }

            if (supabaseClient) {
                try {
                    if (authMode === "register") {
                        const { data, error } = await supabaseClient.auth.signUp({
                            email: email,
                            password: pwd
                        });
                        
                        if (error) throw error;
                        
                        // Salvar usuário
                        state.saveUser({
                            email: email,
                            provider: "email",
                            id: data.user.id
                        });
                        
                        showToast("Cadastro realizado com sucesso! Verifique seu e-mail.");
                        showScreen("paywall");
                    } else {
                        const { data, error } = await supabaseClient.auth.signInWithPassword({
                            email: email,
                            password: pwd
                        });
                        
                        if (error) throw error;
                        
                        state.saveUser({
                            email: data.user.email,
                            provider: "email",
                            id: data.user.id
                        });
                        
                        await state.loadDataFromSupabase();
                        
                        showToast("Logado com sucesso!");
                        showScreen(state.subscription ? "step1" : "paywall");
                    }
                } catch (err) {
                    alert("Erro na autenticação: " + err.message);
                } finally {
                    if (btnAuthSubmit) {
                        btnAuthSubmit.disabled = false;
                        btnAuthSubmit.innerText = authMode === 'login' ? 'Acessar Conta' : 'Criar Conta';
                    }
                    authEmailInput.value = "";
                    authPasswordInput.value = "";
                    updateUserUI();
                }
            } else {
                // Simulação local
                setTimeout(() => {
                    state.saveUser({
                        email: email,
                        provider: "email"
                    });
                    
                    if (authMode === "login") {
                        state.saveSubscription({
                            plan: "yearly",
                            active: true,
                            date: new Date().toLocaleDateString('pt-BR')
                        });
                    }
                    
                    if (btnAuthSubmit) {
                        btnAuthSubmit.disabled = false;
                        btnAuthSubmit.innerText = authMode === 'login' ? 'Acessar Conta' : 'Criar Conta';
                    }
                    
                    authEmailInput.value = "";
                    authPasswordInput.value = "";
                    
                    updateUserUI();
                    
                    if (state.subscription) {
                        showScreen("step1");
                        showToast("Logado com sucesso! (Simulador)");
                    } else {
                        showScreen("paywall");
                        showToast("Conta criada! Selecione o seu plano de acesso. (Simulador)");
                    }
                }, 1200);
            }
        });
    }

    if (btnAuthGoogle) {
        btnAuthGoogle.addEventListener("click", async () => {
            btnAuthGoogle.disabled = true;
            btnAuthGoogle.innerHTML = '<span class="spinner"></span> Conectando com o Google...';

            if (supabaseClient) {
                try {
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin + window.location.pathname
                        }
                    });
                    if (error) throw error;
                } catch (err) {
                    alert("Erro ao conectar com o Google: " + err.message);
                    btnAuthGoogle.disabled = false;
                    btnAuthGoogle.innerHTML = `
                        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg> Entrar com o Google
                    `;
                }
            } else {
                // Simulação local
                setTimeout(() => {
                    state.saveUser({
                        email: "visitante.google@gmail.com",
                        provider: "google"
                    });
                    
                    btnAuthGoogle.disabled = false;
                    btnAuthGoogle.innerHTML = `
                        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg> Entrar com o Google
                    `;

                    updateUserUI();
                    
                    if (state.subscription) {
                        showScreen("step1");
                        showToast("Conectado com o Google! (Simulador)");
                    } else {
                        showScreen("paywall");
                        showToast("Google conectado! Selecione o seu plano de acesso. (Simulador)");
                    }
                }, 1200);
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", async (e) => {
            e.preventDefault();
            if (supabaseClient) {
                try {
                    await supabaseClient.auth.signOut();
                } catch (err) {
                    console.error("Erro ao sair do Supabase:", err);
                }
            }
            state.saveUser(null);
            state.saveSubscription(null);
            
            updateUserUI();
            showScreen("auth");
            showToast("Você saiu da sua conta.");
        });
    }

    // Elementos do Checkout
    const checkoutModal = document.getElementById("checkout-modal");
    const btnCloseCheckout = document.getElementById("btn-close-checkout");
    const checkoutPlanName = document.getElementById("checkout-plan-name");
    const checkoutTabPix = document.getElementById("checkout-tab-pix");
    const checkoutTabCard = document.getElementById("checkout-tab-card");
    const checkoutContentPix = document.getElementById("checkout-content-pix");
    const checkoutContentCard = document.getElementById("checkout-content-card");
    const btnConfirmPayment = document.getElementById("btn-confirm-payment");
    const btnCopyPix = document.getElementById("btn-copy-pix");

    let activeSelectedPlan = "yearly";

    async function startCheckout(plan) {
        activeSelectedPlan = plan;
        
        // Prioridade máxima: se links estáticos estão configurados, redirecionar na hora (evita CORS e delay)
        const staticLink = plan === "yearly" ? INFINITEPAY_LINK_YEARLY : INFINITEPAY_LINK_MONTHLY;
        if (staticLink) {
            window.location.href = staticLink;
            return;
        }

        const price = plan === "yearly" ? 47880 : 4990;
        const description = plan === "yearly" ? "InnerMap - Plano Anual" : "InnerMap - Plano Mensal";
        
        if (INFINITEPAY_TAG) {
            const btn = document.querySelector(`.btn-select-plan[data-plan="${plan}"]`);
            const originalText = btn ? btn.innerText : "";
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `<span class="spinner"></span> Redirecionando...`;
            }
            
            try {
                const response = await fetch("https://api.checkout.infinitepay.io/links", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        handle: INFINITEPAY_TAG,
                        redirect_url: `${window.location.origin}${window.location.pathname}?payment=success&plan=${plan}`,
                        items: [
                            {
                                description: description,
                                price: price,
                                quantity: 1
                            }
                        ]
                    })
                });
                
                if (!response.ok) throw new Error("Erro na API da InfinitePay");
                
                const data = await response.json();
                if (data.url) {
                    try {
                        localStorage.setItem("pending_payment_plan", plan);
                        if (data.slug) {
                            localStorage.setItem("pending_payment_slug", data.slug);
                        } else if (data.id) {
                            localStorage.setItem("pending_payment_slug", data.id);
                        }
                    } catch (e) {
                        console.warn("Erro ao salvar dados de pagamento pendente:", e);
                    }
                    window.location.href = data.url;
                    return;
                }
            } catch (err) {
                console.warn("Falha ao gerar link dinâmico da InfinitePay, tentando link estático ou simulação:", err);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                }
            }
        }
        
        // Se nenhuma configuração da InfinitePay estiver ativa, usa a simulação local anterior
        if (checkoutPlanName) {
            checkoutPlanName.innerText = plan === "yearly" ? "Anual (R$ 39,90/mês)" : "Mensal (R$ 49,90/mês)";
        }
        if (checkoutModal) checkoutModal.style.display = "flex";
    }

    document.querySelectorAll(".btn-select-plan").forEach(btn => {
        btn.addEventListener("click", () => {
            startCheckout(btn.dataset.plan);
        });
    });

    // Código de convite / Reivindicar Assinatura Gratuita
    const btnClaimInvite = document.getElementById("btn-claim-invite");
    const inputInviteCode = document.getElementById("input-invite-code");

    if (btnClaimInvite && inputInviteCode) {
        btnClaimInvite.addEventListener("click", () => {
            const rawCode = inputInviteCode.value.trim();
            // Remover acentos e comparar de forma insensível a maiúsculas/minúsculas e sem hashtag
            const codeNormalized = rawCode.toLowerCase().replace(/#/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (codeNormalized === "euescolhoasminhasrealidades") {
                btnClaimInvite.disabled = true;
                btnClaimInvite.innerHTML = `<span class="spinner"></span> Validando...`;
                
                state.saveSubscription({
                    plan: "trial",
                    active: true,
                    date: new Date().toISOString()
                }).then(() => {
                    inputInviteCode.value = "";
                    updateUserUI();
                    showToast("Código de convite ativado! Seus 15 dias de teste começaram agora. 🎉");
                    showScreen("step1");
                }).catch(err => {
                    console.error(err);
                    showToast("Erro ao processar ativação do convite.");
                }).finally(() => {
                    btnClaimInvite.disabled = false;
                    btnClaimInvite.innerText = "Reivindicar";
                });
            } else {
                showToast("Código de convite inválido ou expirado.");
            }
        });
    }

    if (btnCloseCheckout) {
        btnCloseCheckout.addEventListener("click", () => {
            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    if (checkoutTabPix) {
        checkoutTabPix.addEventListener("click", () => {
            checkoutTabPix.style.borderBottom = "2px solid var(--color-primary)";
            checkoutTabPix.style.color = "var(--color-text-main)";
            
            if (checkoutTabCard) {
                checkoutTabCard.style.borderBottom = "none";
                checkoutTabCard.style.color = "var(--color-text-muted)";
            }
            
            if (checkoutContentPix) checkoutContentPix.style.display = "block";
            if (checkoutContentCard) checkoutContentCard.style.display = "none";
        });
    }

    if (checkoutTabCard) {
        checkoutTabCard.addEventListener("click", () => {
            checkoutTabCard.style.borderBottom = "2px solid var(--color-primary)";
            checkoutTabCard.style.color = "var(--color-text-main)";
            
            if (checkoutTabPix) {
                checkoutTabPix.style.borderBottom = "none";
                checkoutTabPix.style.color = "var(--color-text-muted)";
            }
            
            if (checkoutContentCard) checkoutContentCard.style.display = "block";
            if (checkoutContentPix) checkoutContentPix.style.display = "none";
        });
    }

    if (btnCopyPix) {
        btnCopyPix.addEventListener("click", () => {
            const pixInput = document.getElementById("pix-key-value");
            if (pixInput) {
                pixInput.select();
                document.execCommand("copy");
                showToast("Código Copia e Cola copiado!");
            }
        });
    }

    if (btnConfirmPayment) {
        btnConfirmPayment.addEventListener("click", () => {
            btnConfirmPayment.disabled = true;
            btnConfirmPayment.innerHTML = '<span class="spinner"></span> Confirmando...';
            
            setTimeout(() => {
                state.saveSubscription({
                    plan: activeSelectedPlan,
                    active: true,
                    date: new Date().toLocaleDateString('pt-BR')
                });
                
                if (checkoutModal) checkoutModal.style.display = "none";
                btnConfirmPayment.disabled = false;
                btnConfirmPayment.innerText = "Simular Confirmação de Pagamento";
                
                updateUserUI();
                showScreen("step1");
                showToast("Assinatura confirmada! Acesso Premium liberado.");
            }, 1500);
        });
    }

    // Helper: Renderizar Biblioteca (Histórico)
    function renderLibrary() {
        libraryContainer.innerHTML = "";
        const history = state.history;

        if (history.length === 0) {
            emptyLibrary.style.display = "block";
            return;
        }

        emptyLibrary.style.display = "none";

        const grouped = {};
        history.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });

        for (const cat in grouped) {
            const catEmoji = grouped[cat][0].categoryEmoji;
            
            const catSection = document.createElement("div");
            catSection.className = "library-category-group";
            
            catSection.innerHTML = `
                <h3 class="library-category-title">
                    <span>${catEmoji}</span>
                    <span class="count-badge">${grouped[cat].length}</span>
                </h3>
                <div class="library-items-list"></div>
            `;
            
            const listContainer = catSection.querySelector(".library-items-list");
            
            grouped[cat].forEach(item => {
                const card = document.createElement("div");
                card.className = "library-item-card";
                card.innerHTML = `
                    <div class="card-header">
                        <span class="card-date">${item.date}</span>
                        <span class="card-status-pill">${item.rating}</span>
                    </div>
                    <p class="card-phrase">"<strong>${item.phrase}</strong>"</p>
                    <div class="card-details" style="display: none;">
                        <div class="card-divider"></div>
                        <div class="detail-section">
                            <strong>Ajuste Observado:</strong>
                            <p>${item.data.ajuste}</p>
                        </div>
                        <div class="detail-section">
                            <strong>Prática Realizada:</strong>
                            <p class="hqi-box">${item.data.declaracao}</p>
                        </div>
                        <div class="detail-section">
                            <strong>Ação de Integração:</strong>
                            <p class="action-box">🎯 ${item.data.microacao}</p>
                        </div>
                    </div>
                    <button class="btn-toggle-details">Ver detalhes ↓</button>
                `;
                
                const btnToggle = card.querySelector(".btn-toggle-details");
                const details = card.querySelector(".card-details");
                
                btnToggle.addEventListener("click", () => {
                    const isVisible = details.style.display === "block";
                    details.style.display = isVisible ? "none" : "block";
                    btnToggle.innerText = isVisible ? "Ver detalhes ↓" : "Ocultar detalhes ↑";
                });
                
                listContainer.appendChild(card);
            });
            
            libraryContainer.appendChild(catSection);
        }
    }

    // Helper: Renderizar Dashboard de Stats
    function renderStats() {
        const stats = state.getStats();
        statTotal.innerText = stats.total;
        
        const positiveCount = (stats.ratings["Mais leve"] || 0) + 
                              (stats.ratings["Mais claro"] || 0) + 
                              (stats.ratings["Mais confiante"] || 0);
        
        const positivePercent = stats.total > 0 ? Math.round((positiveCount / stats.total) * 100) : 0;
        statLighter.innerText = `${positivePercent}%`;

        statsCategoryList.innerHTML = "";
        if (stats.total === 0) {
            statsCategoryList.innerHTML = `<li class="empty-stats">Nenhum registro criado ainda.</li>`;
            return;
        }

        for (const cat in stats.categories) {
            const count = stats.categories[cat];
            const pct = Math.round((count / stats.total) * 100);
            
            const li = document.createElement("li");
            li.className = "stat-category-item";
            li.innerHTML = `
                <div class="stat-cat-info">
                    <span class="stat-cat-name">${cat}</span>
                    <span class="stat-cat-count">${count} (${pct}%)</span>
                </div>
                <div class="stat-progress-bar">
                    <div class="stat-progress-fill" style="width: ${pct}%"></div>
                </div>
            `;
            statsCategoryList.appendChild(li);
        }
    }

    // ==========================================================================
    // Lógica do Simulador RAG e Banco de Dados no Console
    // ==========================================================================

    function renderVectorList() {
        if (!ragVectorList) return;
        ragVectorList.innerHTML = "";
        const history = state.history;

        if (history.length === 0) {
            ragVectorList.innerHTML = `<li class="empty-stats">Nenhum vetor salvo ainda. Crie reorganizações na aba Início.</li>`;
            return;
        }

        history.forEach(item => {
            const li = document.createElement("li");
            li.style.background = "rgba(255, 255, 255, 0.02)";
            li.style.border = "1px solid var(--color-border)";
            li.style.borderRadius = "8px";
            li.style.padding = "0.75rem";
            
            // Gerar embedding caso o item antigo não possua
            if (!item.embedding) {
                item.embedding = generateMockEmbedding(item.phrase);
            }
            
            const firstValues = item.embedding.slice(0, 4).join(", ");

            li.innerHTML = `
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.25rem;">
                    "${item.phrase.substring(0, 35)}..."
                </div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: monospace; word-break: break-all; background: rgba(0,0,0,0.2); padding: 0.35rem; border-radius: 4px;">
                    vector(1536): [${firstValues}, ...]
                </div>
            `;
            ragVectorList.appendChild(li);
        });
    }

    if (btnSimulateRag) {
        btnSimulateRag.addEventListener("click", () => {
            const query = ragInputPhrase ? ragInputPhrase.value.trim() : "";
            if (!query) {
                alert("Por favor, digite uma frase para simular o RAG.");
                return;
            }

            btnSimulateRag.disabled = true;
            btnSimulateRag.innerHTML = '<span class="spinner"></span> Executando RAG...';
            if (ragConsoleLogs) {
                ragConsoleLogs.innerHTML = `<p class="console-log-line color-cyan">// Inicializando pipeline RAG para: "${query}"...</p>`;
            }

            setTimeout(() => {
                // Passo 1: Geração de Embedding
                const queryEmbedding = generateMockEmbedding(query);
                const firstValues = queryEmbedding.slice(0, 4).join(", ");
                
                appendConsoleLog(`[PASSO 1] Gerando Vector Embedding via OpenAI API (text-embedding-3-small)...`);
                appendConsoleLog(`Vector gerado com sucesso! Dimensão: 1536.`, "color-green");
                appendConsoleLog(`Vetor do usuário: [${firstValues}, ...]`, "color-grey");

                setTimeout(() => {
                    // Passo 2: Busca Vetorial Cosseno no pgvector
                    appendConsoleLog(`[PASSO 2] Consultando banco de dados PostgreSQL usando operador de distância cosseno (<=>) no pgvector...`);
                    
                    const history = state.history;
                    const matches = [];

                    history.forEach(item => {
                        if (!item.embedding) {
                            item.embedding = generateMockEmbedding(item.phrase);
                        }
                        const similarity = cosineSimilarity(queryEmbedding, item.embedding);
                        matches.push({
                            phrase: item.phrase,
                            rating: item.rating,
                            category: item.category,
                            similarity: similarity
                        });
                    });

                    // Ordenar por similaridade decrescente
                    matches.sort((a, b) => b.similarity - a.similarity);

                    // Filtrar por limite semântico (threshold de 0.60 para simulação)
                    const threshold = 0.60;
                    const relevantMatches = matches.filter(m => m.similarity >= threshold).slice(0, 2);

                    if (matches.length === 0) {
                        appendConsoleLog(`Varredura completa. Tabela journal_entries está vazia. Nenhum contexto histórico recuperado.`, "color-yellow");
                    } else {
                        appendConsoleLog(`Similaridades calculadas com sucesso no banco de dados:`);
                        matches.slice(0, 3).forEach(m => {
                            const isSelected = m.similarity >= threshold ? "SELECIONADO (>= 0.60)" : "IGNORADO (< 0.60)";
                            const color = m.similarity >= threshold ? "color-green" : "color-grey";
                            appendConsoleLog(`  - "${m.phrase.substring(0, 30)}..." | Similaridade Cosseno: ${m.similarity.toFixed(4)} | Status: ${isSelected}`, color);
                        });
                    }

                    setTimeout(() => {
                        // Passo 3: Injeção de Contexto & Montagem do Prompt
                        appendConsoleLog(`[PASSO 3] Sintetizando prompt contextualizado com Memória Inteligente para o LLM...`);
                        
                        let contextBlock = "";
                        if (relevantMatches.length > 0) {
                            contextBlock = `--- MEMÓRIA INTELIGENTE (Histórico relevante recuperado) ---\n`;
                            relevantMatches.forEach((m, idx) => {
                                contextBlock += `- Registro antigo ${idx+1}: '${m.phrase}' | Feedback emocional pós-prática: ${m.rating}\n`;
                            });
                            contextBlock += `---------------------------------------------------------\n`;
                        } else {
                            contextBlock = `(Nenhum histórico semanticamente relevante foi injetado para economizar tokens)\n`;
                        }

                        const promptPreview = `
[SYSTEM PROMPT]
Você é o InnerMap, assistente especializado em reorganizar padrões internos...

[RETRIEVED CONTEXT]
${contextBlock}
[USER QUERY]
Pergunta atual: "${query}"
`;
                        appendConsoleLog(`Prompt construído com sucesso:`);
                        const pre = document.createElement("pre");
                        pre.className = "console-code-block";
                        pre.innerText = promptPreview;
                        if (ragConsoleLogs) ragConsoleLogs.appendChild(pre);

                        setTimeout(() => {
                            // Passo 4: Retorno LLM
                            appendConsoleLog(`[PASSO 4] Enviando prompt para a API do LLM (${rag_pipeline_chat_model()})...`);
                            
                            const result = ReorganizationEngine.analyzeInput(query);
                            
                            appendConsoleLog(`Resposta gerada pela IA com sucesso!`, "color-green");
                            
                            const responseBlock = document.createElement("div");
                            responseBlock.style.background = "rgba(102, 252, 241, 0.04)";
                            responseBlock.style.border = "1px solid var(--color-primary-glow)";
                            responseBlock.style.borderRadius = "8px";
                            responseBlock.style.padding = "1rem";
                            responseBlock.style.marginTop = "0.75rem";
                            responseBlock.innerHTML = `
                                <strong>Ajuste:</strong> ${result.ajuste}<br><br>
                                <strong>Liberação:</strong> <span style="font-family: monospace;">${result.declaracao}</span>
                            `;
                            if (ragConsoleLogs) ragConsoleLogs.appendChild(responseBlock);
                            
                            appendConsoleLog(`[COMPLETO] Registro atualizado salvo com sucesso na tabela journal_entries do PostgreSQL.`, "color-green");
                            
                            btnSimulateRag.disabled = false;
                            btnSimulateRag.innerHTML = 'Simular Fluxo RAG →';
                            renderVectorList();
                        }, 1500);
                    }, 1500);
                }, 1200);
            }, 1000);
        });
    }

    function appendConsoleLog(message, className = "") {
        const p = document.createElement("p");
        p.className = `console-log-line ${className}`;
        p.innerText = `> ${message}`;
        ragConsoleLogs.appendChild(p);
        // Auto scroll to bottom
        ragConsoleLogs.scrollTop = ragConsoleLogs.scrollHeight;
    }

    function rag_pipeline_chat_model() {
        return "gpt-4o-mini";
    }

    // Toast Notification System
    function showToast(message) {
        let toast = document.querySelector(".toast-message");
        if (toast) toast.remove();

        toast = document.createElement("div");
        toast.className = "toast-message";
        toast.innerText = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add("show"), 10);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Verificar o status e a data de validade da assinatura de teste (trial de 15 dias)
    function checkSubscriptionStatus() {
        if (state.subscription && state.subscription.plan === "trial") {
            const activationDate = new Date(state.subscription.date);
            const currentDate = new Date();
            
            let diffTime = currentDate - activationDate;
            if (isNaN(diffTime)) {
                // Tenta tratar formato local dd/mm/aaaa se houver no histórico antigo
                const parts = state.subscription.date.split('/');
                if (parts.length === 3) {
                    const parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                    diffTime = currentDate - parsedDate;
                }
            }
            
            const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const daysRemaining = 15 - daysElapsed;
            
            if (daysRemaining <= 0) {
                alert("Seu período de teste de 15 dias acabou! Por favor, assine um plano para continuar.");
                state.saveSubscription(null);
                state.saveUser(null);
                if (supabaseClient) {
                    supabaseClient.auth.signOut();
                }
                updateUserUI();
                showScreen("auth");
                return false;
            } else if ([10, 5, 3, 1].includes(daysRemaining)) {
                showToast(`Atenção: Restam ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'} do seu período de teste! Assine o plano Mensal ou Anual para continuar.`);
            }
        }
        return true;
    }

    // Inicialização da Tela no Load
    if (supabaseClient) {
        // Carregar a base de padrões do Supabase e semear se necessário
        loadPatternsFromSupabase().then(() => {
            seedPatternsDatabaseIfEmpty();
        });

        // 1. Obter sessão inicial de forma imediata (Promise)
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                state.saveUser({
                    email: session.user.email,
                    provider: session.user.app_metadata.provider || "email",
                    id: session.user.id
                });
                state.loadDataFromSupabase().then(() => {
                    updateUserUI();
                    renderLibrary();
                    renderStats();
                    
                    if (checkSubscriptionStatus()) {
                        // Redirecionar dependendo da assinatura sincronizada
                        if (state.subscription) {
                            showScreen("step1");
                        } else {
                            showScreen("paywall");
                        }
                    }
                });
            } else {
                state.saveUser(null);
                state.saveSubscription(null);
                state.history = [];
                updateUserUI();
                renderLibrary();
                renderStats();
                showScreen("auth");
            }
        }).catch(err => {
            console.error("Erro ao obter sessão inicial:", err);
            showScreen("auth");
        });

        // 2. Ouvir mudanças futuras de autenticação (como login, logout, OAuth)
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session) {
                state.saveUser({
                    email: session.user.email,
                    provider: session.user.app_metadata.provider || "email",
                    id: session.user.id
                });
                await state.loadDataFromSupabase();
                updateUserUI();
                renderLibrary();
                renderStats();
                if (checkSubscriptionStatus()) {
                    showScreen(state.subscription ? "step1" : "paywall");
                }
            } else if (event === "SIGNED_OUT") {
                state.saveUser(null);
                state.saveSubscription(null);
                state.history = [];
                updateUserUI();
                renderLibrary();
                renderStats();
                showScreen("auth");
            }
        });
    } else {
        // Fallback local se Supabase não configurado
        updateUserUI();
        if (checkSubscriptionStatus()) {
            if (!state.currentUser) {
                showScreen("auth");
            } else if (!state.subscription) {
                showScreen("paywall");
            } else {
                showScreen("step1");
            }
        }
    }

    // Verificar retorno de pagamento da InfinitePay na URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
        const plan = urlParams.get("plan");
        // Limpar parâmetros da URL para evitar recargas ativando repetidamente
        window.history.replaceState({}, document.title, window.location.pathname);
        
        state.saveSubscription({
            plan: plan,
            active: true,
            date: new Date().toLocaleDateString('pt-BR')
        }).then(() => {
            localStorage.removeItem("pending_payment_plan");
            localStorage.removeItem("pending_payment_slug");
            updateUserUI();
            showToast(`Assinatura do Plano ${plan === "yearly" ? "Anual" : "Mensal"} ativada com sucesso! Obrigado!`);
            showScreen("step1");
        });
    }

    // Verificar se há algum pagamento pendente no localStorage e consultar na API da InfinitePay
    const pendingPlan = localStorage.getItem("pending_payment_plan");
    const pendingSlug = localStorage.getItem("pending_payment_slug");
    if (pendingPlan && pendingSlug && INFINITEPAY_TAG) {
        fetch("https://api.checkout.infinitepay.io/payment_check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                handle: INFINITEPAY_TAG,
                slug: pendingSlug
            })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Erro na requisição");
        })
        .then(data => {
            if (data && (data.status === "paid" || data.status === "approved" || data.status === "completed" || data.paid === true)) {
                localStorage.removeItem("pending_payment_plan");
                localStorage.removeItem("pending_payment_slug");
                state.saveSubscription({
                    plan: pendingPlan,
                    active: true,
                    date: new Date().toLocaleDateString('pt-BR')
                }).then(() => {
                    updateUserUI();
                    showToast(`Sua assinatura do Plano ${pendingPlan === "yearly" ? "Anual" : "Mensal"} foi confirmada! Obrigado!`);
                    showScreen("step1");
                });
            }
        })
        .catch(err => {
            console.warn("Erro ao consultar status do pagamento pendente:", err);
        });
    }

    // ==========================================================================
    // SISTEMA ADMINISTRATIVO E PAINEL DO TERAPEUTA (MÉTODO & CLIENTES)
    // ==========================================================================
    window.patternsDatabase = {};

    async function loadPatternsFromSupabase() {
        if (!supabaseClient) return;
        try {
            const { data, error } = await supabaseClient
                .from("patterns_kb")
                .select("*");
            if (!error && data && data.length > 0) {
                const db = {};
                data.forEach(item => {
                    db[item.id] = {
                        keywords: item.keywords,
                        category: item.category,
                        categoryEmoji: item.categoryEmoji,
                        title: item.title,
                        ajuste: item.ajuste,
                        movimento: item.movimento,
                        objetivo: item.objetivo,
                        declaracao: item.declaracao,
                        fortalecimento: item.fortalecimento,
                        pergunta: item.pergunta,
                        microacao: item.microacao
                    };
                });
                window.patternsDatabase = db;
                console.log("Banco de dados do Método carregado com sucesso do Supabase.");
            }
        } catch (err) {
            console.warn("Erro ao carregar patterns_kb do Supabase:", err);
        }
    }

    async function seedPatternsDatabaseIfEmpty() {
        if (!supabaseClient) return;
        try {
            const { count, error } = await supabaseClient
                .from("patterns_kb")
                .select("*", { count: "exact", head: true });
            
            if (!error && count === 0) {
                console.log("Banco patterns_kb vazio. Iniciando carga inicial...");
                const rows = Object.keys(INFORMATIONAL_DATABASE).map(key => {
                    const item = INFORMATIONAL_DATABASE[key];
                    return {
                        id: key,
                        title: item.title,
                        category: item.category,
                        categoryEmoji: item.categoryEmoji,
                        keywords: item.keywords,
                        ajuste: item.ajuste,
                        movimento: item.movimento,
                        objetivo: item.objetivo,
                        declaracao: item.declaracao,
                        fortalecimento: item.fortalecimento,
                        pergunta: item.pergunta,
                        microacao: item.microacao
                    };
                });
                const { error: insertErr } = await supabaseClient
                    .from("patterns_kb")
                    .insert(rows);
                if (!insertErr) {
                    console.log("Carga inicial de padrões concluída com sucesso!");
                    await loadPatternsFromSupabase();
                } else {
                    console.error("Erro na carga inicial:", insertErr);
                }
            }
        } catch (err) {
            console.warn("Erro ao verificar/semear base de padrões:", err);
        }
    }

    async function loadTherapistDashboardData() {
        if (!supabaseClient) {
            showToast("Supabase não configurado.");
            return;
        }

        try {
            // 1. Buscar dados do banco
            const { data: profiles, error: profErr } = await supabaseClient.from("profiles").select("*");
            const { data: subs, error: subsErr } = await supabaseClient.from("subscriptions").select("*");
            const { data: reorgs, error: reorgsErr } = await supabaseClient.from("reorganizations").select("*");

            if (profErr || subsErr || reorgsErr) {
                console.error("Erro ao carregar dados do dashboard:", profErr || subsErr || reorgsErr);
                showToast("Erro ao carregar dados do painel.");
                return;
            }

            // Guardar no escopo local do window para manipulação
            window.dashProfiles = profiles;
            window.dashSubscriptions = subs;
            window.dashReorganizations = reorgs;

            // 2. Calcular estatísticas
            const totalClients = profiles.filter(p => p.role === "client").length;
            const activeSubs = subs.filter(s => s.active && (s.plan === "monthly" || s.plan === "yearly")).length;
            
            let activeTrials = 0;
            subs.forEach(s => {
                if (s.plan === "trial" && s.active) {
                    const activationDate = new Date(s.date);
                    const currentDate = new Date();
                    let diffTime = currentDate - activationDate;
                    if (isNaN(diffTime)) {
                        const parts = s.date.split('/');
                        if (parts.length === 3) {
                            const parsedDate = new Date(parts[2], parts[1]-1, parts[0]);
                            diffTime = currentDate - parsedDate;
                        }
                    }
                    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const daysRemaining = 15 - daysElapsed;
                    if (daysRemaining > 0) {
                        activeTrials++;
                    }
                }
            });

            const totalPractices = reorgs.length;

            // Exibir estatísticas
            document.getElementById("stat-total-clients").innerText = totalClients;
            document.getElementById("stat-active-subs").innerText = activeSubs;
            document.getElementById("stat-active-trials").innerText = activeTrials;
            document.getElementById("stat-total-practices").innerText = totalPractices;

            // 3. Renderizar tabelas
            renderClientsTable(profiles, subs, reorgs);
            renderKbTable();

        } catch (err) {
            console.error("Erro no Dashboard do Terapeuta:", err);
        }
    }

    function renderClientsTable(profiles, subs, reorgs) {
        const body = document.getElementById("table-clients-body");
        if (!body) return;
        body.innerHTML = "";

        const clients = profiles.filter(p => p.role === "client");

        if (clients.length === 0) {
            body.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Nenhum cliente cadastrado ainda.</td></tr>`;
            return;
        }

        clients.forEach(c => {
            const sub = subs.find(s => s.user_id === c.id || s.email === c.email);
            const clientReorgs = reorgs.filter(r => r.user_id === c.id || r.email === c.email);

            let statusHTML = `<span class="badge-status inactive">Inativo</span>`;
            let dateHTML = "-";

            if (sub && sub.active) {
                dateHTML = sub.date;
                if (sub.plan === "trial") {
                    const activationDate = new Date(sub.date);
                    const currentDate = new Date();
                    let diffTime = currentDate - activationDate;
                    if (isNaN(diffTime)) {
                        const parts = sub.date.split('/');
                        if (parts.length === 3) {
                            const parsedDate = new Date(parts[2], parts[1]-1, parts[0]);
                            diffTime = currentDate - parsedDate;
                        }
                    }
                    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const daysRemaining = Math.max(0, 15 - daysElapsed);
                    
                    if (daysRemaining <= 0) {
                        statusHTML = `<span class="badge-status inactive">Teste Expirado</span>`;
                    } else {
                        statusHTML = `<span class="badge-status trial">Teste (${daysRemaining}d rest.)</span>`;
                    }
                } else {
                    const planLabel = sub.plan === "yearly" ? "Anual" : "Mensal";
                    statusHTML = `<span class="badge-status active">${planLabel}</span>`;
                }
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 1rem; font-weight: 500; color: var(--color-text-main);">${c.email}</td>
                <td style="padding: 1rem;">${statusHTML}</td>
                <td style="padding: 1rem; color: var(--color-text-muted);">${dateHTML}</td>
                <td style="padding: 1rem; text-align: center; font-weight: bold; color: var(--color-primary);">${clientReorgs.length}</td>
                <td style="padding: 1rem; text-align: right;">
                    <button class="btn btn-outline btn-view-history" data-email="${c.email}" data-id="${c.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Ver Histórico</button>
                </td>
            `;
            body.appendChild(tr);
        });

        body.querySelectorAll(".btn-view-history").forEach(btn => {
            btn.addEventListener("click", () => {
                const email = btn.dataset.email;
                const id = btn.dataset.id;
                openClientDetailsModal(email, id);
            });
        });
    }

    function openClientDetailsModal(email, id) {
        const modal = document.getElementById("modal-client-details");
        const emailLabel = document.getElementById("details-client-email");
        const container = document.getElementById("details-practices-container");

        if (!modal || !emailLabel || !container) return;

        emailLabel.innerText = email;
        container.innerHTML = "";

        const clientReorgs = window.dashReorganizations.filter(r => r.user_id === id || r.email === email);

        if (clientReorgs.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-muted); text-align: center; padding: 2rem 0;">Este cliente ainda não realizou nenhuma prática informacional.</p>`;
        } else {
            clientReorgs.sort((a, b) => b.id - a.id);
            clientReorgs.forEach(r => {
                const card = document.createElement("div");
                card.className = "practice-item-card";
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--color-text-muted);">
                        <span>📅 ${r.date}</span>
                        <span style="font-weight: 600; color: var(--color-primary-glow);">${r.categoryEmoji}</span>
                    </div>
                    <div style="font-weight: 500; font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-text-main);">"${r.phrase}"</div>
                    <div style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong style="color: var(--color-text-muted);">Padrão Ativado:</strong> ${r.title}</div>
                    <div style="font-size: 0.9rem;"><strong style="color: var(--color-text-muted);">Sentimento Pós-Prática:</strong> <span style="color: var(--color-primary);">${r.rating}</span></div>
                `;
                container.appendChild(card);
            });
        }

        modal.style.display = "flex";
    }

    function renderKbTable() {
        const body = document.getElementById("table-kb-body");
        if (!body) return;
        body.innerHTML = "";

        const db = window.patternsDatabase || INFORMATIONAL_DATABASE;
        const keys = Object.keys(db);

        if (keys.length === 0) {
            body.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Nenhum padrão cadastrado.</td></tr>`;
            return;
        }

        keys.forEach(key => {
            const item = db[key];
            const keywordsText = item.keywords ? item.keywords.join(", ") : "-";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 1rem; font-family: monospace; color: var(--color-text-muted); font-size: 0.8rem;">${key}</td>
                <td style="padding: 1rem; font-weight: 500; color: var(--color-text-main);">${item.title}</td>
                <td style="padding: 1rem; color: var(--color-primary-glow); font-weight: 600;">${item.categoryEmoji}</td>
                <td style="padding: 1rem; color: var(--color-text-muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${keywordsText}</td>
                <td style="padding: 1rem; text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="btn btn-outline btn-edit-pattern" data-id="${key}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Editar</button>
                        <button class="btn btn-text btn-delete-pattern" data-id="${key}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #EA4335;">Excluir</button>
                    </div>
                </td>
            `;
            body.appendChild(tr);
        });

        body.querySelectorAll(".btn-edit-pattern").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                openPatternEditor(id);
            });
        });

        body.querySelectorAll(".btn-delete-pattern").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                deletePattern(id);
            });
        });
    }

    function openPatternEditor(id = null) {
        const modal = document.getElementById("modal-pattern-editor");
        const titleEl = document.getElementById("pattern-editor-title");
        const idInput = document.getElementById("edit-pattern-id");
        const idDisplayInput = document.getElementById("edit-id-display");
        
        const form = document.getElementById("form-pattern-editor");
        if (!modal || !titleEl || !idInput || !idDisplayInput || !form) return;
        
        form.reset();

        if (id) {
            titleEl.innerText = "Editar Padrão Terapêutico";
            idInput.value = id;
            idDisplayInput.value = id;
            idDisplayInput.disabled = true;

            const db = window.patternsDatabase || INFORMATIONAL_DATABASE;
            const item = db[id];

            if (item) {
                document.getElementById("edit-title").value = item.title;
                document.getElementById("edit-category").value = item.category;
                document.getElementById("edit-category-emoji").value = item.categoryEmoji;
                document.getElementById("edit-keywords").value = item.keywords ? item.keywords.join(", ") : "";
                document.getElementById("edit-ajuste").value = item.ajuste;
                document.getElementById("edit-movimento").value = item.movimento;
                document.getElementById("edit-objetivo").value = item.objetivo;
                document.getElementById("edit-declaracao").value = item.declaracao;
                document.getElementById("edit-fortalecimento").value = item.fortalecimento || "";
                document.getElementById("edit-pergunta").value = item.pergunta || "";
                document.getElementById("edit-microacao").value = item.microacao || "";
            }
        } else {
            titleEl.innerText = "Novo Padrão Terapêutico";
            idInput.value = "";
            idDisplayInput.value = "";
            idDisplayInput.disabled = false;
        }

        modal.style.display = "flex";
    }

    async function deletePattern(id) {
        if (!confirm(`Tem certeza que deseja excluir o padrão '${id}'? Esta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            if (supabaseClient) {
                const { error } = await supabaseClient
                    .from("patterns_kb")
                    .delete()
                    .eq("id", id);

                if (error) {
                    console.error("Erro ao excluir do Supabase:", error);
                    showToast("Erro ao excluir do banco remoto.");
                } else {
                    showToast("Padrão excluído!");
                    await loadPatternsFromSupabase();
                    renderKbTable();
                }
            } else {
                if (window.patternsDatabase && window.patternsDatabase[id]) {
                    delete window.patternsDatabase[id];
                    showToast("Excluído localmente (offline).");
                    renderKbTable();
                }
            }
        } catch (err) {
            console.error("Falha ao excluir padrão:", err);
            showToast("Erro crítico ao excluir.");
        }
    }

    // Handlers e Binds de Elementos Administrativos
    const btnCloseClientDetails = document.getElementById("btn-close-client-details");
    if (btnCloseClientDetails) {
        btnCloseClientDetails.addEventListener("click", () => {
            document.getElementById("modal-client-details").style.display = "none";
        });
    }

    const btnClosePatternEditor = document.getElementById("btn-close-pattern-editor");
    if (btnClosePatternEditor) {
        btnClosePatternEditor.addEventListener("click", () => {
            document.getElementById("modal-pattern-editor").style.display = "none";
        });
    }

    const btnCancelPattern = document.getElementById("btn-cancel-pattern");
    if (btnCancelPattern) {
        btnCancelPattern.addEventListener("click", () => {
            document.getElementById("modal-pattern-editor").style.display = "none";
        });
    }

    const btnAddPattern = document.getElementById("btn-add-pattern");
    if (btnAddPattern) {
        btnAddPattern.addEventListener("click", () => {
            openPatternEditor(null);
        });
    }

    const tabDashClients = document.getElementById("tab-dash-clients");
    const tabDashKb = document.getElementById("tab-dash-kb");
    const panelDashClients = document.getElementById("panel-dash-clients");
    const panelDashKb = document.getElementById("panel-dash-kb");

    if (tabDashClients && tabDashKb && panelDashClients && panelDashKb) {
        tabDashClients.addEventListener("click", () => {
            tabDashClients.classList.add("active");
            tabDashKb.classList.remove("active");
            tabDashClients.style.borderBottomColor = "var(--color-primary)";
            tabDashKb.style.borderBottomColor = "transparent";
            panelDashClients.style.display = "block";
            panelDashKb.style.display = "none";
        });

        tabDashKb.addEventListener("click", () => {
            tabDashKb.classList.add("active");
            tabDashClients.classList.remove("active");
            tabDashKb.style.borderBottomColor = "var(--color-primary)";
            tabDashClients.style.borderBottomColor = "transparent";
            panelDashClients.style.display = "none";
            panelDashKb.style.display = "block";
        });
    }

    const formPatternEditor = document.getElementById("form-pattern-editor");
    if (formPatternEditor) {
        formPatternEditor.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const idInput = document.getElementById("edit-pattern-id").value;
            const idDisplay = document.getElementById("edit-id-display").value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
            const finalId = idInput ? idInput : idDisplay;

            if (!finalId) {
                showToast("ID inválido.");
                return;
            }

            const patternData = {
                title: document.getElementById("edit-title").value.trim(),
                category: document.getElementById("edit-category").value.trim(),
                categoryEmoji: document.getElementById("edit-category-emoji").value.trim(),
                keywords: document.getElementById("edit-keywords").value.split(",").map(k => k.trim().toLowerCase()).filter(k => k !== ""),
                ajuste: document.getElementById("edit-ajuste").value.trim(),
                movimento: document.getElementById("edit-movimento").value.trim(),
                objetivo: document.getElementById("edit-objetivo").value.trim(),
                declaracao: document.getElementById("edit-declaracao").value.trim(),
                fortalecimento: document.getElementById("edit-fortalecimento").value.trim(),
                pergunta: document.getElementById("edit-pergunta").value.trim(),
                microacao: document.getElementById("edit-microacao").value.trim()
            };

            const btnSave = document.getElementById("btn-save-pattern");
            btnSave.disabled = true;
            btnSave.innerText = "Salvando...";

            try {
                if (supabaseClient) {
                    const payload = {
                        id: finalId,
                        title: patternData.title,
                        category: patternData.category,
                        categoryEmoji: patternData.categoryEmoji,
                        keywords: patternData.keywords,
                        ajuste: patternData.ajuste,
                        movimento: patternData.movimento,
                        objetivo: patternData.objetivo,
                        declaracao: patternData.declaracao,
                        fortalecimento: patternData.fortalecimento,
                        pergunta: patternData.pergunta,
                        microacao: patternData.microacao
                    };

                    const { error } = await supabaseClient
                        .from("patterns_kb")
                        .upsert(payload);

                    if (error) {
                        console.error("Erro ao salvar padrão no Supabase:", error);
                        showToast("Erro ao salvar padrão no banco remoto.");
                    } else {
                        showToast("Padrão salvo com sucesso!");
                        document.getElementById("modal-pattern-editor").style.display = "none";
                        await loadPatternsFromSupabase();
                        renderKbTable();
                    }
                } else {
                    if (!window.patternsDatabase) window.patternsDatabase = { ...INFORMATIONAL_DATABASE };
                    window.patternsDatabase[finalId] = patternData;
                    showToast("Salvo localmente (offline).");
                    document.getElementById("modal-pattern-editor").style.display = "none";
                    renderKbTable();
                }
            } catch (err) {
                console.error("Falha ao salvar padrão:", err);
                showToast("Erro crítico ao salvar.");
            } finally {
                btnSave.disabled = false;
                btnSave.innerText = "Salvar Padrão";
            }
        });
    }
});
