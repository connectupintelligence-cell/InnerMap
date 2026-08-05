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
        categoryEmoji: "💼 Trabalho",
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
        categoryEmoji: "💰 Prosperidade",
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
        categoryEmoji: "💼 Trabalho",
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
        categoryEmoji: "🦁 Coragem",
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
        categoryEmoji: "❤️ Relacionamentos",
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
        categoryEmoji: "✨ Autoestima",
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
        categoryEmoji: "🌿 Saúde emocional",
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
// Função auxiliar para reestruturar gramaticalmente o fato do cliente na frase
function formatFactForSentence(fact) {
    let clean = fact.trim();
    if (!clean) return "";

    // 1. Remover prefixo "Fato sobre " (case-insensitive)
    if (clean.toLowerCase().startsWith("fato sobre ")) {
        clean = clean.substring(11).trim();
    }

    // 2. Corrigir construções como "mãe ser descontar os problemas" -> "mãe descontar os problemas"
    // Se a característica começar com verbos terminados em "ar", "er", "ir", "or", removemos o "ser" intermediário.
    clean = clean.replace(/(\w+)\s+ser\s+((\w+)(ar|er|ir|or)\b)/gi, "$1 $2");

    // 3. Substituir dois-pontos (":") por vírgula para fluidez
    clean = clean.replace(/\s*:\s*/g, ", ");

    const cleanLower = clean.toLowerCase();

    // 1. Se já começa com as conjunções solicitadas (quando, por, pela, pelo, etc.), respeitar o início
    const CONJUNCTIONS = ["quando ", "por ", "pela ", "pelo ", "pelas ", "pelos ", "na ", "no ", "em ", "com "];
    if (CONJUNCTIONS.some(c => cleanLower.startsWith(c))) {
        return clean;
    }

    // 2. Substantivos femininos de eventos ou situações -> usar "pela "
    const feminineNouns = ["briga", "discussão", "conversa", "perda", "demissão", "reunião", "viagem", "morte", "separação", "traição", "crítica", "fofoca", "ausência", "falência", "cobrança", "agressão"];
    // 3. Substantivos masculinos de eventos ou situações -> usar "pelo "
    const masculineNouns = ["conflito", "desentendimento", "erro", "acidente", "assalto", "problema", "gasto", "atraso", "divórcio", "término", "medo", "abandono"];

    const words = cleanLower.split(/\s+/);
    const firstWord = words[0];

    if (feminineNouns.includes(firstWord)) {
        return `pela ${clean}`;
    }
    if (masculineNouns.includes(firstWord)) {
        return `pelo ${clean}`;
    }

    // 4. Verbos no infinitivo ou ação direta do cliente -> usar "por "
    const infinitives = ["perder", "ficar", "ouvir", "ver", "ter", "ser", "fazer", "brigar", "discutir", "sofrer", "falhar", "errar", "receber", "apanhar", "gastar", "comprar", "vender"];
    if (infinitives.includes(firstWord)) {
        return `por ${clean}`;
    }

    // 5. Frases verbais com sujeito/tempo (ex: "meu pai gritou comigo", "eu perdi a chave", "a professora me humilhou") -> usar "quando "
    if (words.length >= 2) {
        return `quando ${clean}`;
    }

    // Fallback padrão com "por "
    return `por ${clean}`;
}


// Função auxiliar para construir as frases de MSI e MFI de acordo com a seleção e sentimentos
function buildDeclarations(phrase, isHereditary, hereditaryType, addedFacts, category, factDetail) {
    const cleanConcept = phrase.replace(/eu tenho/gi, '')
                            .replace(/estou com/gi, '')
                            .replace(/sinto muito/gi, '')
                            .replace(/sinto/gi, '')
                            .replace(/tenho/gi, '')
                            .replace(/medo de/gi, 'medo de ')
                            .trim();

    let msi = "";
    if (isHereditary) {
        const type = hereditaryType || "comportamento";
        if (type === "sentimento" || type === "comportamento") {
            msi += `Alma, "${cleanConcept.toLowerCase()}" (que recebi ou recebido) do primeiro dia de minha existência até a primeira infância, acabou!\n`;
        }
        if (type === "pensamento" || type === "comportamento") {
            msi += `Espírito, "${cleanConcept.toLowerCase()}" (que recebi ou recebido) do primeiro dia de minha existência até a primeira infância, acabou!`;
        }
        msi = msi.trim();
    }

    let mfi = "";
    let factsList = [];
    
    if (addedFacts && addedFacts.length > 0) {
        factsList = addedFacts;
    } else if (factDetail && factDetail.trim() !== "") {
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
        
        factsList.push({
            phrase: factDetail.trim(),
            sentiments: [...new Set(matchedSentiments)]
        });
    }

    const mfiBlocks = [];
    factsList.forEach(fact => {
        const formattedFact = formatFactForSentence(fact.phrase);
        let block = "";
        
        let sList = fact.sentiments;
        if (!sList || sList.length === 0) {
            sList = ["tristeza"];
        }

        sList.forEach(s => {
            block += `Alma, ${s} que senti ${formattedFact} acabou!\n`;
        });
        block += `Alma, todos os sentimentos que recebi ${formattedFact} acabaram!\n`;
        block += `Espírito, todas as informações negativas que recebi ${formattedFact} acabou!\n`;
        block += `Espírito, todas as informações negativas que gerei ${formattedFact} acabou!`;
        
        mfiBlocks.push(block);
    });

    mfi = mfiBlocks.join("\n\n");

    return { msi, mfi };
}

class ReorganizationEngine {
    static analyzeInput(inputPhrase, isHereditary, hereditaryType, addedFacts, factDetail, selectedLevel = "avancado", addedPositivosAtrapalham = [], hasMdiCondicional = false, addedMdiBehaviors = []) {
        const text = inputPhrase.toLowerCase().trim();
        if (!text) return null;

        const embedding = generateMockEmbedding(inputPhrase);

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

        // Construir declarações MSI/MFI dinamicamente
        const declarations = buildDeclarations(inputPhrase, isHereditary, hereditaryType, addedFacts, category, factDetail);

        // MRI - Movimento de Reinterpretação
        let cleanMRI = "";
        if (matchedKey && maxMatches > 0) {
            cleanMRI = rawMRI.replace(/^3\s*-\s*Movimento[^\n]*MRI\n?/i, "").trim();
        } else {
            const mriSuggest = this.suggestMriRessignificacao(inputPhrase);
            cleanMRI = `Espírito, eu escolho ${mriSuggest.es}.\nAlma, eu já ${mriSuggest.al}.`;
        }

        // MDI - Movimento de Descompactação Informacional (BLOCO 3.3 - Fixo)
        const cleanConcept = inputPhrase.replace(/eu tenho/gi, '')
                                .replace(/estou com/gi, '')
                                .replace(/sinto muito/gi, '')
                                .replace(/sinto/gi, '')
                                .replace(/tenho/gi, '')
                                .replace(/medo de/gi, 'medo de ')
                                .trim();

        const masculineConcepts = ["medo", "conflito", "desentendimento", "orgulho", "ciúme", "estresse", "vazio", "apego", "controle", "pânico", "abandono", "bloqueio", "sofrimento", "trauma", "fracasso", "julgamento", "desapego"];
        const isMasc = masculineConcepts.some(w => cleanConcept.toLowerCase().trim() === w);
        const connector = isMasc ? "pelo" : "pela";
        const artigo = isMasc ? "o" : "a";
        const prepArtigo = isMasc ? "ao" : "à";

        let mdi = `Espírito, pensamento que gerou ${artigo} "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `Espírito, condicionamento de manifestar ${artigo} "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `Espírito, condicionamento de observar ${artigo} "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `Espírito, condicionamento de dar utilidade ${prepArtigo} "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `Espírito, crença sobre ${artigo} "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `Espírito, hereditariedade recebida de "${cleanConcept.toLowerCase()}" acabou!`;

        // MDI Condicional extra lines
        if (hasMdiCondicional && addedMdiBehaviors && addedMdiBehaviors.length > 0) {
            addedMdiBehaviors.forEach(item => {
                if (item.behavior) {
                    mdi += `\nEspírito, condicionamento de ${item.behavior.toLowerCase()} acabou!`;
                    if (item.sentiment) {
                        mdi += `\nEspírito, condicionamento de me sentir ${item.sentiment.toLowerCase()} ${connector} ${cleanConcept.toLowerCase()} acabou!`;
                    }
                }
            });
        }

        let finalEspecifica = "";
        let finalNaoEspecifica = "";
        let finalMicroacao = "";

        if (selectedLevel === "iniciante") {
            finalEspecifica = ""; // Sem MSI/MFI/MFPI
            finalNaoEspecifica = cleanMRI; // Apenas MRI
            
            // Fallback microação simplificada para Iniciante
            if (category === "Relacionamentos") {
                finalMicroacao = `Na próxima situação de relacionamento, observe como o padrão de "${cleanConcept.toLowerCase()}" se apresenta e faça uma escolha consciente diferente.`;
            } else if (category === "Prosperidade" || category === "Trabalho") {
                finalMicroacao = `Ao lidar com questões de trabalho ou dinheiro, faça uma pausa de reflexão sobre o tema "${cleanConcept.toLowerCase()}".`;
            } else {
                finalMicroacao = `Tire alguns minutos do seu dia para respirar profundamente e soltar o padrão mental de "${cleanConcept.toLowerCase()}".`;
            }
        } else {
            // MFPI (falso positivo) - 1x na vida
            const especificaList = [];
            if (selectedLevel === "avancado") {
                if (declarations.msi) especificaList.push(declarations.msi);
                if (declarations.mfi) especificaList.push(declarations.mfi);
            }
            
            if (selectedLevel === "avancado" || selectedLevel === "intermediario") {
                if (addedPositivosAtrapalham && addedPositivosAtrapalham.length > 0) {
                    addedPositivosAtrapalham.forEach(item => {
                        let mfpiBlock = `Alma, prazer que senti ao ${item.toLowerCase()} acabou!\n`;
                        mfpiBlock += `Alma, desejo que senti ao ${item.toLowerCase()} acabou!\n`;
                        mfpiBlock += `Alma, apego que senti ao ${item.toLowerCase()} acabou!\n`;
                        mfpiBlock += `Alma, dependência que senti ao ${item.toLowerCase()} acabou!`;
                        especificaList.push(mfpiBlock);
                    });
                }
            }
            finalEspecifica = especificaList.join("\n\n");
            
            // MDI + MRI
            finalNaoEspecifica = cleanMRI + "\n\n" + mdi;

            // --- Lógica de Geração de Microações Personalizadas (Seção 6) ---
            const firstMdiBehavior = (hasMdiCondicional && addedMdiBehaviors && addedMdiBehaviors.length > 0) ? addedMdiBehaviors[0].behavior : "";

            if (hasMdiCondicional && firstMdiBehavior && addedPositivosAtrapalham && addedPositivosAtrapalham.length > 0) {
                // Ambos comportamentos e falsos positivos
                if (category === "Relacionamentos") {
                    finalMicroacao = `Na próxima situação envolvendo seu tema, evite "${firstMdiBehavior.toLowerCase()}" e pratique soltar o apego de "${addedPositivosAtrapalham[0].toLowerCase()}", observando o equilíbrio retornar.`;
                } else if (category === "Prosperidade" || category === "Trabalho") {
                    finalMicroacao = `Ao lidar com dinheiro ou trabalho, interrompa o hábito de "${firstMdiBehavior.toLowerCase()}" e desapegue da necessidade de "${addedPositivosAtrapalham[0].toLowerCase()}".`;
                } else {
                    finalMicroacao = `Ao perceber o desconforto, evite "${firstMdiBehavior.toLowerCase()}" e solte a dependência de "${addedPositivosAtrapalham[0].toLowerCase()}".`;
                }
            } else if (hasMdiCondicional && firstMdiBehavior) {
                // Apenas comportamento repetitivo
                if (category === "Relacionamentos") {
                    finalMicroacao = `Na próxima situação envolvendo seu tema ou pessoas próximas, pratique o oposto de "${firstMdiBehavior.toLowerCase()}" para romper o ciclo automático.`;
                } else if (category === "Prosperidade" || category === "Trabalho") {
                    finalMicroacao = `Diante de desafios ligados a dinheiro/trabalho, crie um espaço de reflexão de 10 minutos antes de "${firstMdiBehavior.toLowerCase()}".`;
                } else {
                    finalMicroacao = `Quando notar o padrão do tema se manifestando, em vez de "${firstMdiBehavior.toLowerCase()}", faça uma pausa consciente e ancore o MRI.`;
                }
            } else if (addedPositivosAtrapalham && addedPositivosAtrapalham.length > 0) {
                // Apenas falso positivo (MFPI)
                finalMicroacao = `Pratique soltar o apego de "${addedPositivosAtrapalham[0].toLowerCase()}" no seu dia a dia. Observe quando essa força aparente se manifesta e escolha a flexibilidade.`;
            } else {
                // Fallback por categoria amarrado ao TEMA literal
                if (category === "Prosperidade") {
                    finalMicroacao = `Dedique 15 minutos hoje para revisar suas ações práticas em relação a "${cleanConcept.toLowerCase()}" e tome uma decisão organizada.`;
                } else if (category === "Trabalho") {
                    finalMicroacao = `Organize sua rotina diária para dar uma resposta mais equilibrada e menos automática ao tema "${cleanConcept.toLowerCase()}".`;
                } else if (category === "Relacionamentos") {
                    finalMicroacao = `Pratique a observação do padrão de "${cleanConcept.toLowerCase()}" na sua próxima interação e responda com clareza e empatia.`;
                } else {
                    finalMicroacao = `Reserve um momento de silêncio hoje para reconhecer e soltar conscientemente a tensão ligada a "${cleanConcept.toLowerCase()}".`;
                }
            }
        }

        return {
            category: category,
            categoryEmoji: categoryEmoji,
            title: title,
            ajuste: ajuste,
            movimento: movimento,
            objetivo: objetivo,
            declaracaoEspecifica: finalEspecifica, // MFI
            declaracaoNaoEspecifica: finalNaoEspecifica, // MSI + MRI + MDI dependendo do nível
            pergunta: pergunta,
            microacao: finalMicroacao,
            embedding: embedding,
            originalPhrase: inputPhrase
        };
    }

    static suggestMriRessignificacao(phrase) {
        const clean = phrase.toLowerCase().trim();
        let es = "direcionar minha atenção para novas possibilidades, soluções e expansão";
        let al = "construo minha realidade com presença, consistência e equilíbrio";

        if (clean.includes("escassez") || clean.includes("dinheiro") || clean.includes("financeiro") || clean.includes("dívida") || clean.includes("pobre")) {
            es = "direcionar minha atenção para a abundância, prosperidade e fluxo constante de recursos";
            al = "construo riqueza, fartura e segurança financeira com ações consistentes e sabedoria";
        } else if (clean.includes("relacionamento") || clean.includes("amor") || clean.includes("briga") || clean.includes("casamento")) {
            es = "direcionar minha atenção para conexões saudáveis, comunicação pacífica e amor mútuo";
            al = "vivencio laços afetivos harmônicos, respeito mútuo e cooperação diária";
        } else if (clean.includes("ansiedade") || clean.includes("medo") || clean.includes("pânico") || clean.includes("preocupação")) {
            es = "direcionar minha atenção para a paz interna, segurança e clareza mental";
            al = "sinto serenidade, confiança absoluta na vida e estabilidade emocional em meu corpo";
        } else if (clean.includes("trabalho") || clean.includes("carreira") || clean.includes("profissional") || clean.includes("emprego")) {
            es = "direcionar minha atenção para o crescimento profissional, reconhecimento e realização";
            al = "exerço meus talentos com dedicação, prosperidade e entrega de valor consistente";
        } else if (clean.includes("saúde") || clean.includes("dor") || clean.includes("doença") || clean.includes("corpo")) {
            es = "direcionar minha atenção para a saúde plena, regeneração celular e vitalidade";
            al = "sinto meu corpo forte, revigorado e em perfeito equilíbrio funcional";
        }

        return { es, al };
    }

    static generateDynamicFallback(phrase) {
        const text = phrase.toLowerCase().trim();
        let category = "Autoconhecimento";
        let categoryEmoji = "🧘 Autoconhecimento";
        let title = "Processo de Reorganização";
        
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("financeiro") || text.includes("rico") || text.includes("pobre") || text.includes("prosperar") || text.includes("economia")) {
            category = "Prosperidade";
            categoryEmoji = "💰 Prosperidade";
            title = "Ajuste de Prosperidade";
        } else if (text.includes("trabalho") || text.includes("empresa") || text.includes("negócio") || text.includes("carreira") || text.includes("vender") || text.includes("chefe") || text.includes("emprego")) {
            category = "Trabalho";
            categoryEmoji = "💼 Trabalho";
            title = "Ajuste de Trabalho";
        } else if (text.includes("relacionamento") || text.includes("namorado") || text.includes("amor") || text.includes("casamento") || text.includes("traição") || text.includes("solidão") || text.includes("abandono") || text.includes("ciúme") || text.includes("marido") || text.includes("esposa")) {
            category = "Relacionamentos";
            categoryEmoji = "❤️ Relacionamentos";
            title = "Ajuste de Relacionamento";
        } else if (text.includes("saúde") || text.includes("dor") || text.includes("doente") || text.includes("corpo") || text.includes("sono") || text.includes("cansado") || text.includes("energia") || text.includes("doença")) {
            category = "Saúde emocional";
            categoryEmoji = "🌿 Saúde emocional";
            title = "Ajuste de Saúde Emocional";
        } else if (text.includes("medo") || text.includes("receio") || text.includes("pavor")) {
            category = "Coragem";
            categoryEmoji = "🦁 Coragem";
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
        this.hereditaryType = null;
        this.addedFacts = []; // [{ phrase: "...", sentiments: [] }]
        this.factDetail = "";
        this.selectedLevel = "avancado"; // iniciante, intermediario, avancado
        
        // MFPI & MDI Condicional
        this.addedPositivosAtrapalham = [];
        this.hasMdiCondicional = false;
        this.addedMdiBehaviors = []; // [{ behavior: "...", sentiment: "..." }]
        
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
            let { data: profData, error: profErr } = await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", this.currentUser.id)
                .maybeSingle();

            // Se o perfil não existir (usuário antigo criado antes do trigger), cria-o agora!
            if (!profErr && !profData) {
                console.log("Perfil não encontrado. Criando perfil padrão...");
                const { data: newProfile, error: insertErr } = await supabaseClient
                    .from("profiles")
                    .insert({
                        id: this.currentUser.id,
                        email: this.currentUser.email,
                        role: "client"
                    })
                    .select("role")
                    .maybeSingle();
                
                if (!insertErr && newProfile) {
                    profData = newProfile;
                }
            }

            if (!profErr && profData) {
                this.currentUser.role = profData.role;
            } else {
                this.currentUser.role = "client";
            }
            this.saveUser(this.currentUser);

            if (profErr) {
                console.error("Erro ao carregar perfil do Supabase:", profErr);
            }

            // 1. Buscar Assinatura Remota
            const { data: subData, error: subErr } = await supabaseClient
                .from("subscriptions")
                .select("*")
                .eq("user_id", this.currentUser.id || this.currentUser.email)
                .maybeSingle();

            if (subErr) {
                console.error("Erro ao carregar assinatura do Supabase:", subErr);
            } else if (subData) {
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

            if (histErr) {
                console.error("Erro ao buscar histórico de reorganizações no Supabase:", histErr);
                showToast("Erro ao sincronizar histórico: " + histErr.message);
            } else if (histData) {
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
            console.error("Erro crítico na carga do Supabase:", err);
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
                const { error: insertErr } = await supabaseClient.from("reorganizations").insert({
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
                
                if (insertErr) {
                    console.error("Erro ao salvar reorganização no Supabase:", insertErr);
                    showToast("Erro ao salvar no banco: " + insertErr.message);
                } else {
                    console.log("Reorganização salva com sucesso no Supabase!");
                }
            } catch (err) {
                console.error("Erro crítico ao salvar reorganização no Supabase:", err);
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

    // Carregar chave de API no startup para concordância funcionar em todos os fluxos
    if (supabaseClient) {
        // Carregar chave de API em background (não-bloqueante) para concordância funcionar em todos os fluxos
        supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single()
            .then(({ data }) => { if (data && data.value) state.apiKey = data.value; })
            .catch(e => console.warn("Chave de API não carregada no startup:", e));
    }
    if (!state.apiKey) state.apiKey = localStorage.getItem("innermap_gemini_key") || null;
    
    
    const screens = {
        step1: document.getElementById("screen-step1"),
        step2: document.getElementById("screen-step2"),
        step3: document.getElementById("screen-step3"),
        step4: document.getElementById("screen-step4"),
        auth: document.getElementById("screen-auth"),
        paywall: document.getElementById("screen-paywall"),
        therapist: document.getElementById("screen-therapist")
    };
    
    const inputPhrase = document.getElementById("input-phrase");
    const btnGenerate = document.getElementById("btn-generate");
    const btnLoginTrigger = document.getElementById("btn-login-trigger");
    const btnHeroLogin = document.getElementById("btn-hero-login");
    
    // Sub-screens da Tela 1 (Questionário)
    const subStep1a = document.getElementById("sub-step-1a");
    const btnSubNext1 = document.getElementById("btn-sub-next1");
    const subStep1aConfirm = document.getElementById("sub-step-1a-confirm");
    const confirmThemeText = document.getElementById("confirm-theme-text");
    const btnConfirmAdjust = document.getElementById("btn-confirm-adjust");
    const btnConfirmNext = document.getElementById("btn-confirm-next");
    
    // MFPI and MDI Condicional sub-screens
    const subStep1aMfpi = document.getElementById("sub-step-1a-mfpi");
    const inputMfpiItem = document.getElementById("input-mfpi-item");
    const btnMfpiAdd = document.getElementById("btn-mfpi-add");
    const mfpiListContainer = document.getElementById("mfpi-list-container");
    const btnMfpiBack = document.getElementById("btn-mfpi-back");
    const btnMfpiNext = document.getElementById("btn-mfpi-next");

    const subStep1aMdiCond = document.getElementById("sub-step-1a-mdi-cond");
    const btnMdiCondYes = document.getElementById("btn-mdi-cond-yes");
    const btnMdiCondNo = document.getElementById("btn-mdi-cond-no");
    const mdiCondInputsContainer = document.getElementById("mdi-cond-inputs-container");
    const inputMdiBehavior = document.getElementById("input-mdi-behavior");
    const inputMdiSentiment = document.getElementById("input-mdi-sentiment");
    const btnMdiCondBack = document.getElementById("btn-mdi-cond-back");
    const btnMdiCondNext = document.getElementById("btn-mdi-cond-next");
    const btnMdiAddItem = document.getElementById("btn-mdi-add-item");
    const mdiListContainer = document.getElementById("mdi-list-container");

    const subStep1b = document.getElementById("sub-step-1b");
    const btnFamilyNo = document.getElementById("btn-family-no");
    const btnFamilyYesSentimento = document.getElementById("btn-family-yes-sentimento");
    const btnFamilyYesPensamento = document.getElementById("btn-family-yes-pensamento");
    const btnFamilyYesComportamento = document.getElementById("btn-family-yes-comportamento");
    const btnFamilyBack = document.getElementById("btn-family-back");

    // Rastreamento Guiado - MFI DOM Elements
    const subStep2a = document.getElementById("sub-step-2a");
    const questQuestionText = document.getElementById("quest-question-text");
    const questInputWrapper = document.getElementById("quest-input-wrapper");
    const questOpenInput = document.getElementById("quest-open-input");
    const questOptionsWrapper = document.getElementById("quest-options-wrapper");
    const btnQuestBack = document.getElementById("btn-quest-back");
    const btnQuestSkip = document.getElementById("btn-quest-skip");
    const btnQuestNext = document.getElementById("btn-quest-next");

    // Revisão e Sentimentos DOM Elements
    const subStep2b = document.getElementById("sub-step-2b");
    const revisionFactsList = document.getElementById("revision-facts-list");
    const btnRevisionAddMore = document.getElementById("btn-revision-add-more");
    const btnRevisionNext = document.getElementById("btn-revision-next");

    const subStep2c = document.getElementById("sub-step-2c");
    const sentimentCurrentFactText = document.getElementById("sentiment-current-fact-text");
    const sentimentFactTagsGrid = document.getElementById("sentiment-fact-tags-grid");
    const sentimentStepCount = document.getElementById("sentiment-step-count");
    const btnSentimentSave = document.getElementById("btn-sentiment-save");
    const copyPrevSentimentsContainer = document.getElementById("copy-prev-sentiments-container");
    const btnCopyPrevSentiments = document.getElementById("btn-copy-prev-sentiments");
    
    // Tela 2
    const outputAjuste = document.getElementById("output-ajuste");
    const outputMovimento = document.getElementById("output-movimento");
    const btnToStep3 = document.getElementById("btn-to-step3");
    
    // Tela 3
    const outputCategory = document.getElementById("output-category");
    const outputObjetivo = document.getElementById("output-objetivo");
    const outputEspecifico = document.getElementById("output-especifico") || document.getElementById("output-declaracao");
    const outputNaoEspecifico = document.getElementById("output-nao-especifico") || document.getElementById("output-fortalecimento");
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
    const navAgenda = document.getElementById("nav-agenda");
    const navLib = document.getElementById("nav-lib");
    const navNav = document.getElementById("nav-rag"); // matches nav-rag
    const navTherapist = document.getElementById("nav-therapist"); // matches nav-therapist
    const sectionApp = document.getElementById("app-workspace");
    const sectionAgenda = document.getElementById("agenda-workspace");
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
        // Mobile bottom nav references
        const mApp = document.getElementById("mobile-nav-app");
        const mAgenda = document.getElementById("mobile-nav-agenda");
        const mLib = document.getElementById("mobile-nav-lib");
        const mTherapist = document.getElementById("mobile-nav-therapist");

        [navApp, navAgenda, navLib, navNav, navTherapist, mApp, mAgenda, mLib, mTherapist].forEach(el => el && el.classList.remove("active"));
        [sectionApp, sectionAgenda, sectionLib, sectionRag].forEach(el => el && (el.style.display = "none"));
        
        if (activeNav) {
            activeNav.classList.add("active");
            if (activeNav === navApp && mApp) mApp.classList.add("active");
            if (activeNav === mApp && navApp) navApp.classList.add("active");
            
            if (activeNav === navAgenda && mAgenda) mAgenda.classList.add("active");
            if (activeNav === mAgenda && navAgenda) navAgenda.classList.add("active");
            
            if (activeNav === navLib && mLib) mLib.classList.add("active");
            if (activeNav === mLib && navLib) navLib.classList.add("active");
            
            if (activeNav === navTherapist && mTherapist) mTherapist.classList.add("active");
            if (activeNav === mTherapist && navTherapist) navTherapist.classList.add("active");
        }
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

    const logoContainer = document.getElementById("logo-container");
    if (logoContainer) {
        logoContainer.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(navApp, sectionApp);
            if (!state.currentUser) {
                showScreen("auth");
            } else if (!state.subscription) {
                showScreen("paywall");
            } else {
                state.currentStep = 0;
                showScreen("step1");
            }
        });
    }

    if (navAgenda) {
        navAgenda.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser) {
                showToast("Acesse sua conta para ver sua agenda.");
                switchTab(navApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription && state.currentUser.role !== "therapist") {
                showToast("Assine um plano para ver sua agenda.");
                switchTab(navApp, sectionApp);
                showScreen("paywall");
                return;
            }
            switchTab(navAgenda, sectionAgenda);
            if (window.renderAgenda) window.renderAgenda();
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

    // Event Listeners para a Barra de Navegação Mobile
    const mApp = document.getElementById("mobile-nav-app");
    const mAgenda = document.getElementById("mobile-nav-agenda");
    const mLib = document.getElementById("mobile-nav-lib");
    const mTherapist = document.getElementById("mobile-nav-therapist");

    if (mApp) {
        mApp.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(mApp, sectionApp);
            if (!state.currentUser) {
                showScreen("auth");
            } else if (!state.subscription) {
                showScreen("paywall");
            } else if (state.currentStep === 0) {
                showScreen("step1");
            }
        });
    }

    if (mAgenda) {
        mAgenda.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser) {
                showToast("Acesse sua conta para ver sua agenda.");
                switchTab(mApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription && state.currentUser.role !== "therapist") {
                showToast("Assine um plano para ver sua agenda.");
                switchTab(mApp, sectionApp);
                showScreen("paywall");
                return;
            }
            switchTab(mAgenda, sectionAgenda);
            if (window.renderAgenda) window.renderAgenda();
        });
    }

    if (mLib) {
        mLib.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser) {
                showToast("Acesse sua conta para ver suas Reorganizações.");
                switchTab(mApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription) {
                showToast("Assine um plano para ver suas Reorganizações.");
                switchTab(mApp, sectionApp);
                showScreen("paywall");
                return;
            }
            switchTab(mLib, sectionLib);
            renderLibrary();
            renderStats();
        });
    }

    if (mTherapist) {
        mTherapist.addEventListener("click", (e) => {
            e.preventDefault();
            if (!state.currentUser || state.currentUser.role !== "therapist") {
                showToast("Acesso restrito a terapeutas.");
                return;
            }
            switchTab(mTherapist, sectionApp);
            showScreen("therapist");
            loadTherapistDashboardData();
        });
    }



    // Seleção de Nível de Profundidade (Tela 1A)
    const btnLevelIniciante = document.getElementById("btn-level-iniciante");
    const btnLevelIntermediario = document.getElementById("btn-level-intermediario");
    const btnLevelAvancado = document.getElementById("btn-level-avancado");
    const levelCards = [btnLevelIniciante, btnLevelIntermediario, btnLevelAvancado];

    levelCards.forEach(card => {
        if (card) {
            card.addEventListener("click", () => {
                levelCards.forEach(c => c && c.classList.remove("active"));
                card.classList.add("active");
                state.selectedLevel = card.dataset.level;
            });
        }
    });
    // ==========================================================================
    // SELETOR DE OBJETIVO (MODOS 1, 2 E 3) & INTEGRAÇÃO COM GEMINI/GROQ AI
    // ==========================================================================
    state.selectedMode = 1; // 1: Desconforto Recente, 2: História/Passado, 3: Motivação Rápida
    const objCards = document.querySelectorAll(".objective-card");
    const step1Title = document.getElementById("step1-title");
    const step1Desc = document.getElementById("step1-desc");
    const inputAiRelato = document.getElementById("input-ai-relato");

    const charCounterContainer = document.getElementById("char-counter-container");
    const charCounterText = document.getElementById("char-counter-text");
    const charCounterNumber = document.getElementById("char-counter-number");

    function updateRelatoCounter() {
        if (!inputAiRelato || !charCounterContainer || !charCounterNumber) return;
        const raw = inputAiRelato.value.trim();
        const charCount = raw.length;
        const wordCount = raw ? raw.split(/\s+/).filter(w => w.length > 0).length : 0;
        const wordLabel = wordCount === 1 ? "1 palavra" : `${wordCount} palavras`;

        charCounterContainer.style.display = "flex";

        if (state.selectedMode === 4) {
            if (charCounterText) charCounterText.textContent = "Mínimo para panorama completo: 100 caracteres";
            charCounterNumber.textContent = `${wordLabel} • ${charCount} / 100 caracteres`;
            charCounterNumber.style.color = charCount >= 100 ? "var(--color-primary)" : "#fca5a5";
        } else {
            if (charCounterText) charCounterText.textContent = "Contagem do relato:";
            charCounterNumber.textContent = `${wordLabel} (${charCount} caracteres)`;
            charCounterNumber.style.color = charCount > 0 ? "var(--color-primary)" : "var(--color-text-muted)";
        }
    }

    function updateAprofundamentoCounter() {
        const inputAprofundamento = document.getElementById("input-ai-aprofundamento");
        const counterNum = document.getElementById("ai-aprofundamento-counter-number");
        if (!inputAprofundamento || !counterNum) return;

        const raw = inputAprofundamento.value.trim();
        const charCount = raw.length;
        const wordCount = raw ? raw.split(/\s+/).filter(w => w.length > 0).length : 0;
        const wordLabel = wordCount === 1 ? "1 palavra" : `${wordCount} palavras`;

        counterNum.textContent = charCount > 0 ? `${wordLabel} (${charCount} caracteres)` : "0 palavras (0 caracteres)";
    }

    objCards.forEach(card => {
        card.addEventListener("click", () => {
            objCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            state.selectedMode = parseInt(card.dataset.mode || "1");

            if (state.selectedMode === 1) {
                if (step1Title) step1Title.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: var(--color-primary);"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Descreva seu Desconforto ou Fato Recente`;
                if (step1Desc) step1Desc.textContent = "Conte o que aconteceu recentemente e qual sentimento isso gerou em você. Nossa inteligência ajudará a construir seu processo de liberação.";
                if (inputAiRelato) inputAiRelato.placeholder = "Escreva aqui o que aconteceu (Ex: Fiquei muito chateado(a) na reunião de ontem porque sinto que meu chefe desvalorizou meu empenho e me senti incompetente e com raiva...)";
            } else if (state.selectedMode === 2) {
                if (step1Title) step1Title.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: var(--color-primary);"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Compartilhe sua História / Lembranças`;
                if (step1Desc) step1Desc.textContent = "Conte lembranças da infância, padrões familiares ou fatos do passado que você deseja ressignificar.";
                if (inputAiRelato) inputAiRelato.placeholder = "Escreva aqui sua história (Ex: Quando criança, meus pais me cobravam muito pelas notas. Aprendi que precisava ser perfeita para ser amada...)";
            } else if (state.selectedMode === 3) {
                if (step1Title) step1Title.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: var(--color-primary);"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Motivação e Foco para o Dia / Semana`;
                if (step1Desc) step1Desc.textContent = "Qual é o tema ou objetivo em que você quer ter clareza, força e motivação hoje?";
                if (inputAiRelato) inputAiRelato.placeholder = "Digite o foco desejado (Ex: Quero motivação e foco para finalizar meu projeto esta semana, com serenidade e autoconfiança...)";
            } else if (state.selectedMode === 4) {
                if (step1Title) step1Title.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: var(--color-primary);"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Reorganização Profunda & Completa`;
                if (step1Desc) step1Desc.textContent = "Descreva com detalhes o panorama do seu momento atual para uma transformação completa. Escreva pelo menos 100 caracteres.";
                if (inputAiRelato) inputAiRelato.placeholder = "Escreva ou fale detalhadamente tudo o que está acontecendo e como você se sente (Ex: Sinto muita pressão e ansiedade no trabalho e nos meus relacionamentos desde que mudei de cargo. Tenho medo constante de falhar e me sinto sozinho para resolver as coisas...)";
            }
            updateRelatoCounter();
        });
    });

    if (inputAiRelato) {
        inputAiRelato.addEventListener("input", updateRelatoCounter);
        updateRelatoCounter();
    }

    const inputAprofundamentoElem = document.getElementById("input-ai-aprofundamento");
    if (inputAprofundamentoElem) {
        inputAprofundamentoElem.addEventListener("input", updateAprofundamentoCounter);
        updateAprofundamentoCounter();
    }

    // ✨ Gera os 12 comandos generativos do MGI (Movimento Generativo Informacional)
    async function generateMgiCommands(tema) {
        if (!tema || !tema.trim()) tema = "esta queixa";

        // Tentar contextualização gramatical via IA (Groq/Gemini)
        if (state.apiKey && state.apiKey.startsWith("gsk_")) {
            try {
                const promptMgi = `Você é um psicoterapeuta especialista no Método InnerMap.
O cliente forneceu o tema central: "${tema}".

Para alimentar os 12 comandos de limpeza generativa (MGI), precisamos adaptar a palavra/frase do tema para que se encaixe com 100% de sentido gramatical e concordância perfeita em português em cada uma das lacunas abaixo.

Retorne um objeto JSON contendo exatamente as chaves com a flexão do tema em cada frase:
{
  "causaram_tema": "a causa flexionada (ex: desequilíbrios nos relacionamentos, a escassez financeira, os conflitos no trabalho)",
  "recebida_de": "da/do tema (ex: desequilíbrios nos relacionamentos, escassez, insegurança)",
  "manifestar": "o/a tema (ex: desequilíbrios nos relacionamentos, a escassez)",
  "geraram_tema": "o/a tema (ex: desequilíbrios nos relacionamentos, a escassez)",
  "geradas_pela_pelo": "pela/pelo tema (ex: pelos desequilíbrios nos relacionamentos, pela escassez financeira)",
  "vivenciei": "o/a tema (ex: desequilíbrios nos relacionamentos, a escassez)"
}`;

                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.apiKey}` },
                    body: JSON.stringify({ model: "llama-3.3-70b-versatile", response_format: { type: "json_object" }, messages: [{ role: "user", content: promptMgi }] })
                });

                if (res.ok) {
                    const data = await res.json();
                    const f = JSON.parse(data.choices[0].message.content);
                    if (f) {
                        const causaram = f.causaram_tema || tema;
                        const recebida = f.recebida_de || tema;
                        const manifestar = f.manifestar || tema;
                        const geraram = f.geraram_tema || tema;
                        const geradasPelaPelo = f.geradas_pela_pelo || (`pela(o) ${tema}`);
                        const vivenciei = f.vivenciei || tema;

                        return [
                            `Alma, todos os sentimentos negativos que senti e que causaram ${causaram} acabaram!`,
                            `Alma, todos os sentimentos negativos que recebi e que causaram ${causaram} acabaram!`,
                            `Espírito, hereditariedade recebida de ${recebida} acabou!`,
                            `Espírito, condicionamento de manifestar ${manifestar} acabou!`,
                            `Espírito, crenças que causaram ${causaram} acabaram!`,
                            `Espírito, pensamentos que causaram ${causaram} acabaram!`,
                            `Espírito, todas as informações que geraram ${geraram} acabaram!`,
                            `Alma, todas as informações que geraram ${geraram} acabaram!`,
                            `Espírito, todas as informações geradas ${geradasPelaPelo} acabaram!`,
                            `Alma, todas as informações geradas ${geradasPelaPelo} acabaram!`,
                            `Espírito, todas as informações dos fatos nos quais vivenciei ${vivenciei} acabaram!`,
                            `Alma, todas as informações dos fatos nos quais vivenciei ${vivenciei} acabaram!`
                        ].join("\n");
                    }
                }
            } catch(e) {
                console.warn("Flexão de MGI via IA falhou, usando fallback direto:", e);
            }
        }

        // Fallback local com concordância simples
        const cleanT = tema.toLowerCase().trim();
        const prepPelaPelo = cleanT.startsWith("a ") || cleanT.startsWith("o ") ? `geradas ${cleanT}` : `geradas pela(o) ${cleanT}`;

        return [
            `Alma, todos os sentimentos negativos que senti e que causaram ${cleanT} acabaram!`,
            `Alma, todos os sentimentos negativos que recebi e que causaram ${cleanT} acabaram!`,
            `Espírito, hereditariedade recebida de ${cleanT} acabou!`,
            `Espírito, condicionamento de manifestar ${cleanT} acabou!`,
            `Espírito, crenças que causaram ${cleanT} acabaram!`,
            `Espírito, pensamentos que causaram ${cleanT} acabaram!`,
            `Espírito, todas as informações que geraram ${cleanT} acabaram!`,
            `Alma, todas as informações que geraram ${cleanT} acabaram!`,
            `Espírito, todas as informações ${prepPelaPelo} acabaram!`,
            `Alma, todas as informações ${prepPelaPelo} acabaram!`,
            `Espírito, todas as informações dos fatos nos quais vivenciei ${cleanT} acabaram!`,
            `Alma, todas as informações dos fatos nos quais vivenciei ${cleanT} acabaram!`
        ].join("\n");
    }

    // Editor Interativo de Fatos e Sentimentos (MFI)
    const AVAILABLE_SENTIMENTS = [
        "culpa", "injustiça", "dor", "tristeza", "solidão", "rejeição", "desaprovação", 
        "carência", "raiva", "ódio", "decepção", "incompetência", "incapacidade", 
        "inferioridade", "pressão", "invasão", "medo", "frustração", "insegurança", "angústia"
    ];

    function getCustomSentiments() {
        try {
            const stored = localStorage.getItem("innermap_custom_sentiments");
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCustomSentiment(newSentiment) {
        if (!newSentiment || !newSentiment.trim()) return;
        const s = newSentiment.trim().toLowerCase();
        const custom = getCustomSentiments();
        if (!custom.includes(s) && !AVAILABLE_SENTIMENTS.includes(s)) {
            custom.push(s);
            try {
                localStorage.setItem("innermap_custom_sentiments", JSON.stringify(custom));
            } catch(e) {}
        }
    }

    function renderFactsEditor() {
        const editorSection = document.getElementById("ai-mfi-editor-section");
        const listContainer = document.getElementById("ai-facts-list-container");
        if (!editorSection || !listContainer) return;

        if (!state.addedFacts || state.addedFacts.length === 0 || state.selectedMode === 3) {
            editorSection.style.display = "none";
            return;
        }

        editorSection.style.display = "block";
        listContainer.innerHTML = "";

        state.addedFacts.forEach((factObj, factIndex) => {
            const card = document.createElement("div");
            card.className = "fact-edit-card";

            const label = document.createElement("label");
            label.style.cssText = "display: block; font-size: 0.75rem; font-weight: 600; color: var(--color-primary); margin-bottom: 4px;";
            label.textContent = `Fato ${factIndex + 1} (editável):`;

            const input = document.createElement("input");
            input.type = "text";
            input.className = "fact-edit-input";
            input.value = factObj.phrase || "";
            input.placeholder = "Descreva o fato...";
            input.addEventListener("input", (e) => {
                state.addedFacts[factIndex].phrase = e.target.value.trim();
            });

            const sTitle = document.createElement("p");
            sTitle.style.cssText = "font-size: 0.73rem; color: var(--color-text-muted); margin: 0 0 6px 0;";
            sTitle.textContent = "Sentimentos marcados (clique para marcar/desmarcar):";

            const tagsContainer = document.createElement("div");
            tagsContainer.className = "sentiment-tags-container";

            const currentSentiments = (factObj.sentiments || []).map(s => s.toLowerCase());
            const customSentiments = getCustomSentiments();
            const allOptions = Array.from(new Set([...currentSentiments, ...customSentiments, ...AVAILABLE_SENTIMENTS]));

            allOptions.forEach(sentiment => {
                const isSelected = currentSentiments.includes(sentiment.toLowerCase());
                const tag = document.createElement("span");
                tag.className = `sentiment-tag-toggle ${isSelected ? "active" : ""}`;
                tag.innerHTML = `${isSelected ? "✓ " : "+ "}${sentiment}`;

                tag.addEventListener("click", () => {
                    const idx = state.addedFacts[factIndex].sentiments.findIndex(s => s.toLowerCase() === sentiment.toLowerCase());
                    if (idx >= 0) {
                        state.addedFacts[factIndex].sentiments.splice(idx, 1);
                        tag.classList.remove("active");
                        tag.innerHTML = `+ ${sentiment}`;
                    } else {
                        state.addedFacts[factIndex].sentiments.push(sentiment);
                        tag.classList.add("active");
                        tag.innerHTML = `✓ ${sentiment}`;
                    }
                });

                tagsContainer.appendChild(tag);
            });

            // Campo para Adicionar Sentimento Personalizado
            const customRow = document.createElement("div");
            customRow.style.cssText = "display: flex; gap: 6px; margin-top: 10px; align-items: center;";

            const customInput = document.createElement("input");
            customInput.type = "text";
            customInput.placeholder = "➕ Digite outro sentimento (ex: vergonha, desespero)...";
            customInput.style.cssText = "flex: 1; font-size: 0.78rem; padding: 6px 12px; border-radius: 12px; border: 1px solid var(--color-border); background: rgba(255,255,255,0.06); color: var(--color-text); outline: none;";

            const btnAddCustom = document.createElement("button");
            btnAddCustom.type = "button";
            btnAddCustom.textContent = "+ Adicionar Sentimento";
            btnAddCustom.style.cssText = "font-size: 0.78rem; padding: 6px 14px; border-radius: 12px; background: var(--color-primary); color: #000; font-weight: 600; border: none; cursor: pointer; white-space: nowrap;";

            const handleAddCustom = () => {
                const val = customInput.value.trim().toLowerCase();
                if (!val) {
                    showToast("Digite o nome do sentimento antes de adicionar.");
                    return;
                }
                saveCustomSentiment(val);
                if (!state.addedFacts[factIndex].sentiments.map(s => s.toLowerCase()).includes(val)) {
                    state.addedFacts[factIndex].sentiments.push(val);
                }
                showToast(`✨ Sentimento "${val}" adicionado à sua lista!`);
                renderFactsEditor();
            };

            btnAddCustom.addEventListener("click", handleAddCustom);
            customInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                }
            });

            customRow.appendChild(customInput);
            customRow.appendChild(btnAddCustom);

            card.appendChild(label);
            card.appendChild(input);
            card.appendChild(sTitle);
            card.appendChild(tagsContainer);
            card.appendChild(customRow);
            listContainer.appendChild(card);
        });
    }

    // Chips de Sugestões de Temas na Tela 1A
    const themeChips = document.querySelectorAll("#theme-suggestions-chips .sentiment-tag");
    themeChips.forEach(chip => {
        chip.addEventListener("click", () => {
            themeChips.forEach(c => c.classList.remove("selected"));
            chip.classList.add("selected");
            if (inputPhrase) {
                inputPhrase.value = chip.dataset.value;
            }
        });
    });

    if (btnLoginTrigger) {
        btnLoginTrigger.addEventListener("click", () => {
            showScreen("auth");
            const reorganizer = document.getElementById("reorganizer-tool");
            if (reorganizer) {
                reorganizer.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (btnHeroLogin) {
        btnHeroLogin.addEventListener("click", () => {
            showScreen("auth");
            const reorganizer = document.getElementById("reorganizer-tool");
            if (reorganizer) {
                reorganizer.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Lógica de Navegação e Transição dos Sub-Passos da Tela 1
    function switchSubStep(hideEl, showEl) {
        if (!hideEl || !showEl) return;
        hideEl.classList.remove("active");
        setTimeout(() => {
            hideEl.style.display = "none";
            showEl.style.display = "block";
            setTimeout(() => {
                showEl.classList.add("active");
            }, 50);
        }, 150);
    }

    // ==========================================================================
    // INTEGRAÇÃO COM GEMINI AI (ASSISTENTE DE SESSÃO)
    // ==========================================================================
    const btnRunAiAnalysis = document.getElementById("btn-run-ai-analysis");
    const aiSpinner = document.getElementById("ai-spinner");
    const aiExtractionSummary = document.getElementById("ai-extraction-summary");
    const summaryAiTema = document.getElementById("summary-ai-tema");
    const summaryAiFatos = document.getElementById("summary-ai-fatos");
    const summaryAiMdi = document.getElementById("summary-ai-mdi");
    const summaryAiMfpi = document.getElementById("summary-ai-mfpi");
    const btnAiConfirmWizard = document.getElementById("btn-ai-confirm-wizard");
    const btnAiConfirmGenerate = document.getElementById("btn-ai-confirm-generate");

    if (btnRunAiAnalysis && inputAiRelato) {
        btnRunAiAnalysis.addEventListener("click", async () => {
            let apiKey = state.apiKey || "";

            if (!apiKey) {
                try {
                    if (supabaseClient) {
                        const { data } = await supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single();
                        if (data && data.value) apiKey = data.value;
                    }
                } catch (e) {}
            }

            if (!apiKey) {
                apiKey = prompt("Por favor, insira sua chave de API Groq (gsk_...) ou Gemini:");
                if (!apiKey) return;
                state.apiKey = apiKey;
                localStorage.setItem("innermap_gemini_key", apiKey);
            }

            const relato = inputAiRelato.value.trim();
            if (!relato) {
                alert("Por favor, descreva seu relato ou objetivo para continuar.");
                return;
            }

            if (state.selectedMode === 4 && relato.length < 100) {
                alert(`Para a Reorganização Profunda, precisamos de um panorama completo da situação (mínimo de 100 caracteres). Por favor, conte um pouco mais sobre o que está acontecendo! (Atual: ${relato.length} caracteres)`);
                return;
            }

            btnRunAiAnalysis.disabled = true;
            if (aiSpinner) aiSpinner.style.display = "inline-block";
            btnRunAiAnalysis.innerHTML = '<span class="spinner" style="display: inline-block;"></span> Processando com IA...';

            try {
                const isGroq = apiKey.startsWith("gsk_");
                const isLegacyGemini = apiKey.startsWith("AIza");

                let prompt = "";
                if (state.selectedMode === 3) {
                    prompt = `Você é um psicoterapeuta sênior e especialista no Método Informacional (InnerMap).
O cliente solicita MOTIVAÇÃO, FOCO e FORTALECIMENTO DIRETO para o objetivo informado (modo rápido, sem foco em traumas passados).

Objetivo/Foco do Cliente:
"${relato}"

Retorne um objeto JSON válido no formato exato:
{
  "tema": "substantivo abstrato de foco (ex: Autoconfiança, Foco, Clareza, Serenidade)",
  "categoria": "Prosperidade, Trabalho, Relacionamentos ou Autoconhecimento",
  "fatos": [],
  "comportamentos": [],
  "ganhos_aparentes": [],
  "microacao": "orientação prática e fortalecedora para aplicar hoje",
  "reflexao": "mensagem encorajadora e acolhedora de 2-3 linhas celebrando o foco escolhido",
  "pergunta_aprofundamento": "uma única pergunta motivacional inspirando o cliente a visualizar o resultado"
}`;
                } else {
                    prompt = `Você é um psicoterapeuta sênior e especialista no Método Informacional (InnerMap).
Sua tarefa é analisar o relato bruto de um cliente e extrair os elementos estruturados do método, com sensibilidade e profundidade.

Definições de conceitos do método:
- TEMA: O assunto/categoria central, abstrato e atemporal. É o "rótulo" do problema. Não pode conter "quando" ou "com quem". Exemplos: Escassez, Timidez, Rejeição, Ansiedade, Medo de crescer.
- FATO (MFI): Recorte específico, datável e sintetizado.
  REGRAS OBRIGATÓRIAS DE SÍNTESE DO FATO:
  1. INTERPRETAR E RESOLVER AUTO-CORREÇÕES DO CLIENTE: Se o relato contiver hesitações ou correções do próprio cliente (ex: "era do meu pai, na verdade da minha mãe", "ou melhor...", "digo X"), INTERPRETE A CORREÇÃO E USE APENAS A CONCLUSÃO FINAL CORRIGIDA (ex: "repetir um comportamento da minha mãe"). NUNCA inclua frases de auto-correção cruas na frase do fato.
  2. FLUIDEZ E ENCAIXE EM DECRETOS: Escreva a frase do fato sem pronomes pessoais iniciais ("Eu"), usando infinitivo ou forma nominal para se encaixar com perfeita concordância gramatical nos decretos de liberação (ex: "repetir comportamento da mãe", "mãe ser agressiva na infância").
- COMPORTAMENTOS (MDI): Ações repetitivas involuntárias que o cliente faz para lidar com a queixa e o sentimento gerado por isso.
- GANHOS APARENTES (MFPI): Forças aparentes que o cliente acha positivas mas o aprisionam (ex: "ser forte o tempo todo", "resolver tudo sozinha").
- MICROAÇÃO: Orientação comportamental empática e prática, sob medida, para aplicar hoje na rotina.
- REFLEXAO: Uma frase empática e acolhedora (2-3 linhas) que resume o que você compreendeu da história do cliente.
- PERGUNTA_APROFUNDAMENTO: Uma única pergunta orgânica, fluida, acolhedora e profunda focada em CONSTATAR os desmembramentos e impactos reais do fato ou queixa relatada.
  REGRAS OBRIGATÓRIAS PARA A PERGUNTA:
  1. GRAMÁTICA E CONCORDÂNCIA IMPECÁVEIS: Escreva uma pergunta em português 100% natural e gramaticalmente perfeita (atenção rigorosa à concordância de gênero: "essa briga", "este conflito", "essa ausência"). NUNCA use modelos de frases prontas ou substituição mecânica de palavras.
  2. SEM HIPÓTESES ("SE"): JAMAIS pergunte cenários hipotéticos ou como a vida seria se o fato não tivesse acontecido (ex: NUNCA pergunte "como sua vida seria se...").
  3. POSTURA DE TERAPEUTA HUMANO: Formule a pergunta de forma personalizada com base no contexto específico trazido pelo cliente, investigando suavemente:
     - O que mais faltou na experiência vivida?
     - Em qual momento específico essa falta/dor foi mais sentida?
     - Ou se o cliente sente que culpa alguém por isso ou tenta compensar essa falta hoje.

Relato do Cliente:
"${relato}"

Retorne um objeto JSON válido contendo exatamente as chaves abaixo:
{
  "tema": "substantivo abstrato singular (ex: Escassez)",
  "categoria": "Prosperidade, Trabalho, Relacionamentos ou Autoconhecimento",
  "fatos": [
    {
      "phrase": "mãe/pai/esposa/etc. [ação ou característica]: [detalhe do que aconteceu]",
      "sentiments": ["lista de sentimentos em minúsculas de: culpa, injustiça, dor, tristeza, solidão, rejeição, desaprovação, carência, raiva, medo"]
    }
  ],
  "comportamentos": [
    {
      "behavior": "o que faz repetidamente",
      "sentiment": "sentimento associado"
    }
  ],
  "ganhos_aparentes": ["lista de ganhos aparentes / falsos positivos"],
  "microacao": "orientação comportamental prática baseada no relato",
  "reflexao": "frase empática de 2-3 linhas acolhendo o que foi ouvido",
  "pergunta_aprofundamento": "uma única pergunta natural, empática e fluida em português perfeito investigando os impactos reais do fato (sem frases prontas)"
}`;
                }

                let response;

                if (isGroq) {
                    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            response_format: { type: "json_object" },
                            messages: [{ role: "user", content: prompt }]
                        })
                    });
                } else {
                    const geminiUrl = isLegacyGemini
                        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`
                        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;
                    const geminiHeaders = { "Content-Type": "application/json" };
                    if (!isLegacyGemini) geminiHeaders["x-goog-api-key"] = apiKey;
                    response = await fetch(geminiUrl, {
                        method: "POST",
                        headers: geminiHeaders,
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: "application/json" }
                        })
                    });
                }

                if (!response.ok) {
                    let errBody = "";
                    try { errBody = await response.text(); } catch(e) {}
                    throw new Error(`Erro na API de IA [HTTP ${response.status}]: ${errBody || response.statusText}`);
                }

                const responseData = await response.json();

                // Extrai o texto da resposta (formato diferente entre Groq e Gemini)
                let textResponse;
                if (isGroq) {
                    textResponse = responseData.choices[0].message.content;
                } else {
                    textResponse = responseData.candidates[0].content.parts[0].text;
                }
                const aiData = JSON.parse(textResponse);
                console.log("Dados extraídos pela IA:", aiData);

                // Salvar o relato original para concordância com contexto de gênero
                state.relatoOriginal = relato;

                // Popular estado global com os dados extraídos
                state.tempTheme = aiData.tema;
                state.addedFacts = aiData.fatos || [];
                state.addedMdiBehaviors = aiData.comportamentos || [];
                state.hasMdiCondicional = state.addedMdiBehaviors.length > 0;
                state.addedPositivosAtrapalham = aiData.ganhos_aparentes || [];
                state.customLlmMicroaction = aiData.microacao;
                state.isHereditary = true;
                state.selectedLevel = "avancado";

                // Renderizar editor interativo de Fatos/Sentimentos (MFI)
                renderFactsEditor();

                // Mostrar tela de exploração (reflexão + pergunta)
                const subExplore = document.getElementById("sub-step-ai-explore");
                const subStep1a = document.getElementById("sub-step-1a");
                const elReflexao = document.getElementById("ai-reflexao");
                const elPergunta = document.getElementById("ai-pergunta");

                if (aiData.reflexao && elReflexao) elReflexao.textContent = aiData.reflexao;
                if (aiData.pergunta_aprofundamento && elPergunta) elPergunta.textContent = aiData.pergunta_aprofundamento;

                if (subStep1a) { subStep1a.style.display = "none"; subStep1a.classList.remove("active"); }
                if (subExplore) { subExplore.style.display = "block"; setTimeout(() => subExplore.classList.add("active"), 50); }

            } catch (err) {
                console.error("Erro na triagem por IA:", err);
                alert("Não foi possível realizar a triagem automática. Detalhe do erro: " + err.message);
            } finally {
                btnRunAiAnalysis.disabled = false;
                if (aiSpinner) aiSpinner.style.display = "none";
                btnRunAiAnalysis.innerHTML = "🪄 Descobrir Minha Reorganização Informacional";
            }
        });
    }

    // Lógica dos botões da tela de exploração AI
    const btnAiContinuar = document.getElementById("btn-ai-continuar");
    const btnAiPular = document.getElementById("btn-ai-pular");
    const inputAprofundamento = document.getElementById("input-ai-aprofundamento");
    const aiExploreSpinner = document.getElementById("ai-explore-spinner");

    function updateContinueButtonText() {
        if (!btnAiContinuar) return;
        const btnSpan = btnAiContinuar.querySelector("span:last-child") || btnAiContinuar;
        const hasText = inputAprofundamento && inputAprofundamento.value.trim().length > 0;
        const hasFacts = state.addedFacts && state.addedFacts.length > 0;

        if (hasText) {
            btnSpan.textContent = "Analisar resposta e gerar reorganização →";
        } else if (hasFacts) {
            btnSpan.textContent = "Gerar Reorganização com Fatos Mapeados →";
        } else {
            btnSpan.textContent = "Continuar com mais detalhes →";
        }
    }

    if (inputAprofundamento) {
        inputAprofundamento.addEventListener("input", updateContinueButtonText);
    }

    if (btnAiPular) {
        btnAiPular.addEventListener("click", () => {
            triggerFinalGeneration();
        });
    }

    if (btnAiContinuar) {
        btnAiContinuar.addEventListener("click", async () => {
            const respostaExtra = inputAprofundamento ? inputAprofundamento.value.trim() : "";

            if (respostaExtra) {
                // Segunda análise IA para mesclar fatos/sentimentos adicionais da resposta
                btnAiContinuar.disabled = true;
                if (aiExploreSpinner) aiExploreSpinner.style.display = "inline-block";
                const btnSpan = btnAiContinuar.querySelector("span:last-child");
                if (btnSpan) btnSpan.textContent = " Analisando resposta com IA...";

                try {
                    const contextoMerge = `O cliente já havia relatado: "${state.relatoOriginal || ""}"\n\nEle/ela também acrescentou em resposta a uma pergunta de aprofundamento: "${respostaExtra}"\n\nAdicione ao contexto anterior quaisquer novos fatos, sentimentos ou comportamentos que apareçam nesta resposta adicional.`;

                    const promptMerge = `Você é um psicoterapeuta sênior especialista no Método InnerMap. Com base no contexto abaixo, extraia APENAS os elementos NOVOS que não estavam no relato inicial.\n\n${contextoMerge}\n\nRetorne um objeto JSON com:\n{\n  "fatos_extras": [{"phrase": "...", "sentiments": ["..."]}],\n  "comportamentos_extras": [{"behavior": "...", "sentiment": "..."}],\n  "ganhos_aparentes_extras": ["..."],\n  "microacao_atualizada": "microação atualizada considerando ambos os relatos (ou null se não houver mudança)"\n}`;

                    let mergeResponse;
                    if (state.apiKey && state.apiKey.startsWith("gsk_")) {
                        mergeResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.apiKey}` },
                            body: JSON.stringify({ model: "llama-3.3-70b-versatile", response_format: { type: "json_object" }, messages: [{ role: "user", content: promptMerge }] })
                        });
                        if (mergeResponse.ok) {
                            const mergeData = await mergeResponse.json();
                            const merged = JSON.parse(mergeData.choices[0].message.content);
                            if (merged.fatos_extras) state.addedFacts = [...state.addedFacts, ...merged.fatos_extras];
                            if (merged.comportamentos_extras) { state.addedMdiBehaviors = [...state.addedMdiBehaviors, ...merged.comportamentos_extras]; state.hasMdiCondicional = state.addedMdiBehaviors.length > 0; }
                            if (merged.ganhos_aparentes_extras) state.addedPositivosAtrapalham = [...state.addedPositivosAtrapalham, ...merged.ganhos_aparentes_extras];
                            if (merged.microacao_atualizada) state.customLlmMicroaction = merged.microacao_atualizada;
                            state.relatoOriginal = (state.relatoOriginal || "") + " " + respostaExtra;
                        }
                    }
                } catch(e) {
                    console.warn("Merge de aprofundamento falhou, gerando com dados originais:", e);
                } finally {
                    btnAiContinuar.disabled = false;
                    if (aiExploreSpinner) aiExploreSpinner.style.display = "none";
                    updateContinueButtonText();
                }
            }

            // Prosseguir sempre para geração final (nunca travar!)
            triggerFinalGeneration();
        });
    }

    // Botão para extrair a resposta da pergunta de aprofundamento e adicionar aos fatos mapeados
    const btnAddAnswerFact = document.getElementById("btn-add-answer-fact");
    const addFactSpinner = document.getElementById("add-fact-spinner");

    if (btnAddAnswerFact) {
        btnAddAnswerFact.addEventListener("click", async () => {
            const resposta = inputAprofundamento ? inputAprofundamento.value.trim() : "";
            if (!resposta) {
                showToast("Escreva ou fale sua resposta antes de adicionar aos fatos.");
                return;
            }

            btnAddAnswerFact.disabled = true;
            if (addFactSpinner) addFactSpinner.style.display = "inline-block";

            try {
                let newFact = null;

                // Tentar extração via IA (Groq/Gemini)
                if (state.apiKey && state.apiKey.startsWith("gsk_")) {
                    const promptExtract = `Você é um psicoterapeuta sênior do Método InnerMap.
O cliente respondeu à pergunta de aprofundamento com: "${resposta}"
Relato anterior: "${state.relatoOriginal || ""}"

Extraia o FATO sintetizado dessa resposta e os SENTIMENTOS associados.
Regras do fato:
1. Frase sintetizada, sem pronomes "Eu" no início, pronta para se encaixar nos decretos de liberação (ex: "sentir dor intensa após o acidente").
2. Se o cliente se corrigiu (ex: "na verdade X"), use apenas a conclusão final.

Retorne JSON no formato exato:
{
  "phrase": "descrição concisa do fato",
  "sentiments": ["culpa", "dor", "tristeza", "raiva", "medo", "insegurança"]
}`;

                    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.apiKey}` },
                        body: JSON.stringify({ model: "llama-3.3-70b-versatile", response_format: { type: "json_object" }, messages: [{ role: "user", content: promptExtract }] })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const parsed = JSON.parse(data.choices[0].message.content);
                        if (parsed && parsed.phrase) {
                            newFact = { phrase: parsed.phrase, sentiments: parsed.sentiments || ["tristeza"] };
                        }
                    }
                }

                // Fallback local se IA não retornar
                if (!newFact) {
                    const text = resposta.toLowerCase();
                    const matchedSentiments = [];
                    const SENTIMENTS_LIST = ["culpa", "injustiça", "dor", "tristeza", "solidão", "rejeição", "desaprovação", "carência", "raiva", "ódio", "decepção", "incompetência", "incapacidade", "inferioridade", "pressão", "invasão", "medo", "frustração", "insegurança", "angústia"];
                    SENTIMENTS_LIST.forEach(s => {
                        if (text.includes(s)) matchedSentiments.push(s);
                    });
                    newFact = {
                        phrase: resposta,
                        sentiments: matchedSentiments.length > 0 ? matchedSentiments : ["dor", "tristeza"]
                    };
                }

                // Adicionar o novo fato à lista global do estado
                state.addedFacts.push(newFact);
                state.relatoOriginal = (state.relatoOriginal || "") + " " + resposta;

                // Exibir e re-renderizar o editor de fatos/sentimentos
                const mfiSection = document.getElementById("ai-mfi-editor-section");
                if (mfiSection) mfiSection.style.display = "block";

                renderFactsEditor();

                // Limpar textarea, atualizar botão de continuar e notificar usuário
                inputAprofundamento.value = "";
                updateContinueButtonText();
                showToast("✨ Novo fato adicionado aos Fatos e Sentimentos Mapeados!");

                // Rolar suavemente até o editor de fatos
                if (mfiSection) {
                    mfiSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }

            } catch (err) {
                console.error("Erro ao adicionar fato da resposta:", err);
                showToast("Erro ao processar a resposta. Tente novamente.");
            } finally {
                btnAddAnswerFact.disabled = false;
                if (addFactSpinner) addFactSpinner.style.display = "none";
                updateContinueButtonText();
            }
        });
    }





    // ==========================================================================
    // Geração de Decretos Final
    // ==========================================================================


    // ✨ Corrige concordância gramatical das frases usando a IA (Groq/Gemini)
    async function correctConcordance(rawText) {
        if (!state.apiKey || !rawText || !rawText.trim()) return rawText;
        try {
            const contextoGenero = state.relatoOriginal
                ? `\n\nContexto do relato original do cliente (use para inferir o gênero da pessoa e corrigir palavras entre parênteses como "pleno(a)", "seguro(a)", "criticado(a)" para a forma adequada):\n"${state.relatoOriginal.substring(0, 300)}"`
                : "";

            const prompt = `Você é um especialista em língua portuguesa. Corrija apenas a concordância gramatical e as preposições do texto abaixo. Regras:\n1. NÃO altere palavras, não parafraseie, não adicione nem remova frases.\n2. Ajuste concordância gramatical (gênero, número, preposições como "ao/à", "pelo/pela").\n3. Resolva palavras entre parênteses como "pleno(a)", "seguro(a)", "criticado(a)" escolhendo a forma correta de acordo com o gênero inferido do contexto.\n4. Retorne apenas o texto corrigido, sem explicações nem formatação extra.${contextoGenero}\n\nTexto a corrigir:\n${rawText}`;

            let response;
            if (state.apiKey.startsWith("gsk_")) {
                response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.apiKey}` },
                    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
                });
                if (!response.ok) return rawText;
                const data = await response.json();
                return data.choices[0].message.content.trim();
            } else {
                const isLegacy = state.apiKey.startsWith("AIza");
                const url = isLegacy
                    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${state.apiKey}`
                    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;
                const hdrs = { "Content-Type": "application/json" };
                if (!isLegacy) hdrs["x-goog-api-key"] = state.apiKey;
                response = await fetch(url, { method: "POST", headers: hdrs, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
                if (!response.ok) return rawText;
                const data = await response.json();
                return data.candidates[0].content.parts[0].text.trim();
            }
        } catch (e) {
            console.warn("Concordância IA falhou, usando texto original:", e);
            return rawText;
        }
    }

    function triggerFinalGeneration() {
        const inputAiRelato = document.getElementById("input-ai-relato");
        const phrase = state.tempTheme 
            || (typeof inputPhrase !== "undefined" && inputPhrase ? inputPhrase.value.trim() : "") 
            || (inputAiRelato ? inputAiRelato.value.trim() : "") 
            || "Autoconhecimento";
        
        if (btnSentimentSave) btnSentimentSave.disabled = true;
        if (btnGenerate) {
            btnGenerate.disabled = true;
            btnGenerate.innerHTML = '<span class="spinner"></span> Analisando padrões...';
        }
        
        setTimeout(async () => {
            try {
                const result = ReorganizationEngine.analyzeInput(phrase, state.isHereditary, state.hereditaryType, state.addedFacts, state.factDetail, state.selectedLevel, state.addedPositivosAtrapalham, state.hasMdiCondicional, state.addedMdiBehaviors);
                if (state.customLlmMicroaction) {
                    result.microacao = state.customLlmMicroaction;
                }

                // Aplicar correção de concordância gramatical com a IA
                if (result.declaracaoEspecifica) {
                    result.declaracaoEspecifica = await correctConcordance(result.declaracaoEspecifica);
                }
                if (result.declaracaoNaoEspecifica) {
                    result.declaracaoNaoEspecifica = await correctConcordance(result.declaracaoNaoEspecifica);
                }

                state.currentData = result;
                
                // Popula Tela 2 (Consciência)
                if (outputAjuste) outputAjuste.innerText = result.ajuste;
                if (outputMovimento) outputMovimento.innerText = result.movimento;
                
                // Popula Tela 3 (Práticas Guiadas)
                if (outputCategory) outputCategory.innerHTML = `<span class="category-pill">${result.categoryEmoji}</span>`;
                if (outputObjetivo) outputObjetivo.innerText = result.objetivo;
                
                const itemEspecifico = document.getElementById("item-especifico") || (outputEspecifico ? outputEspecifico.closest(".hqi-item") : null);
                if (!result.declaracaoEspecifica || result.declaracaoEspecifica.trim() === "") {
                    if (itemEspecifico) itemEspecifico.style.display = "none";
                } else {
                    if (itemEspecifico) itemEspecifico.style.display = "block";
                    if (outputEspecifico) outputEspecifico.innerText = result.declaracaoEspecifica;
                }

                if (outputNaoEspecifico) outputNaoEspecifico.innerText = result.declaracaoNaoEspecifica;
                
                // Renderizar MGI (Movimento Generativo Informacional - Modo 4)
                const itemMgi = document.getElementById("item-mgi");
                const outputMgi = document.getElementById("output-mgi");

                if (state.selectedMode === 4) {
                    const mgiCommands = await generateMgiCommands(result.tema || phrase);
                    result.mgi = mgiCommands;
                    if (itemMgi) itemMgi.style.display = "block";
                    if (outputMgi) outputMgi.innerText = mgiCommands;
                } else {
                    if (itemMgi) itemMgi.style.display = "none";
                    if (outputMgi) outputMgi.innerText = "";
                }

                const itemMicroacao = outputMicroacao ? outputMicroacao.closest(".hqi-item") : null;
                if (!result.microacao || result.microacao.trim() === "") {
                    if (itemMicroacao) itemMicroacao.style.display = "none";
                } else {
                    if (itemMicroacao) itemMicroacao.style.display = "block";
                    if (outputMicroacao) outputMicroacao.innerText = result.microacao;
                }
                
                showScreen("step3");
                startPracticeTimer();
            } catch (err) {
                console.error("Erro na geração final:", err);
                showToast("Erro ao gerar reorganização: " + err.message);
            } finally {
                if (btnGenerate) {
                    btnGenerate.disabled = false;
                    btnGenerate.innerText = "Gerar Ajustes Informacionais →";
                }
                if (btnSentimentSave) btnSentimentSave.disabled = false;
            }
        }, 1200);
    }

    function resetStep1Wizard() {
        state.isHereditary = true;
        state.hereditaryType = null;
        state.addedFacts = [];
        state.factDetail = "";
        state.tempTheme = "";
        state.tempPessoa = "";
        state.tempCaracteristicas = [];
        state.caractIdx = 0;
        state.triagemNaoSei = false;
        state.sentimentFactIdx = 0;
        state.addedPositivosAtrapalham = [];
        state.hasMdiCondicional = false;
        state.addedMdiBehaviors = [];
        state.customLlmMicroaction = null;
        state.selectedLevel = "avancado";
        
        const inputAiRelato = document.getElementById("input-ai-relato");
        if (inputAiRelato) inputAiRelato.value = "";
        
        if (subStep1a) {
            subStep1a.style.display = "block";
            subStep1a.classList.add("active");
        }
        const subExplore = document.getElementById("sub-step-ai-explore");
        if (subExplore) {
            subExplore.style.display = "none";
            subExplore.classList.remove("active");
        }
    }

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
            const customVal = inputRatingCustom ? inputRatingCustom.value.trim() : "";
            ratingValue = customVal ? customVal : "Outro";
        }

        const phraseText = state.tempTheme || state.relatoOriginal || (inputPhrase ? inputPhrase.value.trim() : "") || "Reorganização Informacional";

        state.addReorganization(phraseText, state.currentData, ratingValue);
        
        // Criar e salvar Agenda de 15 dias
        if (state.currentUser && state.currentData) {
            const agenda = {
                reorgId: Date.now().toString(),
                title: state.currentData.title,
                phrase: phraseText,
                command: state.currentData.declaracaoNaoEspecifica,
                microaction: state.currentData.microacao,
                startDate: new Date().toISOString(),
                ticks: {}
            };
            localStorage.setItem("active_agenda_" + state.currentUser.email, JSON.stringify(agenda));
            if (window.renderAgenda) window.renderAgenda();
        }

        ratingOptions.forEach(o => o.classList.remove("selected"));
        const defaultRating = document.querySelector('[data-value="Mais leve"]');
        if (defaultRating) defaultRating.classList.add("selected");
        selectedRating = "Mais leve";
        if (inputRatingCustom) {
            inputRatingCustom.style.display = "none";
            inputRatingCustom.value = "";
        }
        
        resetStep1Wizard();
        showScreen("step1");
        showToast("Processo salvo na sua biblioteca!");
    });

    // ==========================================================================
    // MÓDULO DE ÁUDIO (MEDIARECORDER + WHISPER AI + SÍNTESE DE VOZ)
    // ==========================================================================
    const VoiceManager = {
        isListening: false,
        activeInputId: null,
        activeRecognitionBtn: null,
        activeRecognition: null,
        mediaRecorder: null,
        audioChunks: [],
        speechSynthesis: window.speechSynthesis,
        currentUtterance: null,

        // 1. DITADO POR VOZ (MEDIARECORDER + WHISPER AI)
        toggleSpeechRecognition: async function(inputId, buttonEl) {
            const targetInput = document.getElementById(inputId);
            if (!targetInput) {
                console.warn("Input de destino não encontrado:", inputId);
                return;
            }

            // Se já estiver gravando neste mesmo botão, encerra a gravação e processa a transcrição
            if (this.isListening && this.activeRecognitionBtn === buttonEl) {
                await this.stopSpeechRecognition();
                return;
            }

            // Encerra qualquer gravação ativa anterior
            await this.stopSpeechRecognition();

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                showToast("⚠️ Gravador de áudio não suportado neste navegador.");
                return;
            }

            try {
                // Obter permissão nativa e stream de áudio do microfone
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                this.isListening = true;
                this.activeInputId = inputId;
                this.activeRecognitionBtn = buttonEl;
                this.audioChunks = [];

                buttonEl.classList.add("listening");
                buttonEl.innerHTML = "🔴";
                buttonEl.title = "Ouvindo... Clique para encerrar e converter em texto";
                showToast("🎤 Gravando áudio! Fale normalmente. Clique em 🔴 quando terminar.");

                // 1. Iniciar MediaRecorder para gravação nativa do áudio sem interrupções
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 
                                 (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
                
                const recorderOptions = mimeType ? { mimeType } : {};
                this.mediaRecorder = new MediaRecorder(stream, recorderOptions);

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        this.audioChunks.push(event.data);
                    }
                };

                this.mediaRecorder.start(250); // Fragmentos a cada 250ms

                // 2. Opcional: Digitação ao vivo via Web Speech API se suportado pelo navegador
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    try {
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'pt-BR';
                        recognition.continuous = true;
                        recognition.interimResults = true;

                        let baseText = targetInput.value ? targetInput.value.trim() + " " : "";

                        recognition.onresult = (event) => {
                            let spokenText = "";
                            for (let i = 0; i < event.results.length; i++) {
                                spokenText += event.results[i][0].transcript;
                            }
                            targetInput.value = baseText + spokenText;
                            targetInput.dispatchEvent(new Event("input", { bubbles: true }));
                        };

                        recognition.onerror = () => {};
                        recognition.onend = () => {
                            if (this.isListening && this.activeRecognition === recognition) {
                                try { recognition.start(); } catch(e) {}
                            }
                        };

                        recognition.start();
                        this.activeRecognition = recognition;
                    } catch(e) {}
                }

            } catch (micErr) {
                console.warn("Permissão de microfone negada ou erro ao iniciar:", micErr);
                showToast("⚠️ Permissão de microfone negada. Permita o microfone nas configurações do seu navegador.");
                this.stopSpeechRecognition();
            }
        },

        stopSpeechRecognition: async function() {
            if (!this.isListening && !this.mediaRecorder && !this.activeRecognition) return;

            const buttonEl = this.activeRecognitionBtn;
            const targetInput = document.getElementById(this.activeInputId);
            const initialText = targetInput ? targetInput.value.trim() : "";

            this.isListening = false;

            if (this.activeRecognition) {
                try { this.activeRecognition.abort(); } catch(e) {}
                this.activeRecognition = null;
            }

            if (buttonEl) {
                buttonEl.classList.remove("listening");
                buttonEl.innerHTML = "⏳";
                buttonEl.title = "Processando áudio...";
            }

            // Parar MediaRecorder e obter o áudio gravado
            let audioBlob = null;
            if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
                audioBlob = await new Promise(resolve => {
                    this.mediaRecorder.onstop = () => {
                        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
                        if (this.mediaRecorder.stream) {
                            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
                        }
                        resolve(blob);
                    };
                    this.mediaRecorder.stop();
                });
            }

            this.mediaRecorder = null;
            this.audioChunks = [];

            // Transcrever áudio via Groq Whisper API se houver chave configurada
            let apiKey = state.apiKey || localStorage.getItem("innermap_gemini_key") || "";
            if (!apiKey && supabaseClient) {
                try {
                    const { data } = await supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single();
                    if (data && data.value) apiKey = data.value;
                } catch(e) {}
            }

            if (audioBlob && audioBlob.size > 1000 && apiKey && apiKey.startsWith("gsk_")) {
                showToast("⏳ Transcrevendo áudio com IA Whisper...");
                try {
                    const formData = new FormData();
                    formData.append("file", audioBlob, "speech.webm");
                    formData.append("model", "whisper-large-v3-turbo");
                    formData.append("language", "pt");
                    formData.append("response_format", "json");

                    const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${apiKey}` },
                        body: formData
                    });

                    if (whisperRes.ok) {
                        const whisperData = await whisperRes.json();
                        if (whisperData.text && whisperData.text.trim()) {
                            const transcribed = whisperData.text.trim();
                            if (targetInput) {
                                if (transcribed.length >= initialText.length || !initialText) {
                                    targetInput.value = transcribed;
                                } else {
                                    targetInput.value = initialText + " " + transcribed;
                                }
                                targetInput.dispatchEvent(new Event("input", { bubbles: true }));
                            }
                            showToast("✨ Áudio transcrito com sucesso!");
                        }
                    }
                } catch (wErr) {
                    console.warn("Erro ao transcrever com Groq Whisper:", wErr);
                }
            } else if (audioBlob && audioBlob.size > 1000) {
                showToast("✅ Ditado concluído!");
            }

            if (buttonEl) {
                buttonEl.innerHTML = "🎤";
                buttonEl.title = "Ditado por voz";
            }

            this.activeRecognitionBtn = null;
            this.activeInputId = null;
        },

        currentRawText: "",
        currentCharOffset: 0,
        progressInterval: null,
        activeButtonEl: null,

        // 2. LEITURA POR VOZ (TEXT-TO-SPEECH)
        speakText: function(text, buttonEl) {
            if (!this.speechSynthesis) {
                showToast("Síntese de voz não disponível no navegador.");
                return;
            }

            if (this.speechSynthesis.speaking && buttonEl && buttonEl.classList.contains("speaking")) {
                this.stopSpeaking();
                return;
            }

            this.stopSpeaking();

            if (!text || !text.trim()) return;

            let cleanText = text.replace(/<[^>]*>/g, '').trim();

            // ✨ Prepend "Repita comigo por gentileza!" se não estiver presente (Requisito 2)
            if (!cleanText.toLowerCase().startsWith("repita comigo")) {
                cleanText = "Repita comigo por gentileza! " + cleanText;
            }

            this.currentRawText = cleanText;
            this.currentCharOffset = 0;
            this.activeButtonEl = buttonEl;

            this._speakFromOffset(0);
        },

        _speakFromOffset: function(offsetIndex) {
            if (!this.currentRawText) return;
            const textToSpeak = this.currentRawText.substring(offsetIndex);
            if (!textToSpeak.trim()) return;

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            const voices = this.speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') || voices.find(v => v.lang.startsWith('pt'));
            if (ptVoice) utterance.voice = ptVoice;

            // Rastrear progresso por caractere
            utterance.onboundary = (event) => {
                if (event.name === 'word' || event.charIndex !== undefined) {
                    this.currentCharOffset = offsetIndex + (event.charIndex || 0);
                    this.updatePlayerProgress();
                }
            };

            const btnEl = this.activeButtonEl;
            if (btnEl) {
                btnEl.classList.add("speaking");
                if (!btnEl.dataset.origHtml) btnEl.dataset.origHtml = btnEl.innerHTML;
                btnEl.innerHTML = "⏹️ Parar";

                utterance.onend = () => {
                    this.onAudioEnd();
                };

                utterance.onerror = () => {
                    this.onAudioEnd();
                };
            } else {
                utterance.onend = () => this.onAudioEnd();
                utterance.onerror = () => this.onAudioEnd();
            }

            this.currentUtterance = utterance;
            this.showFloatingPlayer();
            this.speechSynthesis.speak(utterance);
        },

        rewind10Seconds: function() {
            if (!this.speechSynthesis || !this.currentRawText) return;
            // Estima ~35 caracteres por 10 segundos de fala em velocidade 0.95
            const newOffset = Math.max(0, this.currentCharOffset - 35);
            this.currentCharOffset = newOffset;

            this.speechSynthesis.cancel();
            showToast("⏮️ Voltando 10 segundos...");
            setTimeout(() => {
                this._speakFromOffset(newOffset);
            }, 100);
        },

        togglePauseResume: function() {
            if (!this.speechSynthesis) return;
            const playIcon = document.getElementById("player-play-icon");
            const statusText = document.getElementById("player-status-text");

            if (this.speechSynthesis.speaking && !this.speechSynthesis.paused) {
                this.speechSynthesis.pause();
                if (playIcon) playIcon.textContent = "▶️";
                if (statusText) statusText.textContent = "⏸️ Em pausa";
                showToast("⏸️ Áudio pausado");
            } else if (this.speechSynthesis.paused) {
                this.speechSynthesis.resume();
                if (playIcon) playIcon.textContent = "⏸️";
                if (statusText) statusText.textContent = "🔊 Em execução (Repita comigo por gentileza)";
                showToast("▶️ Continuando leitura");
            }
        },

        showFloatingPlayer: function() {
            const player = document.getElementById("floating-audio-player");
            const playIcon = document.getElementById("player-play-icon");
            const statusText = document.getElementById("player-status-text");

            if (player) player.style.display = "block";
            if (playIcon) playIcon.textContent = "⏸️";
            if (statusText) statusText.textContent = "🔊 Em execução (Repita comigo por gentileza)";

            if (this.progressInterval) clearInterval(this.progressInterval);
            this.progressInterval = setInterval(() => this.updatePlayerProgress(), 300);
        },

        updatePlayerProgress: function() {
            const fill = document.getElementById("player-progress-fill");
            if (!fill || !this.currentRawText) return;
            const total = this.currentRawText.length;
            const current = this.currentCharOffset;
            const pct = Math.min(100, Math.max(0, (current / total) * 100));
            fill.style.width = `${pct}%`;
        },

        onAudioEnd: function() {
            this.currentUtterance = null;
            if (this.progressInterval) clearInterval(this.progressInterval);
            const fill = document.getElementById("player-progress-fill");
            if (fill) fill.style.width = "100%";

            if (this.activeButtonEl) {
                this.activeButtonEl.classList.remove("speaking");
                if (this.activeButtonEl.dataset.origHtml) {
                    this.activeButtonEl.innerHTML = this.activeButtonEl.dataset.origHtml;
                }
            }

            setTimeout(() => {
                const player = document.getElementById("floating-audio-player");
                if (player) player.style.display = "none";
                if (fill) fill.style.width = "0%";
            }, 800);
        },

        stopSpeaking: function() {
            if (this.speechSynthesis) {
                this.speechSynthesis.cancel();
            }
            if (this.progressInterval) clearInterval(this.progressInterval);
            document.querySelectorAll(".btn-tts-speak.speaking").forEach(btn => {
                btn.classList.remove("speaking");
                if (btn.dataset.origHtml) btn.innerHTML = btn.dataset.origHtml;
                else btn.innerHTML = "🔊 Ouvir";
            });
            this.currentUtterance = null;
            this.currentRawText = "";
            this.currentCharOffset = 0;
            this.activeButtonEl = null;
            const player = document.getElementById("floating-audio-player");
            if (player) player.style.display = "none";
        }
    };

    // Listeners do Player de Áudio Flutuante
    const btnPlayerRewind10 = document.getElementById("btn-player-rewind10");
    const btnPlayerTogglePause = document.getElementById("btn-player-toggle-pause");
    const btnPlayerStop = document.getElementById("btn-player-stop");

    if (btnPlayerRewind10) {
        btnPlayerRewind10.addEventListener("click", () => VoiceManager.rewind10Seconds());
    }
    if (btnPlayerTogglePause) {
        btnPlayerTogglePause.addEventListener("click", () => VoiceManager.togglePauseResume());
    }
    if (btnPlayerStop) {
        btnPlayerStop.addEventListener("click", () => VoiceManager.stopSpeaking());
    }

    // Event Delegation no documento para capturar cliques nos botões de Microfone e TTS em qualquer lugar da página
    document.addEventListener("click", (e) => {
        const micBtn = e.target.closest(".btn-mic-input");
        if (micBtn) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = micBtn.dataset.target;
            if (targetId) VoiceManager.toggleSpeechRecognition(targetId, micBtn);
            return;
        }

        const ttsBtn = e.target.closest(".btn-tts-speak");
        if (ttsBtn && ttsBtn.id !== "btn-tts-full-practice") {
            e.preventDefault();
            e.stopPropagation();
            const targetId = ttsBtn.dataset.target;
            if (targetId) {
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    VoiceManager.speakText(targetEl.innerText || targetEl.value, ttsBtn);
                }
            }
            return;
        }
    });

    // Botão de Prática Guiada Completa na Tela 3
    const btnTtsFullPractice = document.getElementById("btn-tts-full-practice");
    if (btnTtsFullPractice) {
        btnTtsFullPractice.addEventListener("click", () => {
            const elObj = document.getElementById("output-objetivo");
            const elDec = document.getElementById("output-declaracao");
            const elFort = document.getElementById("output-fortalecimento");
            const elMgi = document.getElementById("output-mgi");
            const elMic = document.getElementById("output-microacao");

            let fullText = "Iniciando Prática Guiada de Ajustes Informacionais. ";
            if (elObj && elObj.innerText) fullText += "Objetivo do Processo: " + elObj.innerText + ". ";
            if (elDec && elDec.innerText) fullText += "Liberação de Registros Específicos: " + elDec.innerText + ". ";
            if (elFort && elFort.innerText) fullText += "Liberação dos Não Específicos e Fortalecimento: " + elFort.innerText + ". ";
            if (elMgi && elMgi.innerText) fullText += "Movimento Generativo Informacional MGI: " + elMgi.innerText + ". ";
            if (elMic && elMic.innerText) fullText += "Prática Diária de Ação e Integração: " + elMic.innerText + ". ";

            VoiceManager.speakText(fullText, btnTtsFullPractice);
        });
    }

    // Helper: Mostrar tela específica com interceptações de autenticação e paywall
    function showScreen(screenId) {
        VoiceManager.stopSpeaking();
        VoiceManager.stopSpeechRecognition();

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
            if (state.currentUser && state.currentUser.role === "therapist") {
                // Acesso liberado
            } else {
                if (screens["paywall"]) screens["paywall"].classList.add("active");
                state.currentStep = 0;
                updateUserUI();
                return;
            }
        }

        if (screens[screenId]) {
            screens[screenId].classList.add("active");
            if (screenId.startsWith("step")) {
                state.currentStep = parseInt(screenId.replace("step", ""));
            } else {
                state.currentStep = 0;
            }
        }

        if (screenId === "therapist") {
            document.body.classList.add("mode-therapist");
        } else {
            document.body.classList.remove("mode-therapist");
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
            if (btnLoginTrigger) btnLoginTrigger.style.display = "none";
            if (btnHeroLogin) btnHeroLogin.style.display = "none";
            document.body.classList.add("user-logged-in");
            if (userEmailDisplay) userEmailDisplay.innerText = state.currentUser.email;
            
            // Controle de visibilidade do link de administrador
            if (navTherapist) {
                if (state.currentUser.role === "therapist") {
                    navTherapist.style.display = "inline-block";
                    if (mTherapist) mTherapist.style.display = "flex";
                } else {
                    navTherapist.style.display = "none";
                    if (mTherapist) mTherapist.style.display = "none";
                }
            }

            if (userStatusDisplay) {
                if (state.currentUser.role === "therapist") {
                    userStatusDisplay.innerText = "Terapeuta 🔑";
                    userStatusDisplay.style.background = "rgba(102, 252, 241, 0.15)";
                    userStatusDisplay.style.color = "var(--color-primary)";
                    userStatusDisplay.style.borderColor = "var(--color-primary)";
                } else if (state.subscription) {
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
                        const daysRemaining = Math.max(0, 7 - daysElapsed);
                        
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
            if (window.renderAgenda) window.renderAgenda();
            if (window.checkDailyReminder) window.checkDailyReminder();
        } else {
            userNavContainer.style.display = "none";
            if (btnLoginTrigger) btnLoginTrigger.style.display = "inline-flex";
            if (btnHeroLogin) btnHeroLogin.style.display = "inline-block";
            document.body.classList.remove("user-logged-in");
            if (navTherapist) navTherapist.style.display = "none";
            if (mTherapist) mTherapist.style.display = "none";
            const agendaContainer = document.getElementById("agenda-container");
            if (agendaContainer) agendaContainer.style.display = "none";
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
                    showToast("Código de convite ativado! Seus 7 dias de teste começaram agora. 🎉");
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
                            <p>${item.data.ajuste || 'Nenhum'}</p>
                        </div>
                        ${item.data && item.data.declaracaoEspecifica ? `
                        <div class="detail-section">
                            <strong>Liberação de Registros Específicos (1x na vida):</strong>
                            <p class="hqi-box" style="background: rgba(234, 67, 53, 0.03); border: 1px solid rgba(234, 67, 53, 0.1); border-radius: 6px; padding: 0.5rem; font-family: monospace; white-space: pre-wrap; font-size: 0.82rem;">${item.data.declaracaoEspecifica}</p>
                        </div>
                        ` : ''}
                        ${item.data && item.data.declaracaoNaoEspecifica ? `
                        <div class="detail-section">
                            <strong>Liberação dos Não Específicos (1x por dia / 15 dias):</strong>
                            <p class="hqi-box-fortify" style="background: rgba(102, 252, 241, 0.03); border: 1px solid rgba(102, 252, 241, 0.1); border-radius: 6px; padding: 0.5rem; font-family: monospace; white-space: pre-wrap; font-size: 0.82rem; color: var(--color-primary);">${item.data.declaracaoNaoEspecifica}</p>
                        </div>
                        ` : ''}
                        <div class="detail-section">
                            <strong>Ação de Integração:</strong>
                            <p class="action-box" style="background: rgba(255, 255, 255, 0.02); padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">🎯 ${item.data.microacao || 'Nenhuma'}</p>
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
                            contextBlock = `--- MEMÃ“RIA INTELIGENTE (Histórico relevante recuperado) ---\n`;
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

    // Verificar o status e a data de validade da assinatura de teste (trial de 7 dias)
    function checkSubscriptionStatus() {
        // Se o usuário for um terapeuta/admin, desativa o limite e o aviso de 7 dias de teste
        if (state.currentUser && state.currentUser.role === "therapist") {
            return true;
        }

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
            const daysRemaining = 7 - daysElapsed;
            
            if (daysRemaining <= 0) {
                alert("Seu período de teste de 7 dias acabou! Por favor, assine um plano para continuar.");
                state.saveSubscription(null);
                updateUserUI();
                showScreen("paywall");
                return false;
            } else if ([5, 3, 1].includes(daysRemaining)) {
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
                        // Redirecionar dependendo da assinatura sincronizada (ou se for terapeuta)
                        if (state.subscription || (state.currentUser && state.currentUser.role === "therapist")) {
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
                    showScreen((state.subscription || (state.currentUser && state.currentUser.role === "therapist")) ? "step1" : "paywall");
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
            } else if (!state.subscription && state.currentUser.role !== "therapist") {
                showScreen("paywall");
            } else {
                showScreen("step1");
            }
        }
    }

    // 🔐 Segurança: se após 3s nenhuma tela estiver visível, força auth
    setTimeout(() => {
        const anyActive = Object.values(screens).some(s => s && s.classList.contains("active"));
        if (!anyActive) {
            console.warn("Nenhuma tela ativa detectada após 3s — forçando tela de autenticação");
            if (screens["auth"]) screens["auth"].classList.add("active");
        }
    }, 3000);

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
    // SISTEMA ADMINISTRATIVO E PAINEL DO TERAPEUTA (MÃ‰TODO & CLIENTES)
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

            // 2. Calcular estatísticas filtrando apenas contas que são Clientes (role === 'client')
            const clientIds = new Set(profiles.filter(p => p.role === "client").map(p => p.id));
            const clientEmails = new Set(profiles.filter(p => p.role === "client").map(p => p.email));

            const totalClients = clientIds.size;
            
            const clientSubs = subs.filter(s => clientIds.has(s.user_id) || clientEmails.has(s.email) || clientEmails.has(s.user_id));
            const activeSubs = clientSubs.filter(s => s.active && (s.plan === "monthly" || s.plan === "yearly")).length;
            
            let activeTrials = 0;
            clientSubs.forEach(s => {
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
                    const daysRemaining = 7 - daysElapsed;
                    if (daysRemaining > 0) {
                        activeTrials++;
                    }
                }
            });

            const totalPractices = reorgs.filter(r => clientIds.has(r.user_id) || clientEmails.has(r.email) || clientEmails.has(r.user_id)).length;

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
                    const daysRemaining = Math.max(0, 7 - daysElapsed);
                    
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
                    <div style="font-weight: 500; font-size: 1rem; margin-bottom: 0.75rem; color: var(--color-text-main);">"${r.phrase}"</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.85rem; padding-bottom: 0.75rem; border-bottom: 1px dashed rgba(255,255,255,0.06);">
                        <div><strong style="color: var(--color-text-muted);">Padrão Ativado:</strong><br>${r.title}</div>
                        <div><strong style="color: var(--color-text-muted);">Sentimento Pós-Prática:</strong><br><span style="color: var(--color-primary);">${r.rating}</span></div>
                    </div>

                    <!-- Detalhes do Diagnóstico e Comandos Sugeridos -->
                    <div class="practice-details-section" style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem; background: rgba(255,255,255,0.01); padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04);">
                        ${r.data && r.data.declaracaoEspecifica ? `
                        <div>
                            <strong style="color: #EA4335; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">âš ï¸ Liberação Específica (1x na vida)</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(234, 67, 53, 0.03); border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 0.8rem; color: var(--color-text-main);">${r.data.declaracaoEspecifica}</p>
                        </div>
                        ` : ''}

                        ${r.data && r.data.declaracaoNaoEspecifica ? `
                        <div>
                            <strong style="color: var(--color-primary); font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">🔄 Liberação Não Específica (1x por dia / 15 dias)</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(102, 252, 241, 0.03); border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 0.8rem; color: var(--color-text-main);">${r.data.declaracaoNaoEspecifica}</p>
                        </div>
                        ` : ''}

                        ${r.data && r.data.microacao ? `
                        <div>
                            <strong style="color: var(--color-primary-glow); font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">💡 Microação & Sugestão de Melhoria</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(255, 255, 255, 0.02); border-radius: 4px; font-size: 0.8rem; color: var(--color-text-muted); white-space: pre-wrap;">${r.data.microacao}</p>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Botões de Ações do Terapeuta -->
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 0.75rem;">
                        <button class="btn btn-outline btn-edit-reorg" data-id="${r.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Editar Ajustes</button>
                        <button class="btn btn-text btn-delete-reorg" data-id="${r.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #EA4335;">Excluir</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // Adicionar event listeners para os botões de edição e exclusão
            container.querySelectorAll(".btn-edit-reorg").forEach(btn => {
                btn.addEventListener("click", () => {
                    const reorgId = btn.dataset.id;
                    openEditReorgModal(reorgId, email);
                });
            });

            container.querySelectorAll(".btn-delete-reorg").forEach(btn => {
                btn.addEventListener("click", () => {
                    const reorgId = btn.dataset.id;
                    deleteClientReorganization(reorgId, email, id);
                });
            });
        }

        modal.style.display = "flex";
    }

    function openEditReorgModal(reorgId, email) {
        const modal = document.getElementById("modal-edit-reorg");
        const clientLabel = document.getElementById("edit-reorg-client");
        const inputId = document.getElementById("edit-reorg-id");
        const inputPhrase = document.getElementById("edit-reorg-phrase");
        const textareaEspecifica = document.getElementById("edit-reorg-especifica");
        const textareaNaoEspecifica = document.getElementById("edit-reorg-nao-especifica");
        const textareaMicroacao = document.getElementById("edit-reorg-microacao");

        if (!modal || !clientLabel || !inputId || !inputPhrase || !textareaEspecifica || !textareaNaoEspecifica || !textareaMicroacao) return;

        const reorg = window.dashReorganizations.find(r => r.id === reorgId);
        if (!reorg) return;

        clientLabel.innerText = `Cliente: ${email}`;
        inputId.value = reorg.id;
        inputPhrase.value = reorg.phrase || "";
        textareaEspecifica.value = (reorg.data && reorg.data.declaracaoEspecifica) ? reorg.data.declaracaoEspecifica : "";
        textareaNaoEspecifica.value = (reorg.data && reorg.data.declaracaoNaoEspecifica) ? reorg.data.declaracaoNaoEspecifica : "";
        textareaMicroacao.value = (reorg.data && reorg.data.microacao) ? reorg.data.microacao : "";

        modal.style.display = "flex";
    }

    async function deleteClientReorganization(reorgId, email, clientId) {
        if (!confirm("Tem certeza que deseja excluir esta prática do histórico do cliente permanentemente?")) return;

        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from("reorganizations").delete().eq("id", reorgId);
                if (error) {
                    showToast("Erro ao excluir do Supabase: " + error.message);
                    return;
                }
            } catch (err) {
                console.error(err);
                showToast("Erro crítico ao excluir.");
                return;
            }
        }

        // Remover do escopo local
        window.dashReorganizations = window.dashReorganizations.filter(r => r.id !== reorgId);
        showToast("Prática excluída com sucesso!");
        
        // Re-renderizar o histórico e a lista
        openClientDetailsModal(email, clientId);
        loadTherapistDashboardData();
    }

    // Fechar e Submeter Modal de Edição de Reorganização
    const btnCloseEditReorg = document.getElementById("btn-close-edit-reorg");
    const btnCancelEditReorg = document.getElementById("btn-cancel-edit-reorg");
    const modalEditReorg = document.getElementById("modal-edit-reorg");
    const formEditReorg = document.getElementById("form-edit-reorg");

    if (btnCloseEditReorg) btnCloseEditReorg.addEventListener("click", () => modalEditReorg.style.display = "none");
    if (btnCancelEditReorg) btnCancelEditReorg.addEventListener("click", () => modalEditReorg.style.display = "none");

    if (formEditReorg) {
        formEditReorg.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const reorgId = document.getElementById("edit-reorg-id").value;
            const newPhrase = document.getElementById("edit-reorg-phrase").value.trim();
            const newEspecifica = document.getElementById("edit-reorg-especifica").value.trim();
            const newNaoEspecifica = document.getElementById("edit-reorg-nao-especifica").value.trim();
            const newMicroacao = document.getElementById("edit-reorg-microacao").value.trim();

            const reorg = window.dashReorganizations.find(r => r.id === reorgId);
            if (!reorg) return;

            // Criar objeto data atualizado
            const updatedData = {
                ...reorg.data,
                declaracaoEspecifica: newEspecifica,
                declaracaoNaoEspecifica: newNaoEspecifica,
                microacao: newMicroacao
            };

            if (supabaseClient) {
                try {
                    const { error } = await supabaseClient
                        .from("reorganizations")
                        .update({
                            phrase: newPhrase,
                            data: updatedData
                        })
                        .eq("id", reorgId);

                    if (error) {
                        showToast("Erro ao salvar alterações no Supabase: " + error.message);
                        return;
                    }
                } catch (err) {
                    console.error(err);
                    showToast("Erro crítico ao salvar alterações.");
                    return;
                }
            }

            // Atualizar no escopo local
            reorg.phrase = newPhrase;
            reorg.data = updatedData;

            showToast("Ajustes atualizados com sucesso!");
            modalEditReorg.style.display = "none";

            // Atualizar modal de histórico e estatísticas
            openClientDetailsModal(reorg.email, reorg.user_id);
            loadTherapistDashboardData();
        });
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
    const btnBackToApp = document.getElementById("btn-back-to-app");
    if (btnBackToApp) {
        btnBackToApp.addEventListener("click", () => {
            switchTab(navApp, sectionApp);
            showScreen("step1");
        });
    }

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

    // ==========================================================================
    // Lógica da Agenda de Exercícios Diários (15 dias)
    // ==========================================================================
    function renderAgenda() {
        const agendaContainer = document.getElementById("agenda-container");
        const emptyPlaceholder = document.getElementById("agenda-empty-placeholder");
        if (!agendaContainer) return;

        if (!state.currentUser) {
            agendaContainer.style.display = "none";
            if (emptyPlaceholder) emptyPlaceholder.style.display = "block";
            return;
        }

        const emailKey = state.currentUser.email;
        const agendaDataRaw = localStorage.getItem("active_agenda_" + emailKey);
        if (!agendaDataRaw) {
            agendaContainer.style.display = "none";
            if (emptyPlaceholder) emptyPlaceholder.style.display = "block";
            return;
        }

        let agenda;
        try {
            agenda = JSON.parse(agendaDataRaw);
        } catch (e) {
            agendaContainer.style.display = "none";
            if (emptyPlaceholder) emptyPlaceholder.style.display = "block";
            return;
        }

        // Se existe uma agenda ativa, esconde o placeholder e exibe a agenda
        if (emptyPlaceholder) emptyPlaceholder.style.display = "none";
        agendaContainer.style.display = "block";

        // Popula as informações da agenda
        const agendaTitle = document.getElementById("agenda-title");
        const agendaCommand = document.getElementById("agenda-command");
        const agendaMicroaction = document.getElementById("agenda-microaction");
        
        if (agendaTitle) agendaTitle.innerText = `"${agenda.phrase}" (${agenda.title})`;
        if (agendaCommand) agendaCommand.innerText = agenda.command;
        if (agendaMicroaction) agendaMicroaction.innerText = agenda.microaction;

        // Renderiza o grid de 15 dias
        const grid = document.getElementById("agenda-calendar-grid");
        if (grid) {
            grid.innerHTML = "";

            for (let day = 1; day <= 15; day++) {
                const btn = document.createElement("button");
                btn.className = "agenda-day-btn";
                btn.type = "button";
                btn.innerText = `D${day}`;
                
                if (agenda.ticks && agenda.ticks[day]) {
                    btn.classList.add("completed");
                    btn.innerHTML = `D${day} âœ“`;
                }

                btn.addEventListener("click", () => {
                    if (!agenda.ticks) agenda.ticks = {};
                    agenda.ticks[day] = !agenda.ticks[day];
                    
                    // Salvar ticks
                    localStorage.setItem("active_agenda_" + emailKey, JSON.stringify(agenda));
                    renderAgenda();

                    // Mostrar mensagem de incentivo
                    if (agenda.ticks[day]) {
                        showToast(`Dia ${day} concluído com sucesso! Ã“timo trabalho!`);
                        
                        // Se concluiu todos os 15 dias, parabenizar!
                        let allDone = true;
                        for (let d = 1; d <= 15; d++) {
                            if (!agenda.ticks[d]) {
                                allDone = false;
                                break;
                            }
                        }
                        if (allDone) {
                            showToast("🎉 Parabéns! Você completou o ciclo de 15 dias de reprogramação!");
                        }
                    }
                });

                grid.appendChild(btn);
            }
        }

        agendaContainer.style.display = "block";
    }

    function checkDailyReminder() {
        if (!state.currentUser) return;
        const enabled = localStorage.getItem("reminders_enabled") === "true";
        if (!enabled) return;

        const emailKey = state.currentUser.email;
        const agendaDataRaw = localStorage.getItem("active_agenda_" + emailKey);
        if (!agendaDataRaw) return;

        try {
            const agenda = JSON.parse(agendaDataRaw);
            const startDate = new Date(agenda.startDate);
            const diffTime = new Date() - startDate;
            const currentDay = Math.min(15, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

            // Se o dia atual da prática ainda não foi marcado como completo
            if (!agenda.ticks || !agenda.ticks[currentDay]) {
                // Verificar se já mostramos lembrete hoje para não fludar
                const lastReminderStr = localStorage.getItem("last_reminder_date_" + emailKey);
                const todayStr = new Date().toDateString();
                if (lastReminderStr !== todayStr) {
                    localStorage.setItem("last_reminder_date_" + emailKey, todayStr);
                    
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("InnerMap: Exercício de Hoje", {
                            body: `Dia ${currentDay} da sua reprogramação: "${agenda.phrase}". Realize o comando diário e sua microação!`,
                            icon: "favicon.ico"
                        });
                    } else {
                        showToast(`📌 Lembrete: Dia ${currentDay} da sua reprogramação está pendente. Pratique hoje!`);
                    }
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    // Inicialização do botão de Lembretes
    const btnToggleReminders = document.getElementById("btn-toggle-reminders");
    if (btnToggleReminders) {
        const updateRemindersBtnUI = () => {
            const enabled = localStorage.getItem("reminders_enabled") === "true";
            if (enabled) {
                btnToggleReminders.className = "btn btn-outline active";
                btnToggleReminders.innerHTML = `<span>🔕 Desativar Lembretes</span>`;
                btnToggleReminders.style.borderColor = "var(--color-primary)";
                btnToggleReminders.style.color = "var(--color-primary)";
            } else {
                btnToggleReminders.className = "btn btn-outline";
                btnToggleReminders.innerHTML = `<span>🔔 Ativar Lembretes</span>`;
                btnToggleReminders.style.borderColor = "var(--color-border)";
                btnToggleReminders.style.color = "var(--color-text-muted)";
            }
        };

        btnToggleReminders.addEventListener("click", async () => {
            const enabled = localStorage.getItem("reminders_enabled") === "true";
            if (!enabled) {
                if ("Notification" in window) {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        localStorage.setItem("reminders_enabled", "true");
                        showToast("Notificações ativadas com sucesso!");
                        new Notification("InnerMap", {
                            body: "Você receberá lembretes diários para realizar seus exercícios informacionais.",
                            icon: "favicon.ico"
                        });
                    } else {
                        showToast("Permissão de notificação negada pelo navegador.");
                    }
                } else {
                    showToast("Este navegador não suporta notificações de área de trabalho.");
                }
            } else {
                localStorage.setItem("reminders_enabled", "false");
                showToast("Lembretes diários desativados.");
            }
            updateRemindersBtnUI();
        });

        updateRemindersBtnUI();
    }

    // Expõe para uso em outros handlers
    window.renderAgenda = renderAgenda;
    window.checkDailyReminder = checkDailyReminder;
});
