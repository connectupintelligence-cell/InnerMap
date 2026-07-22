// Global Error Debugging Handler
window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = `Erro JavaScript: ${message}\nFonte: ${source}:${lineno}:${colno}`;
    console.error(errorMsg);
    alert(errorMsg);
    return false;
};

window.appLoaded = true;

/**
 * InnerMap - Motor de ReorganizaÃ§Ã£o Informacional
 * Core Logic, State Management & Supabase Backend Integration
 */

// ==========================================================================
// CONFIGURAÃ‡ÃƒO DO SUPABASE (BANCO DE DADOS & AUTH REMOTO)
// ==========================================================================
// Insira as chaves do seu projeto do Supabase aqui para ativar o login real com Google
// e sincronizaÃ§Ã£o das reorganizaÃ§Ãµes na nuvem de forma 100% gratuita e sem servidor.
// Caso fiquem vazias, o aplicativo entrarÃ¡ em modo de simulaÃ§Ã£o local automÃ¡tica.
const SUPABASE_URL = "https://vyhwpjktsdvfnwvvjnbh.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_vfK43gvWRToO8gR9cd9ttA_dzDrAqHI";

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client inicializado com sucesso!");
    } catch (err) {
        console.error("Erro de inicializaÃ§Ã£o do Supabase:", err);
    }
}
// ==========================================================================
// CONFIGURAÃ‡ÃƒO DO INFINITEPAY (GATEWAY DE PAGAMENTOS)
// ==========================================================================
// Insira sua InfiniteTag (sem o @) para gerar cobranÃ§as dinÃ¢micas via API.
// Caso queira usar links estÃ¡ticos diretos gerados no app, preencha-os abaixo.
const INFINITEPAY_TAG = "connectup"; // Ex: "wavequantum"
const INFINITEPAY_LINK_MONTHLY = "https://link.infinitepay.io/connectup/VC1DLUMtSQ-GaCy6VClhl-49,90"; // Opcional: Link estÃ¡tico mensal (R$ 49,90)
const INFINITEPAY_LINK_YEARLY = "https://link.infinitepay.io/connectup/VC1DLUMtSQ-n9UsJS7UiU-478,80"; // Opcional: Link estÃ¡tico anual (R$ 478,80)

// Banco de dados de padrÃµes predefinidos para o motor de conteÃºdo
const INFORMATIONAL_DATABASE = {
    "medo_crescer": {
        keywords: ["crescer", "sucesso", "expandir", "escala", "tamanho", "responsabilidade", "lideranÃ§a", "crescimento"],
        category: "Trabalho",
        categoryEmoji: "ðŸ“ Trabalho",
        title: "Medo de Crescer",
        ajuste: "VocÃª pode estar associando crescimento a sobrecarga de responsabilidade, perda de liberdade ou solidÃ£o.",
        movimento: "Desenvolver uma expansÃ£o sustentÃ¡vel, delegando com confianÃ§a e acolhendo novas oportunidades.",
        objetivo: "Crescer de forma leve, segura e alinhada.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, receio e comportamentos de medo de crescer, autossabotagem e medo da sobrecarga que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\nEspÃ­rito, pensamentos de que crescer Ã© arriscado ou perigoso que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, inseguranÃ§a que senti ao encarar novas responsabilidades e crescimento nos negÃ³cios acabaram!\nAlma, todos os sentimentos que senti em relaÃ§Ã£o ao medo de crescer acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi sobre crescer acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei sobre crescer acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho acolher a expansÃ£o com seguranÃ§a, leveza e consistÃªncia.\nAlma, eu jÃ¡ construo crescimento seguro e delego tarefas com total tranquilidade e merecimento.",
        pergunta: "Qual o menor passo de crescimento que vocÃª pode dar hoje que nÃ£o assuste sua percepÃ§Ã£o racional?",
        microacao: "Escrever uma meta de crescimento para o prÃ³ximo mÃªs e listar duas tarefas que vocÃª pode delegar ou simplificar."
    },
    "culpa_descansar": {
        keywords: ["descansar", "pausa", "parar", "lazer", "tempo livre", "Ã³cio", "dormir", "fÃ©rias", "descanso"],
        category: "Prosperidade",
        categoryEmoji: "ðŸ“ Prosperidade",
        title: "Culpa por Descansar",
        ajuste: "A percepÃ§Ã£o de que seu valor pessoal depende exclusivamente do seu nÃ­vel de produtividade diÃ¡ria.",
        movimento: "Reconhecer que a pausa Ã© essencial para a criatividade e a sustentabilidade de suas realizaÃ§Ãµes.",
        objetivo: "Descansar sem culpa e com paz interna profunda.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos e crenÃ§as de que preciso trabalhar em esforÃ§o extremo para ter valor que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, culpa que senti ao parar para descansar e relaxar acabaram!\nAlma, ansiedade que senti ao ter tempo livre acabaram!\nAlma, todos os sentimentos de culpa por descansar acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi sobre descansar acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei sobre descansar acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho silenciar minha mente e restabelecer minha energia vital.\nAlma, eu jÃ¡ descanso com tranquilidade e paz, reconhecendo que a pausa potencializa minha prosperidade.",
        pergunta: "O que vocÃª estaria evitando encarar se decidisse silenciar e descansar agora?",
        microacao: "Bloquear 30 minutos na sua agenda hoje para fazer algo puramente por lazer, sem fins produtivos."
    },
    "dificuldade_vender": {
        keywords: ["vender", "vendas", "cobrar", "preÃ§o", "dinheiro", "cliente", "oferta", "negociar", "pedir valor"],
        category: "Trabalho",
        categoryEmoji: "ðŸ“ Trabalho",
        title: "Dificuldade de Vender ou Cobrar",
        ajuste: "A associaÃ§Ã£o da venda e da cobranÃ§a a importunar os outros, medo da rejeiÃ§Ã£o ou sensaÃ§Ã£o sutil de nÃ£o merecimento.",
        movimento: "Enxergar a venda como uma troca justa de valor, onde vocÃª apoia genuinamente a resoluÃ§Ã£o de uma necessidade real.",
        objetivo: "Fluidez, valorizaÃ§Ã£o e seguranÃ§a na entrega de suas soluÃ§Ãµes.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos e receios de cobrar pelo meu valor ou oferecer meus produtos que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, vergonha que senti ao falar de preÃ§os ou vender acabaram!\nAlma, rejeiÃ§Ã£o que senti quando clientes disseram nÃ£o acabaram!\nAlma, todos os sentimentos de dificuldade de vender e cobrar acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi sobre vendas acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei sobre vendas acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho ver a venda como uma troca justa de valor e auxÃ­lio mÃºtuo.\nAlma, eu jÃ¡ recebo dinheiro com fluidez, merecimento e autoconfianÃ§a plena em minha entrega.",
        pergunta: "Se o seu produto ou serviÃ§o pudesse transformar positivamente a vida de alguÃ©m hoje, vocÃª ainda teria vergonha de oferecÃª-lo?",
        microacao: "Enviar uma mensagem para um cliente antigo perguntando como ele estÃ¡ ou fazer uma oferta direta para um potencial cliente."
    },
    "medo_negocios": {
        keywords: ["medo nos negÃ³cios", "errar", "falhar", "quebrar", "falÃªncia", "empreender", "risco", "perder dinheiro", "decisÃ£o"],
        category: "Coragem",
        categoryEmoji: "ðŸ“ Coragem",
        title: "Medo de Errar ou Falhar nos NegÃ³cios",
        ajuste: "O receio do fracasso ou da perda de controle organizando suas decisÃµes sob um viÃ©s de paralisaÃ§Ã£o e autoproteÃ§Ã£o.",
        movimento: "Compreender cada resultado como um feedback de aprendizado, fortalecendo sua capacidade de resposta e adaptaÃ§Ã£o.",
        objetivo: "DecisÃ£o consciente, resiliÃªncia e clareza profissional.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos e receio de perder o controle e falhar nos negÃ³cios que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\nEspÃ­rito, pensamentos de falÃªncia e quebra nos negÃ³cios que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, medo que senti de errar in decisÃµes de negÃ³cios acabaram!\nAlma, frustraÃ§Ã£o que senti com resultados insatisfatÃ³rios acabaram!\nAlma, todos os sentimentos de inseguranÃ§a e medo de falhar nos negÃ³cios acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi nos negÃ³cios acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei nos negÃ³cios acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho focar em soluÃ§Ãµes estratÃ©gicas, aprendizado constante e resiliÃªncia.\nAlma, eu jÃ¡ decido com clareza profissional, guiando meus negÃ³cios rumo Ã  solidez e prosperidade.",
        pergunta: "Qual decisÃ£o importante vocÃª estÃ¡ adiando ou evitando por medo do que pode acontecer depois?",
        microacao: "Tomar hoje uma decisÃ£o simples que vocÃª vem adiando nos Ãºltimos 7 dias."
    },
    "carencia_emocional": {
        keywords: ["carÃªncia", "abandono", "rejeiÃ§Ã£o", "solteiro", "solidÃ£o", "ciÃºmes", "dependÃªncia", "relacionamento", "amor", "parceiro", "carÃªncia emocional"],
        category: "Relacionamentos",
        categoryEmoji: "ðŸ“ Relacionamentos",
        title: "CarÃªncia e DependÃªncia Emocional",
        ajuste: "A busca externa pela validaÃ§Ã£o, seguranÃ§a e afeto que vocÃª sente faltar em sua prÃ³pria organizaÃ§Ã£o interna.",
        movimento: "Fortalecer seu autocuidado e acolhimento interno, construindo sua prÃ³pria base de seguranÃ§a afetiva.",
        objetivo: "Autonomia afetiva, amor-prÃ³prio e conexÃµes saudÃ¡veis.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos de dependÃªncia afetiva e medo da solidÃ£o que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, carÃªncia que senti pela falta de atenÃ§Ã£o ou afeto acabaram!\nAlma, abandono que senti em meus relacionamentos antigos acabaram!\nAlma, todos os sentimentos de carÃªncia e solidÃ£o acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi em minhas relaÃ§Ãµes acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei em minhas relaÃ§Ãµes acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho nutrir meu amor-prÃ³prio e encontrar estabilidade dentro de mim.\nAlma, eu jÃ¡ me sinto pleno(a) e seguro(a), me relacionando com liberdade e maturidade emocional.",
        pergunta: "Que tipo de atenÃ§Ã£o ou validaÃ§Ã£o vocÃª estÃ¡ esperando dos outros que vocÃª mesmo(a) nÃ£o estÃ¡ se dando?",
        microacao: "Escrever uma pequena lista com 3 qualidades reais suas ou preparar um momento especial de autocuidado hoje."
    },
    "medo_julgamento": {
        keywords: ["julgamento", "crÃ­tica", "opiniÃ£o", "exposiÃ§Ã£o", "falar em pÃºblico", "vergonha", "timidez", "esconder", "aparÃªncia"],
        category: "Autoestima",
        categoryEmoji: "ðŸ“ Autoestima",
        title: "Medo do Julgamento e da CrÃ­tica",
        ajuste: "A necessidade de aprovaÃ§Ã£o externa atuando como um filtro limitador da sua expressÃ£o e do seu potencial autÃªntico.",
        movimento: "Acolher sua verdade interna e compreender que a percepÃ§Ã£o do outro reflete a realidade dele, nÃ£o o seu valor real.",
        objetivo: "Liberdade de expressÃ£o e seguranÃ§a pessoal profunda.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos de autoanulaÃ§Ã£o e vergonha de me expor que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\nEspÃ­rito, pensamentos de desaprovaÃ§Ã£o e crÃ­ticas dos outros que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, inseguranÃ§a que senti ao falar em pÃºblico ou me expor acabaram!\nAlma, rejeiÃ§Ã£o que senti quando fui criticado(a) acabaram!\nAlma, todos os sentimentos de medo do julgamento alheio acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi da opiniÃ£o pÃºblica acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei sobre me expressar acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho expressar minha verdade interna com liberdade e seguranÃ§a.\nAlma, eu jÃ¡ me exponho com autovalorizaÃ§Ã£o e reconheÃ§o o real valor de minha prÃ³pria voz.",
        pergunta: "O que vocÃª comeÃ§aria a criar ou fazer hoje mesmo se soubesse que nÃ£o seria criticado ou julgado?",
        microacao: "Expressar uma opiniÃ£o autÃªntica ou compartilhar um pensamento pessoal com alguÃ©m de confianÃ§a."
    },
    "sobrecarga_cansaco": {
        keywords: ["cansaÃ§o", "cansado", "esgotado", "sobrecarga", "estresse", "ansiedade", "energia", "vitalidade", "corpo", "limite"],
        category: "SaÃºde emocional",
        categoryEmoji: "ðŸ“ SaÃºde emocional",
        title: "Sobrecarga e Falta de Energia",
        ajuste: "Assumir responsabilidades e demandas que nÃ£o sÃ£o suas como uma forma inconsciente de buscar utilidade ou aceitaÃ§Ã£o.",
        movimento: "Estabelecer limites claros e saudÃ¡veis, preservando seu estado interno e sua energia para o que Ã© essencial.",
        objetivo: "EquilÃ­brio emocional, leveza e clareza de prioridades pessoais.",
        declaracao: "1 - Movimento SistÃªmico Informacional - MSI\nAlma, comportamentos de assumir cargas alheias e dificuldade de dizer nÃ£o que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n\n2 - Movimento Factual Informacional - MFI\nAlma, cansaÃ§o e pressÃ£o que senti por excesso de responsabilidades acabaram!\nAlma, invasÃ£o que senti ao ter meus limites desrespeitados acabaram!\nAlma, todos os sentimentos de sobrecarga e esgotamento acabaram!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que recebi por carregar pesos alheios acabou!\nEspÃ­rito, todas as informaÃ§Ãµes negativas que gerei no excesso de tarefas acabou!",
        fortalecimento: "3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\nEspÃ­rito, minha consciÃªncia escolhe, eu escolho respeitar os limites do meu corpo e priorizar meu bem-estar.\nAlma, eu jÃ¡ estabeleÃ§o limites saudÃ¡veis e gerencio minhas responsabilidades com total leveza.",
        pergunta: "De quem Ã© a responsabilidade que vocÃª estÃ¡ carregando hoje alÃ©m da sua prÃ³pria?",
        microacao: "Dizer um 'nÃ£o' gentil, mas firme, a uma tarefa secundÃ¡ria que nÃ£o seja de sua real responsabilidade."
    }
};

// ==========================================================================
// LÃ³gica de embeddings matemÃ¡ticos e RAG no Frontend (Simulador)
// ==========================================================================

// FunÃ§Ã£o geradora de embeddings normatizados de 1536 dimensÃµes (baseado no caractere hash)
function generateMockEmbedding(phrase) {
    const text = phrase.toLowerCase().trim();
    // Gerar semente determinÃ­stica baseado nas letras do texto
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const vector = [];
    for (let i = 0; i < 1536; i++) {
        // Criar componente de vetor de forma pseudo-aleatÃ³ria determinÃ­stica
        const val = Math.sin(hash + i) * Math.cos(hash - i * 3);
        vector.push(val);
    }
    
    // NormalizaÃ§Ã£o L2 (para distÃ¢ncia cosseno/produto escalar simples ser direto)
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

    // 2. Corrigir construÃ§Ãµes como "mÃ£e ser descontar os problemas" -> "mÃ£e descontar os problemas"
    // Se a caracterÃ­stica comeÃ§ar com verbos terminados em "ar", "er", "ir", "or", removemos o "ser" intermediÃ¡rio.
    clean = clean.replace(/(\w+)\s+ser\s+((\w+)(ar|er|ir|or)\b)/gi, "$1 $2");

    // 3. Substituir dois-pontos (":") por vÃ­rgula para fluidez
    clean = clean.replace(/\s*:\s*/g, ", ");

    const cleanLower = clean.toLowerCase();

    // 4. Se jÃ¡ comeÃ§ar com conectores comuns, deixar como estÃ¡
    const PREPOSITIONS = ["por ", "na ", "no ", "em ", "com ", "de ", "da ", "do ", "pela ", "pelo ", "para "];
    if (PREPOSITIONS.some(p => cleanLower.startsWith(p))) {
        return clean;
    }

    const VERB_PARTICIPLES = {
        'consegui': 'conseguido', 'conseguiu': 'conseguido', 'conseguimos': 'conseguido', 'conseguiram': 'conseguido', 'conseguir': 'conseguido',
        'tive': 'tido', 'teve': 'tido', 'tivemos': 'tido', 'tiveram': 'tido', 'ter': 'tido',
        'fui': 'ido', 'foi': 'ido', 'fomos': 'ido', 'foram': 'ido', 'ir': 'ido',
        'fiz': 'feito', 'fez': 'feito', 'fizemos': 'feito', 'fizeram': 'feito', 'fazer': 'feito',
        'bati': 'batido', 'bateu': 'batido', 'bater': 'batido',
        'perdi': 'perdido', 'perdeu': 'perdido', 'perder': 'perdido',
        'errei': 'errado', 'errou': 'errado', 'errar': 'errado',
        'briguei': 'brigado', 'brigou': 'brigado', 'brigar': 'brigado',
        'falei': 'falado', 'falou': 'falado', 'falar': 'falado',
        'discuti': 'discutido', 'discutiu': 'discutido', 'discutir': 'discutido',
        'recebi': 'recebido', 'recebeu': 'recebido', 'receber': 'recebido',
        'senti': 'sentido', 'sentiu': 'sentido', 'sentir': 'sentido',
        'fiquei': 'ficado', 'ficou': 'ficado', 'ficar': 'ficado',
        'pude': 'podido', 'poder': 'podido',
        'gritei': 'gritado', 'gritou': 'gritado', 'gritar': 'gritado',
        'chorei': 'chorado', 'chorou': 'chorado', 'chorar': 'chorado',
        'quebrei': 'quebrado', 'quebrou': 'quebrado', 'quebrar': 'quebrado',
        'falhei': 'falhado', 'falhou': 'falhado', 'falhar': 'falhado',
        'menti': 'mentido', 'mentiu': 'mentido', 'mentir': 'mentido',
        'gastei': 'gastado', 'gastou': 'gastado', 'gastar': 'gastado',
        'comprei': 'comprado', 'comprou': 'comprado', 'comprar': 'comprado',
        'vendi': 'vendido', 'vendeu': 'vendido', 'vender': 'vendido',
        'ganhei': 'ganhado', 'ganhou': 'ganhado', 'ganhar': 'ganhado',
        'vi': 'visto', 'viu': 'visto', 'ver': 'visto',
        'olhei': 'olhado', 'olhou': 'olhado', 'olhar': 'olhado',
        'esqueci': 'esquecido', 'esqueceu': 'esquecido', 'esquecer': 'esquecido',
        'lembrei': 'lembrado', 'lembrou': 'lembrado', 'lembrar': 'lembrado',
        'deixei': 'deixado', 'deixou': 'deixado', 'deixar': 'deixado',
        'ajudei': 'ajudado', 'ajudou': 'ajudado', 'ajudar': 'ajudado',
        'cheguei': 'chegado', 'chegou': 'chegado', 'chegar': 'chegado',
        'sai': 'saÃ­do', 'saiu': 'saÃ­do', 'sair': 'saÃ­do',
        'cai': 'caÃ­do', 'caiu': 'caÃ­do', 'cair': 'caÃ­do',
        'entrei': 'entrado', 'entrou': 'entrado', 'entrar': 'entrado'
    };

    const words = cleanLower.split(/\s+/);
    
    // SÃ³ reestruturar se o verbo estiver nas primeiras 2 palavras para evitar bagunÃ§ar frases complexas
    let verbIndex = -1;
    let participle = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        const w = words[i];
        if (VERB_PARTICIPLES[w]) {
            verbIndex = i;
            participle = VERB_PARTICIPLES[w];
            break;
        }
    }

    if (verbIndex !== -1) {
        // Se a frase jÃ¡ contiver "ter" ou "tido" ou "por" logo antes, nÃ£o reestrutura
        const prevWord = verbIndex > 0 ? words[verbIndex - 1] : "";
        if (prevWord === "ter" || prevWord === "tido" || prevWord === "por" || prevWord === "eu") {
            return `por ${clean}`;
        }

        const wordsBefore = clean.split(/\s+/).slice(0, verbIndex).join(" ");
        const wordsAfter = clean.split(/\s+/).slice(verbIndex + 1).join(" ");
        
        const preWords = [];
        const postWords = [];
        
        if (wordsBefore) {
            wordsBefore.split(/\s+/).forEach(w => {
                const low = w.trim().toLowerCase();
                const isPre = ["eu", "vocÃª", "ele", "ela", "nÃ³s", "a gente", "nÃ£o", "nunca", "jamais", "nem", "ontem", "hoje", "anteontem", "agora", "antes", "depois", "jÃ¡"].includes(low);
                if (isPre) {
                    preWords.push(w);
                } else {
                    postWords.push(w);
                }
            });
        }
        
        let result = "por ";
        if (preWords.length > 0) {
            result += preWords.join(" ") + " ";
        } else {
            result += "eu ";
        }
        
        result += `ter ${participle}`;
        
        if (wordsAfter) result += ` ${wordsAfter}`;
        if (postWords.length > 0) result += ` ${postWords.join(" ")}`;
        return result;
    }

    // Caso comece com substantivos de eventos comuns
    const feminineNouns = ["briga", "discussÃ£o", "conversa", "perda", "demissÃ£o", "reuniÃ£o", "viagem", "morte", "separaÃ§Ã£o", "traiÃ§Ã£o", "crÃ­tica", "fofoca"];
    const masculineNouns = ["conflito", "desentendimento", "erro", "acidente", "assalto", "problema", "gasto", "atraso"];

    const firstWord = words[0];
    if (feminineNouns.includes(firstWord)) {
        return `na ${clean}`;
    }
    if (masculineNouns.includes(firstWord)) {
        return `no ${clean}`;
    }

    // Ajuste de preposição/contração para fluxo natural
    let prefix = "em relação a ";
    let cleanTrimmed = clean;
    const cleanLowerTrimmed = cleanLower.trim();

    if (cleanLowerTrimmed.startsWith("mãe ")) {
        prefix = "em relação à ";
        cleanTrimmed = clean.substring(4);
    } else if (cleanLowerTrimmed.startsWith("minha mãe ")) {
        prefix = "em relação à ";
        cleanTrimmed = clean.substring(10);
    } else if (cleanLowerTrimmed.startsWith("pai ")) {
        prefix = "em relação ao ";
        cleanTrimmed = clean.substring(4);
    } else if (cleanLowerTrimmed.startsWith("meu pai ")) {
        prefix = "em relação ao ";
        cleanTrimmed = clean.substring(8);
    }

    let result = `${prefix}${cleanTrimmed}`;
    const lowerResult = result.toLowerCase();

    if (lowerResult.includes("mãe")) {
        const firstMaeIdx = lowerResult.indexOf("mãe");
        const beforeMae = result.substring(0, firstMaeIdx + 3);
        let afterMae = result.substring(firstMaeIdx + 3);

        afterMae = afterMae.replace(/da minha mãe/gi, "dela")
                           .replace(/de minha mãe/gi, "dela")
                           .replace(/da mãe/gi, "dela")
                           .replace(/de mãe/gi, "dela")
                           .replace(/minha mãe/gi, "ela")
                           .replace(/a mãe/gi, "ela");
        result = beforeMae + afterMae;
    }

    if (result.toLowerCase().includes("pai")) {
        const lowerResult2 = result.toLowerCase();
        const firstPaiIdx = lowerResult2.indexOf("pai");
        const beforePai = result.substring(0, firstPaiIdx + 3);
        let afterPai = result.substring(firstPaiIdx + 3);

        afterPai = afterPai.replace(/do meu pai/gi, "dele")
                           .replace(/de meu pai/gi, "dele")
                           .replace(/do pai/gi, "dele")
                           .replace(/de pai/gi, "dele")
                           .replace(/meu pai/gi, "ele")
                           .replace(/o pai/gi, "ele");
        result = beforePai + afterPai;
    }

    return result;
}


// FunÃ§Ã£o auxiliar para construir as frases de MSI e MFI de acordo com a seleÃ§Ã£o e sentimentos
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
            "culpa", "injustiÃ§a", "dor", "tristeza", "solidÃ£o", "rejeiÃ§Ã£o", "desaprovaÃ§Ã£o", 
            "carÃªncia", "raiva", "Ã³dio", "decepÃ§Ã£o", "incompetÃªncia", "incapacidade", 
            "inferioridade", "pressÃ£o", "invasÃ£o", "usada", "manipulada", "desrespeitada", 
            "ser controlada", "nÃ£o controlar", "perder o controle", "sensaÃ§Ã£o de estar ou ser feia", 
            "pÃ¢nico", "medo", "trocada", "frustraÃ§Ã£o", "sensaÃ§Ã£o de perder o sentido da vida", 
            "inseguranÃ§a", "nojo", "desÃ¢nimo", "nÃ£o servir pra nada", "vontade de morrer", 
            "angÃºstia", "incerteza", "sensaÃ§Ã£o de nÃ£o ter estabilidade", "abandonada", "submissÃ£o"
        ];

        let matchedSentiments = [];
        SENTIMENTS_LIST.forEach(s => {
            if (text.includes(s)) {
                matchedSentiments.push(s);
            }
        });

        if (text.includes("briga") || text.includes("discuti") || text.includes("conflito") || text.includes("discussÃ£o") || text.includes("marido") || text.includes("esposa") || text.includes("carro") || text.includes("bati")) {
            if (!matchedSentiments.includes("tristeza")) matchedSentiments.push("tristeza");
            if (!matchedSentiments.includes("raiva")) matchedSentiments.push("raiva");
            if (!matchedSentiments.includes("injustiÃ§a")) matchedSentiments.push("injustiÃ§a");
        }
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("perda")) {
            if (!matchedSentiments.includes("inseguranÃ§a")) matchedSentiments.push("inseguranÃ§a");
            if (!matchedSentiments.includes("pressÃ£o")) matchedSentiments.push("pressÃ£o");
            if (!matchedSentiments.includes("frustraÃ§Ã£o")) matchedSentiments.push("frustraÃ§Ã£o");
        }

        if (matchedSentiments.length === 0) {
            if (category === "Relacionamentos") {
                matchedSentiments = ["tristeza", "rejeiÃ§Ã£o", "raiva"];
            } else if (category === "Prosperidade" || category === "Trabalho") {
                matchedSentiments = ["inseguranÃ§a", "incerteza", "frustraÃ§Ã£o"];
            } else {
                matchedSentiments = ["tristeza", "inseguranÃ§a", "angÃºstia"];
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
        block += `ESPÃRITO, todas as informaÃ§Ãµes negativas que recebi ${formattedFact} acabou!\n`;
        block += `ESPÃRITO, todas as informaÃ§Ãµes negativas que gerei ${formattedFact} acabou!`;
        
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

        // Construir declaraÃ§Ãµes MSI/MFI dinamicamente
        const declarations = buildDeclarations(inputPhrase, isHereditary, hereditaryType, addedFacts, category, factDetail);

        // MRI - Movimento de ReinterpretaÃ§Ã£o
        let cleanMRI = "";
        if (matchedKey && maxMatches > 0) {
            cleanMRI = rawMRI.replace(/3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\n?/gi, "").trim();
        } else {
            const mriSuggest = this.suggestMriRessignificacao(inputPhrase);
            cleanMRI = `EspÃ­rito, eu escolho ${mriSuggest.es}.\nAlma, eu jÃ¡ ${mriSuggest.al}.`;
        }

        // MDI - Movimento de DescompactaÃ§Ã£o Informacional (BLOCO 3.3 - Fixo)
        const cleanConcept = inputPhrase.replace(/eu tenho/gi, '')
                                .replace(/estou com/gi, '')
                                .replace(/sinto muito/gi, '')
                                .replace(/sinto/gi, '')
                                .replace(/tenho/gi, '')
                                .replace(/medo de/gi, 'medo de ')
                                .trim();

        const masculineConcepts = ["medo", "conflito", "desentendimento", "orgulho", "ciúme", "estresse", "vazio", "apego", "controle", "pânico"];
        const connector = masculineConcepts.includes(cleanConcept.toLowerCase().trim()) ? "pelo" : "pela";

        let mdi = `ESPÍRITO, pensamento que gerou o "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `ESPÍRITO, condicionamento de manifestar o "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `ESPÍRITO, condicionamento de observar o "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `ESPÍRITO, condicionamento de dar utilidade a(o) "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `ESPÍRITO, crença sobre o "${cleanConcept.toLowerCase()}" acabou!\n`;
        mdi += `ESPÍRITO, hereditariedade recebida de "${cleanConcept.toLowerCase()}" acabou!`;

        // MDI Condicional extra lines
        if (hasMdiCondicional && addedMdiBehaviors && addedMdiBehaviors.length > 0) {
            addedMdiBehaviors.forEach(item => {
                if (item.behavior) {
                    mdi += `\nESPÍRITO, condicionamento de ${item.behavior.toLowerCase()} acabou!`;
                    if (item.sentiment) {
                        mdi += `\nESPÍRITO, condicionamento de me sentir ${item.sentiment.toLowerCase()} ${connector} ${cleanConcept.toLowerCase()} acabou!`;
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
            
            // Fallback microaÃ§Ã£o simplificada para Iniciante
            if (category === "Relacionamentos") {
                finalMicroacao = `Na prÃ³xima situaÃ§Ã£o de relacionamento, observe como o padrÃ£o de "${cleanConcept.toLowerCase()}" se apresenta e faÃ§a uma escolha consciente diferente.`;
            } else if (category === "Prosperidade" || category === "Trabalho") {
                finalMicroacao = `Ao lidar com questÃµes de trabalho ou dinheiro, faÃ§a uma pausa de reflexÃ£o sobre o tema "${cleanConcept.toLowerCase()}".`;
            } else {
                finalMicroacao = `Tire alguns minutos do seu dia para respirar profundamente e soltar o padrÃ£o mental de "${cleanConcept.toLowerCase()}".`;
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

            // --- LÃ³gica de GeraÃ§Ã£o de MicroaÃ§Ãµes Personalizadas (SeÃ§Ã£o 6) ---
            const firstMdiBehavior = (hasMdiCondicional && addedMdiBehaviors && addedMdiBehaviors.length > 0) ? addedMdiBehaviors[0].behavior : "";

            if (hasMdiCondicional && firstMdiBehavior && addedPositivosAtrapalham && addedPositivosAtrapalham.length > 0) {
                // Ambos comportamentos e falsos positivos
                if (category === "Relacionamentos") {
                    finalMicroacao = `Na prÃ³xima situaÃ§Ã£o envolvendo seu tema, evite "${firstMdiBehavior.toLowerCase()}" e pratique soltar o apego de "${addedPositivosAtrapalham[0].toLowerCase()}", observando o equilÃ­brio retornar.`;
                } else if (category === "Prosperidade" || category === "Trabalho") {
                    finalMicroacao = `Ao lidar com dinheiro ou trabalho, interrompa o hÃ¡bito de "${firstMdiBehavior.toLowerCase()}" e desapegue da necessidade de "${addedPositivosAtrapalham[0].toLowerCase()}".`;
                } else {
                    finalMicroacao = `Ao perceber o desconforto, evite "${firstMdiBehavior.toLowerCase()}" e solte a dependÃªncia de "${addedPositivosAtrapalham[0].toLowerCase()}".`;
                }
            } else if (hasMdiCondicional && firstMdiBehavior) {
                // Apenas comportamento repetitivo
                if (category === "Relacionamentos") {
                    finalMicroacao = `Na prÃ³xima situaÃ§Ã£o envolvendo seu tema ou pessoas prÃ³ximas, pratique o oposto de "${firstMdiBehavior.toLowerCase()}" para romper o ciclo automÃ¡tico.`;
                } else if (category === "Prosperidade" || category === "Trabalho") {
                    finalMicroacao = `Diante de desafios ligados a dinheiro/trabalho, crie um espaÃ§o de reflexÃ£o de 10 minutos antes de "${firstMdiBehavior.toLowerCase()}".`;
                } else {
                    finalMicroacao = `Quando notar o padrÃ£o do tema se manifestando, em vez de "${firstMdiBehavior.toLowerCase()}", faÃ§a uma pausa consciente e ancore o MRI.`;
                }
            } else if (addedPositivosAtrapalham && addedPositivosAtrapalham.length > 0) {
                // Apenas falso positivo (MFPI)
                finalMicroacao = `Pratique soltar o apego de "${addedPositivosAtrapalham[0].toLowerCase()}" no seu dia a dia. Observe quando essa forÃ§a aparente se manifesta e escolha a flexibilidade.`;
            } else {
                // Fallback por categoria amarrado ao TEMA literal
                if (category === "Prosperidade") {
                    finalMicroacao = `Dedique 15 minutos hoje para revisar suas aÃ§Ãµes prÃ¡ticas em relaÃ§Ã£o a "${cleanConcept.toLowerCase()}" e tome uma decisÃ£o organizada.`;
                } else if (category === "Trabalho") {
                    finalMicroacao = `Organize sua rotina diÃ¡ria para dar uma resposta mais equilibrada e menos automÃ¡tica ao tema "${cleanConcept.toLowerCase()}".`;
                } else if (category === "Relacionamentos") {
                    finalMicroacao = `Pratique a observaÃ§Ã£o do padrÃ£o de "${cleanConcept.toLowerCase()}" na sua prÃ³xima interaÃ§Ã£o e responda com clareza e empatia.`;
                } else {
                    finalMicroacao = `Reserve um momento de silÃªncio hoje para reconhecer e soltar conscientemente a tensÃ£o ligada a "${cleanConcept.toLowerCase()}".`;
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
            declaracaoNaoEspecifica: finalNaoEspecifica, // MSI + MRI + MDI dependendo do nÃ­vel
            pergunta: pergunta,
            microacao: finalMicroacao,
            embedding: embedding,
            originalPhrase: inputPhrase
        };
    }

    static suggestMriRessignificacao(phrase) {
        const clean = phrase.toLowerCase().trim();
        let es = "direcionar minha atenÃ§Ã£o para novas possibilidades, soluÃ§Ãµes e expansÃ£o";
        let al = "construo minha realidade com presenÃ§a, consistÃªncia e equilÃ­brio";

        if (clean.includes("escassez") || clean.includes("dinheiro") || clean.includes("financeiro") || clean.includes("dÃ­vida") || clean.includes("pobre")) {
            es = "direcionar minha atenÃ§Ã£o para a abundÃ¢ncia, prosperidade e fluxo constante de recursos";
            al = "construo riqueza, fartura e seguranÃ§a financeira com aÃ§Ãµes consistentes e sabedoria";
        } else if (clean.includes("relacionamento") || clean.includes("amor") || clean.includes("briga") || clean.includes("casamento")) {
            es = "direcionar minha atenÃ§Ã£o para conexÃµes saudÃ¡veis, comunicaÃ§Ã£o pacÃ­fica e amor mÃºtuo";
            al = "vivencio laÃ§os afetivos harmÃ´nicos, respeito mÃºtuo e cooperaÃ§Ã£o diÃ¡ria";
        } else if (clean.includes("ansiedade") || clean.includes("medo") || clean.includes("pÃ¢nico") || clean.includes("preocupaÃ§Ã£o")) {
            es = "direcionar minha atenÃ§Ã£o para a paz interna, seguranÃ§a e clareza mental";
            al = "sinto serenidade, confianÃ§a absoluta na vida e estabilidade emocional em meu corpo";
        } else if (clean.includes("trabalho") || clean.includes("carreira") || clean.includes("profissional") || clean.includes("emprego")) {
            es = "direcionar minha atenÃ§Ã£o para o crescimento profissional, reconhecimento e realizaÃ§Ã£o";
            al = "exerÃ§o meus talentos com dedicaÃ§Ã£o, prosperidade e entrega de valor consistente";
        } else if (clean.includes("saÃºde") || clean.includes("dor") || clean.includes("doenÃ§a") || clean.includes("corpo")) {
            es = "direcionar minha atenÃ§Ã£o para a saÃºde plena, regeneraÃ§Ã£o celular e vitalidade";
            al = "sinto meu corpo forte, revigorado e em perfeito equilÃ­brio funcional";
        }

        return { es, al };
    }

    static generateDynamicFallback(phrase) {
        const text = phrase.toLowerCase().trim();
        let category = "Autoconhecimento";
        let categoryEmoji = "ðŸ“ Autoconhecimento";
        let title = "Processo de ReorganizaÃ§Ã£o";
        
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("financeiro") || text.includes("rico") || text.includes("pobre") || text.includes("prosperar") || text.includes("economia")) {
            category = "Prosperidade";
            categoryEmoji = "ðŸ“ Prosperidade";
            title = "Ajuste de Prosperidade";
        } else if (text.includes("trabalho") || text.includes("empresa") || text.includes("negÃ³cio") || text.includes("carreira") || text.includes("vender") || text.includes("chefe") || text.includes("emprego")) {
            category = "Trabalho";
            categoryEmoji = "ðŸ“ Trabalho";
            title = "Ajuste de Trabalho";
        } else if (text.includes("relacionamento") || text.includes("namorado") || text.includes("amor") || text.includes("casamento") || text.includes("traiÃ§Ã£o") || text.includes("solidÃ£o") || text.includes("abandono") || text.includes("ciÃºme") || text.includes("marido") || text.includes("esposa")) {
            category = "Relacionamentos";
            categoryEmoji = "ðŸ“ Relacionamentos";
            title = "Ajuste de Relacionamento";
        } else if (text.includes("saÃºde") || text.includes("dor") || text.includes("doente") || text.includes("corpo") || text.includes("sono") || text.includes("cansado") || text.includes("energia") || text.includes("doenÃ§a")) {
            category = "SaÃºde emocional";
            categoryEmoji = "ðŸ“ SaÃºde emocional";
            title = "Ajuste de SaÃºde Emocional";
        } else if (text.includes("medo") || text.includes("receio") || text.includes("pavor")) {
            category = "Coragem";
            categoryEmoji = "ðŸ“ Coragem";
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
            "culpa", "injustiÃ§a", "dor", "tristeza", "solidÃ£o", "rejeiÃ§Ã£o", "desaprovaÃ§Ã£o", 
            "carÃªncia", "raiva", "Ã³dio", "decepÃ§Ã£o", "incompetÃªncia", "incapacidade", 
            "inferioridade", "pressÃ£o", "invasÃ£o", "usada", "manipulada", "desrespeitada", 
            "ser controlada", "nÃ£o controlar", "perder o controle", "sensaÃ§Ã£o de estar ou ser feia", 
            "pÃ¢nico", "medo", "trocada", "frustraÃ§Ã£o", "sensaÃ§Ã£o de perder o sentido da via", 
            "inseguranÃ§a", "nojo", "desÃ¢nimo", "nÃ£o servir pra nada", "vontade de morrer", 
            "angÃºstia", "incerteza", "sensaÃ§Ã£o de nÃ£o ter estabilidade", "abandonada", "submissÃ£o"
        ];

        let matchedSentiments = [];
        
        // Scan standard list
        SENTIMENTS_LIST.forEach(s => {
            if (text.includes(s)) {
                matchedSentiments.push(s);
            }
        });

        // HeurÃ­sticas adicionais baseadas em palavras-chave do Fato
        if (text.includes("briga") || text.includes("discuti") || text.includes("conflito") || text.includes("discussÃ£o")) {
            if (!matchedSentiments.includes("tristeza")) matchedSentiments.push("tristeza");
            if (!matchedSentiments.includes("raiva")) matchedSentiments.push("raiva");
            if (!matchedSentiments.includes("injustiÃ§a")) matchedSentiments.push("injustiÃ§a");
        }
        if (text.includes("dinheiro") || text.includes("escassez") || text.includes("perda")) {
            if (!matchedSentiments.includes("inseguranÃ§a")) matchedSentiments.push("inseguranÃ§a");
            if (!matchedSentiments.includes("pressÃ£o")) matchedSentiments.push("pressÃ£o");
            if (!matchedSentiments.includes("frustraÃ§Ã£o")) matchedSentiments.push("frustraÃ§Ã£o");
        }
        if (text.includes("vender") || text.includes("cobrar") || text.includes("trabalho")) {
            if (!matchedSentiments.includes("incompetÃªncia")) matchedSentiments.push("incompetÃªncia");
            if (!matchedSentiments.includes("rejeiÃ§Ã£o")) matchedSentiments.push("rejeiÃ§Ã£o");
            if (!matchedSentiments.includes("desaprovaÃ§Ã£o")) matchedSentiments.push("desaprovaÃ§Ã£o");
        }
        if (text.includes("cansaÃ§o") || text.includes("exaustÃ£o") || text.includes("sobrecarga")) {
            if (!matchedSentiments.includes("pressÃ£o")) matchedSentiments.push("pressÃ£o");
            if (!matchedSentiments.includes("invasÃ£o")) matchedSentiments.push("invasÃ£o");
            if (!matchedSentiments.includes("desÃ¢nimo")) matchedSentiments.push("desÃ¢nimo");
        }

        // Se ainda nÃ£o encontrou nada, usar um fallback por categoria
        if (matchedSentiments.length === 0) {
            if (category === "Relacionamentos") {
                matchedSentiments = ["tristeza", "rejeiÃ§Ã£o", "raiva"];
            } else if (category === "Prosperidade" || category === "Trabalho") {
                matchedSentiments = ["inseguranÃ§a", "incerteza", "frustraÃ§Ã£o"];
            } else {
                matchedSentiments = ["tristeza", "inseguranÃ§a", "angÃºstia"];
            }
        }

        // Remover duplicados
        matchedSentiments = [...new Set(matchedSentiments)];

        // Formatar MSI
        let msiText = `1 - Movimento SistÃªmico Informacional - MSI\n`;
        msiText += `Alma, comportamentos e padrÃµes involuntÃ¡rios de "${cleanConcept.toLowerCase()}" que recebi do primeiro dia de minha existÃªncia atÃ© a primeira infÃ¢ncia, acabaram!\n`;
        
        // Formatar MFI
        let mfiText = `2 - Movimento Factual Informacional - MFI\n`;
        matchedSentiments.forEach(s => {
            mfiText += `Alma, ${s} que senti na "${cleanConcept.toLowerCase()}" acabou!\n`;
        });
        mfiText += `Alma, todos os sentimentos que senti na "${cleanConcept.toLowerCase()}" acabaram!\n`;
        mfiText += `EspÃ­rito, todas as informaÃ§Ãµes negativas que recebi na "${cleanConcept.toLowerCase()}" acabou!\n`;
        mfiText += `EspÃ­rito, todas as informaÃ§Ãµes negativas que gerei na "${cleanConcept.toLowerCase()}" acabou!`;

        const finalDeclaracao = `${msiText}\n${mfiText}`;

        // Formatar MRI
        let mriText = `3 - Movimento de ReinterpretaÃ§Ã£o Informacional - MRI\n`;
        if (category === "Prosperidade") {
            mriText += `EspÃ­rito, minha consciÃªncia escolhe, eu escolho direcionar minha atenÃ§Ã£o para possibilidades, soluÃ§Ãµes e expansÃ£o.\nAlma, eu jÃ¡ construo riqueza com presenÃ§a, consistÃªncia e equilÃ­brio.`;
        } else if (category === "Relacionamentos") {
            mriText += `EspÃ­rito, minha consciÃªncia escolhe, eu escolho acolher minha autonomia afetiva e estabelecer relaÃ§Ãµes saudÃ¡veis.\nAlma, eu jÃ¡ me sinto seguro(a), pleno(a) e vivencio conexÃµes estÃ¡veis com maturidade.`;
        } else {
            mriText += `EspÃ­rito, minha consciÃªncia escolhe, eu escolho focar em equilÃ­brio interno, clareza e novas soluÃ§Ãµes.\nAlma, eu jÃ¡ organizo meu estado interno com consistÃªncia, presenÃ§a e leveza.`;
        }

        return {
            category: category,
            categoryEmoji: categoryEmoji,
            title: title,
            ajuste: `O padrÃ£o de "${cleanConcept.toLowerCase()}" estÃ¡ gerando registros ativos que influenciam suas escolhas automÃ¡ticas.`,
            movimento: `Acolher este registro factual conscientemente para liberar a carga emocional e atualizar seu padrÃ£o de percepÃ§Ã£o.`,
            objetivo: "ReorganizaÃ§Ã£o factual e atualizaÃ§Ã£o de padrÃµes internos.",
            declaracao: finalDeclaracao,
            fortalecimento: mriText,
            pergunta: `O que o registro de "${cleanConcept.toLowerCase()}" estÃ¡ protegendo ou sinalizando na sua experiÃªncia atual?`,
            microacao: "Escrever o fato em um papel, mentalizar as frases de liberaÃ§Ã£o (MSI/MFI), e depois rasgÃ¡-lo, focando na reinterpretaÃ§Ã£o sugerida (MRI).",
            originalPhrase: phrase
        };
    }
}

// Gerenciamento de Estado do App
class AppStateManager {
    constructor() {
        this.currentStep = 1;
        this.currentData = null; // Guarda o resultado da reorganizaÃ§Ã£o atual
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
        
        // AutenticaÃ§Ã£o e Assinatura persistidas
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
        // Sincronizar com o banco do Supabase se o usuÃ¡rio estiver logado
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

            // Se o perfil nÃ£o existir (usuÃ¡rio antigo criado antes do trigger), cria-o agora!
            if (!profErr && !profData) {
                console.log("Perfil nÃ£o encontrado. Criando perfil padrÃ£o...");
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

            // 2. Buscar HistÃ³rico de ReorganizaÃ§Ãµes Remoto
            const { data: histData, error: histErr } = await supabaseClient
                .from("reorganizations")
                .select("*")
                .eq("user_id", this.currentUser.id || this.currentUser.email)
                .order("id", { ascending: false });

            if (histErr) {
                console.error("Erro ao buscar histÃ³rico de reorganizaÃ§Ãµes no Supabase:", histErr);
                showToast("Erro ao sincronizar histÃ³rico: " + histErr.message);
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
            console.error("Erro crÃ­tico na carga do Supabase:", err);
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
                    console.error("Erro ao salvar reorganizaÃ§Ã£o no Supabase:", insertErr);
                    showToast("Erro ao salvar no banco: " + insertErr.message);
                } else {
                    console.log("ReorganizaÃ§Ã£o salva com sucesso no Supabase!");
                }
            } catch (err) {
                console.error("Erro crÃ­tico ao salvar reorganizaÃ§Ã£o no Supabase:", err);
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

// InicializaÃ§Ã£o da UI e Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const state = new AppStateManager();
    
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
    
    // Sub-screens da Tela 1 (QuestionÃ¡rio)
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

    // RevisÃ£o e Sentimentos DOM Elements
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

    // LÃ³gica Centralizada de Tabs
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
                showToast("Acesse sua conta para ver suas ReorganizaÃ§Ãµes.");
                switchTab(navApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription) {
                showToast("Assine um plano para ver suas ReorganizaÃ§Ãµes.");
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

    // Event Listeners para a Barra de NavegaÃ§Ã£o Mobile
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
                showToast("Acesse sua conta para ver suas ReorganizaÃ§Ãµes.");
                switchTab(mApp, sectionApp);
                showScreen("auth");
                return;
            }
            if (!state.subscription) {
                showToast("Assine um plano para ver suas ReorganizaÃ§Ãµes.");
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

    // LÃ³gica de NavegaÃ§Ã£o e TransiÃ§Ã£o dos Sub-Passos da Tela 1
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

    // SeleÃ§Ã£o de NÃ­vel de Profundidade (Tela 1A)
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

    // Chips de SugestÃµes de Temas na Tela 1A
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

    // LÃ³gica de NavegaÃ§Ã£o e TransiÃ§Ã£o dos Sub-Passos da Tela 1
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

    // Tela 1A -> Tela 1A-Confirm (ConfirmaÃ§Ã£o do Tema)
    btnSubNext1.addEventListener("click", () => {
        const val = inputPhrase.value.trim();
        if (!val) {
            alert("Por favor, digite seu objetivo ou tema limitante.");
            return;
        }
        state.tempTheme = val;
        if (confirmThemeText) {
            confirmThemeText.innerText = `"${val}"`;
        }
        switchSubStep(subStep1a, subStep1aConfirm);
    });

    // Tela 1A-Confirm: Ajustar texto -> Volta para 1A
    if (btnConfirmAdjust) {
        btnConfirmAdjust.addEventListener("click", () => {
            switchSubStep(subStep1aConfirm, subStep1a);
        });
    }

    // Tela 1A-Confirm: Sim, seguir -> Vai para MFPI, MDI Condicional ou GeraÃ§Ã£o dependendo do nÃ­vel
    if (btnConfirmNext) {
        btnConfirmNext.addEventListener("click", () => {
            if (state.selectedLevel === "iniciante") {
                triggerFinalGeneration();
            } else if (state.selectedLevel === "intermediario") {
                // Reset MDI Condicional
                state.hasMdiCondicional = false;
                state.addedMdiBehaviors = [];
                renderMdiList();
                if (btnMdiCondYes) btnMdiCondYes.classList.remove("active");
                if (btnMdiCondNo) btnMdiCondNo.classList.remove("active");
                if (mdiCondInputsContainer) mdiCondInputsContainer.style.display = "none";
                if (btnMdiCondNext) btnMdiCondNext.disabled = true;
                if (inputMdiBehavior) inputMdiBehavior.value = "";
                if (inputMdiSentiment) inputMdiSentiment.value = "";
                switchSubStep(subStep1aConfirm, subStep1aMdiCond);
            } else {
                // AvanÃ§ado - Reset MFPI e MDI Condicional
                state.addedPositivosAtrapalham = [];
                if (inputMfpiItem) inputMfpiItem.value = "";
                renderMfpiList();
                
                state.hasMdiCondicional = false;
                state.addedMdiBehaviors = [];
                renderMdiList();
                if (btnMdiCondYes) btnMdiCondYes.classList.remove("active");
                if (btnMdiCondNo) btnMdiCondNo.classList.remove("active");
                if (mdiCondInputsContainer) mdiCondInputsContainer.style.display = "none";
                if (btnMdiCondNext) btnMdiCondNext.disabled = true;
                if (inputMdiBehavior) inputMdiBehavior.value = "";
                if (inputMdiSentiment) inputMdiSentiment.value = "";
                
                switchSubStep(subStep1aConfirm, subStep1aMfpi);
            }
        });
    }

    // Helper to render MFPI list items
    function renderMfpiList() {
        if (!mfpiListContainer) return;
        mfpiListContainer.innerHTML = "";
        state.addedPositivosAtrapalham.forEach((item, index) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.padding = "0.5rem 0.75rem";
            row.style.background = "rgba(255, 255, 255, 0.03)";
            row.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            row.style.borderRadius = "6px";
            
            row.innerHTML = `
                <span style="font-size: 0.85rem; color: var(--color-text-main); font-weight: 500;">ðŸ”¹ ${item}</span>
                <button type="button" class="btn-delete-mfpi" data-index="${index}" style="background: none; border: none; color: #EA4335; cursor: pointer; font-size: 0.85rem; padding: 0.25rem;">âŒ</button>
            `;
            
            row.querySelector(".btn-delete-mfpi").addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index || e.target.closest("button").dataset.index);
                state.addedPositivosAtrapalham.splice(idx, 1);
                renderMfpiList();
            });
            
            mfpiListContainer.appendChild(row);
        });
    }

    // MFPI Screen Add Button
    if (btnMfpiAdd) {
        btnMfpiAdd.addEventListener("click", () => {
            const val = inputMfpiItem.value.trim();
            if (val) {
                state.addedPositivosAtrapalham.push(val);
                inputMfpiItem.value = "";
                renderMfpiList();
            }
        });
    }

    // MFPI Screen Back Button
    if (btnMfpiBack) {
        btnMfpiBack.addEventListener("click", () => {
            switchSubStep(subStep1aMfpi, subStep1aConfirm);
        });
    }

    // MFPI Screen Next Button
    if (btnMfpiNext) {
        btnMfpiNext.addEventListener("click", () => {
            switchSubStep(subStep1aMfpi, subStep1aMdiCond);
        });
    }

    // Helper to render MDI list items
    function renderMdiList() {
        if (!mdiListContainer) return;
        mdiListContainer.innerHTML = "";
        state.addedMdiBehaviors.forEach((item, index) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.padding = "0.5rem 0.75rem";
            row.style.background = "rgba(255, 255, 255, 0.03)";
            row.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            row.style.borderRadius = "6px";
            
            const sentimentText = item.sentiment ? ` | Sentimento: ${item.sentiment}` : "";
            row.innerHTML = `
                <span style="font-size: 0.85rem; color: var(--color-text-main); font-weight: 500;">ðŸ”¹ Faz: ${item.behavior}${sentimentText}</span>
                <button type="button" class="btn-delete-mdi" data-index="${index}" style="background: none; border: none; color: #EA4335; cursor: pointer; font-size: 0.85rem; padding: 0.25rem;">âŒ</button>
            `;
            
            row.querySelector(".btn-delete-mdi").addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index || e.target.closest("button").dataset.index);
                state.addedMdiBehaviors.splice(idx, 1);
                renderMdiList();
                if (btnMdiCondNext) btnMdiCondNext.disabled = (state.addedMdiBehaviors.length === 0);
            });
            
            mdiListContainer.appendChild(row);
        });
    }

    // MDI Condicional Choice Buttons (Yes/No)
    if (btnMdiCondYes) {
        btnMdiCondYes.addEventListener("click", () => {
            state.hasMdiCondicional = true;
            btnMdiCondYes.classList.add("active");
            btnMdiCondNo.classList.remove("active");
            if (mdiCondInputsContainer) mdiCondInputsContainer.style.display = "block";
            // Disable next button until they add at least one behavior
            if (btnMdiCondNext) btnMdiCondNext.disabled = (state.addedMdiBehaviors.length === 0);
        });
    }

    if (btnMdiCondNo) {
        btnMdiCondNo.addEventListener("click", () => {
            state.hasMdiCondicional = false;
            state.addedMdiBehaviors = [];
            renderMdiList();
            btnMdiCondNo.classList.add("active");
            btnMdiCondYes.classList.remove("active");
            if (mdiCondInputsContainer) mdiCondInputsContainer.style.display = "none";
            if (btnMdiCondNext) btnMdiCondNext.disabled = false;
        });
    }

    // Add MDI item button
    if (btnMdiAddItem) {
        btnMdiAddItem.addEventListener("click", () => {
            const behavior = inputMdiBehavior ? inputMdiBehavior.value.trim() : "";
            const sentiment = inputMdiSentiment ? inputMdiSentiment.value.trim() : "";
            if (!behavior) {
                alert("Por favor, preencha o seu comportamento repetitivo.");
                return;
            }
            state.addedMdiBehaviors.push({ behavior, sentiment });
            if (inputMdiBehavior) inputMdiBehavior.value = "";
            if (inputMdiSentiment) inputMdiSentiment.value = "";
            renderMdiList();
            if (btnMdiCondNext) btnMdiCondNext.disabled = false;
        });
    }

    // MDI Condicional Back Button
    if (btnMdiCondBack) {
        btnMdiCondBack.addEventListener("click", () => {
            if (state.selectedLevel === "intermediario") {
                switchSubStep(subStep1aMdiCond, subStep1aConfirm);
            } else {
                switchSubStep(subStep1aMdiCond, subStep1aMfpi);
            }
        });
    }

    // MDI Condicional Next Button
    if (btnMdiCondNext) {
        btnMdiCondNext.addEventListener("click", () => {
            if (state.hasMdiCondicional) {
                const behaviorVal = inputMdiBehavior ? inputMdiBehavior.value.trim() : "";
                const sentimentVal = inputMdiSentiment ? inputMdiSentiment.value.trim() : "";
                if (behaviorVal) {
                    state.addedMdiBehaviors.push({ behavior: behaviorVal, sentiment: sentimentVal });
                    if (inputMdiBehavior) inputMdiBehavior.value = "";
                    if (inputMdiSentiment) inputMdiSentiment.value = "";
                    renderMdiList();
                }
                
                if (state.addedMdiBehaviors.length === 0) {
                    alert("Por favor, adicione pelo menos um comportamento repetitivo.");
                    return;
                }
            }
            
            if (state.selectedLevel === "intermediario") {
                triggerFinalGeneration();
            } else {
                switchSubStep(subStep1aMdiCond, subStep1b);
            }
        });
    }

    // Handlers para MSI (HereditÃ¡rio - 1B)
    btnFamilyNo.addEventListener("click", () => {
        state.isHereditary = false;
        state.hereditaryType = null;
        btnFamilyNo.classList.add("active");
        btnFamilyYesSentimento.classList.remove("active");
        btnFamilyYesPensamento.classList.remove("active");
        btnFamilyYesComportamento.classList.remove("active");
        setTimeout(() => {
            startGuidedQuestionnaire();
        }, 200);
    });

    btnFamilyYesSentimento.addEventListener("click", () => {
        state.isHereditary = true;
        state.hereditaryType = "sentimento";
        btnFamilyYesSentimento.classList.add("active");
        btnFamilyNo.classList.remove("active");
        btnFamilyYesPensamento.classList.remove("active");
        btnFamilyYesComportamento.classList.remove("active");
        setTimeout(() => {
            startGuidedQuestionnaire();
        }, 200);
    });

    btnFamilyYesPensamento.addEventListener("click", () => {
        state.isHereditary = true;
        state.hereditaryType = "pensamento";
        btnFamilyYesPensamento.classList.add("active");
        btnFamilyNo.classList.remove("active");
        btnFamilyYesSentimento.classList.remove("active");
        btnFamilyYesComportamento.classList.remove("active");
        setTimeout(() => {
            startGuidedQuestionnaire();
        }, 200);
    });

    btnFamilyYesComportamento.addEventListener("click", () => {
        state.isHereditary = true;
        state.hereditaryType = "comportamento";
        btnFamilyYesComportamento.classList.add("active");
        btnFamilyNo.classList.remove("active");
        btnFamilyYesSentimento.classList.remove("active");
        btnFamilyYesPensamento.classList.remove("active");
        setTimeout(() => {
            startGuidedQuestionnaire();
        }, 200);
    });

    btnFamilyBack.addEventListener("click", () => {
        switchSubStep(subStep1b, subStep1aMdiCond);
    });

    // ==========================================================================
    // Motor do Rastreamento Guiado - MFI (Telas 2.1.0 a 2.1.8)
    // ==========================================================================
    // Mapa de Sistemas do Corpo Humano (Ferramenta de Apoio no MFI)
    const BODY_SYSTEMS_MAP = [
        {
            name: "DigestÃ³rio e HepÃ¡tico",
            icon: "ðŸ¤¢",
            sentiments: ["inferioridade", "incapacidade", "incompetÃªncia", "inseguranÃ§a", "impotÃªncia"],
            description: "Inferioridade, incapacidade, incompetÃªncia ou impotÃªncia"
        },
        {
            name: "CirculatÃ³rio e RespiratÃ³rio",
            icon: "ðŸ«€",
            sentiments: ["troca", "pressÃ£o"],
            description: "Troca com a vida ou pressÃ£o emocional/fÃ­sica"
        },
        {
            name: "UrinÃ¡rio e Renal",
            icon: "ðŸ©º",
            sentiments: ["quebra de laÃ§os", "medo"],
            description: "Quebra de laÃ§os com pessoas queridas ou medos profundos"
        },
        {
            name: "Genital e Reprodutor",
            icon: "ðŸ§¬",
            sentiments: ["sexualidade", "maternidade", "paternidade"],
            description: "Conflitos de sexualidade, maternidade ou paternidade"
        },
        {
            name: "Tegumentar (Pele)",
            icon: "ðŸ–ï¸",
            sentiments: ["contato fÃ­sico", "carÃªncia", "rejeiÃ§Ã£o"],
            description: "Falta ou excesso de contato fÃ­sico e toque (carinho/convivÃªncia)"
        },
        {
            name: "ImunolÃ³gico e LinfÃ¡tico",
            icon: "ðŸ›¡ï¸",
            sentiments: ["invasÃ£o", "manipulada", "usada", "desrespeitada", "ser controlada"],
            description: "SensaÃ§Ã£o de ser invadido(a), manipulado(a), usado(a) ou controlado(a)"
        },
        {
            name: "EndÃ³crino",
            icon: "âš–ï¸",
            sentiments: ["culpa", "injustiÃ§a"],
            description: "Sentimento constante de culpas ou injustiÃ§as vivenciadas"
        },
        {
            name: "Nervoso e Cinco Sentidos",
            icon: "ðŸ§ ",
            sentiments: ["perder o controle", "nÃ£o controlar", "ser controlada"],
            description: "SensaÃ§Ã£o de perda de controle ou ser controlado(a)"
        },
        {
            name: "EsquelÃ©tico e Muscular",
            icon: "ðŸ¦´",
            sentiments: ["sensaÃ§Ã£o de estar ou ser feia", "inferioridade"],
            description: "SensaÃ§Ã£o de desvalorizaÃ§Ã£o fÃ­sica, vergonhas ou sentir-se feio(a)"
        }
    ];

    const QUESTIONNAIRE_STEPS = {
        "triagem": {
            text: (state) => `O tema <strong>'${state.tempTheme}'</strong> estÃ¡ diretamente ligado a alguma pessoa especÃ­fica (ex.: pai, mÃ£e, parceiro, ex, chefe, amigo)?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.0" },
                { text: "NÃ£o", next: "P1.1" },
                { text: "NÃ£o sei / NÃ£o tenho certeza", next: "P1.1", action: (state) => { state.triagemNaoSei = true; } }
            ]
        },
        // --- PROTOCOLO 1: RASTREIO POR FATOS ---
        "P1.1": {
            text: (state) => `Pensando no tema <strong>'${state.tempTheme}'</strong>, qual Ã© o fato mais marcante que vem Ã  sua mente?`,
            type: "open-or-skip",
            placeholder: "Ex: Ontem tentei cobrar pelo meu serviÃ§o e travei na hora de falar o preÃ§o...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: val, sentiments: [] });
                    return "P1.2";
                }
                return "P1.body"; // TransiÃ§Ã£o para o Mapa de Sistemas do Corpo quando o cliente trava!
            }
        },
        "P1.body": {
            text: (state) => `O tema <strong>'${state.tempTheme}'</strong> possui alguma manifestaÃ§Ã£o fÃ­sica ou sintoma no corpo associado? Selecione o sistema:`,
            type: "body-systems",
            onNext: (val, state) => {
                if (state.triagemNaoSei) {
                    state.triagemNaoSei = false;
                    return "P1.4_triagemNaoSei";
                }
                return "2.1.9";
            }
        },
        "P1.2": {
            text: (state) => `Dentro desse fato, existe um momento especÃ­fico que foi o mais marcante?`,
            type: "closed",
            options: [
                { text: "Sim, quero detalhar", next: "P1.2a" },
                { text: "NÃ£o, seguir", next: "P1.3" }
            ]
        },
        "P1.2a": {
            text: (state) => `Descreva esse momento especÃ­fico.`,
            type: "open-or-skip",
            placeholder: "Ex: Quando ele olhou sÃ©rio e disse que ia pensar antes de fechar...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `Momento do fato: ${val}`, sentiments: [] });
                }
                return "P1.3";
            }
        },
        "P1.3": {
            text: (state) => `VocÃª se lembra de outro fato igual ou parecido com esse?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P1.1" },
                { text: "NÃ£o", next: "P1.4" }
            ]
        },
        "P1.4": {
            text: (state) => `Existe outro fato, diferente desse, ligado ao tema <strong>'${state.tempTheme}'</strong>, que vocÃª quer trazer?`,
            type: "closed",
            options: [
                { text: "Sim, adicionar outro fato", next: "P1.1" },
                { text: "NÃ£o, explorar sintomas fÃ­sicos", next: "P1.body" },
                { text: "NÃ£o, ir para revisÃ£o de fatos", next: "2.1.9" }
            ],
            dynamicNext: (state) => {
                if (state.triagemNaoSei) {
                    state.triagemNaoSei = false;
                    return "P1.4_triagemNaoSei";
                }
                return "2.1.9";
            }
        },
        "P1.4_triagemNaoSei": {
            text: (state) => `VocÃª gostaria de explorar agora se o tema <strong>'${state.tempTheme}'</strong> estÃ¡ ligado a alguma pessoa especÃ­fica?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.0" },
                { text: "NÃ£o, ir para revisÃ£o", next: "2.1.9" }
            ]
        },
        // --- PROTOCOLO 2: RASTREIO POR PESSOAS ---
        "P2.0": {
            text: (state) => `Quem Ã© essa pessoa para vocÃª? (nome ou vÃ­nculo, ex.: 'minha mÃ£e', 'meu ex-marido')`,
            type: "open",
            placeholder: "Ex: Meu pai...",
            onNext: (val, state) => {
                state.tempPessoa = val || "a pessoa";
                return "P2.1";
            }
        },
        "P2.1": {
            text: (state) => `Quais caracterÃ­sticas de <strong>${state.tempPessoa}</strong> mais te incomodam?`,
            type: "open-or-skip",
            placeholder: "Ex: AutoritÃ¡rio, ausente, cobrador...",
            onNext: (val, state) => {
                if (val) {
                    state.tempCaracteristicas = val.split(",").map(c => c.trim()).filter(Boolean);
                    state.caractIdx = 0;
                    return "P2.2";
                }
                return "P2.4";
            }
        },
        "P2.2": {
            text: (state) => {
                const c = state.tempCaracteristicas[state.caractIdx] || "essa caracterÃ­stica";
                return `Existe um fato marcante ligado a essa caracterÃ­stica (<strong>${c}</strong>) de <strong>${state.tempPessoa}</strong>?`;
            },
            type: "open-or-skip",
            placeholder: "Ex: Quando eu tirei uma nota baixa e ele ficou dias sem falar comigo...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `Fato sobre ${state.tempPessoa} ser ${state.tempCaracteristicas[state.caractIdx]}: ${val}`, sentiments: [] });
                    return "P2.2a";
                }
                state.caractIdx++;
                if (state.caractIdx < state.tempCaracteristicas.length) {
                    return "P2.2";
                }
                return "P2.4";
            }
        },
        "P2.2a": {
            text: (state) => `Dentro desse fato, existe um momento especÃ­fico que mais te marcou?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.2a_open" },
                { text: "NÃ£o", next: "P2.2b" }
            ]
        },
        "P2.2a_open": {
            text: (state) => `Descreva esse momento especÃ­fico.`,
            type: "open-or-skip",
            placeholder: "Ex: Quando ele me ignorou na hora do jantar...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `Momento do fato de ${state.tempPessoa}: ${val}`, sentiments: [] });
                }
                return "P2.2b";
            }
        },
        "P2.2b": {
            text: (state) => `Lembra de outros fatos parecidos com esse, ligados a <strong>${state.tempPessoa}</strong>?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.2" },
                {
                    text: "NÃ£o",
                    next: null,
                    action: (state) => {
                        state.caractIdx++;
                    }
                }
            ],
            dynamicNext: (state) => {
                if (state.caractIdx < state.tempCaracteristicas.length) {
                    return "P2.2";
                }
                return "P2.3";
            }
        },
        "P2.3": {
            text: (state) => `Existe outra caracterÃ­stica de <strong>${state.tempPessoa}</strong> que te incomoda?`,
            type: "closed",
            options: [
                {
                    text: "Sim",
                    next: "P2.1",
                    action: (state) => {
                        state.tempCaracteristicas = [];
                    }
                },
                { text: "NÃ£o", next: "P2.4" }
            ]
        },
        "P2.4": {
            text: (state) => `<strong>${state.tempPessoa}</strong> Ã© ou era carinhosa e atenciosa com vocÃª?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.5" },
                {
                    text: "NÃ£o",
                    next: "P2.4_fact",
                    action: (state) => {
                        state.premarkedSentiments = ["tristeza", "rejeiÃ§Ã£o"];
                    }
                }
            ]
        },
        "P2.4_fact": {
            text: (state) => `Quer registrar um fato especÃ­fico ligado a essa falta de carinho/atenÃ§Ã£o de <strong>${state.tempPessoa}</strong>?`,
            type: "open-or-skip",
            placeholder: "Ex: Lembro que ele nunca ia nas minhas apresentaÃ§Ãµes da escola...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({
                        phrase: `Falta de carinho de ${state.tempPessoa}: ${val}`,
                        sentiments: state.premarkedSentiments || []
                    });
                }
                state.premarkedSentiments = null;
                return "P2.5";
            }
        },
        "P2.5": {
            text: (state) => `VocÃª sente ou sentia que <strong>${state.tempPessoa}</strong> te preferia, ou preferia outra pessoa (ex.: irmÃ£o(Ã£), outro filho, outro parceiro)?`,
            type: "closed",
            options: [
                { text: "Prefere a mim", next: "P2.6" },
                {
                    text: "Prefere o outro",
                    next: "P2.5_fact",
                    action: (state) => {
                        state.premarkedSentiments = ["tristeza", "raiva", "rejeiÃ§Ã£o"];
                    }
                },
                { text: "NÃ£o sei / NÃ£o sei dizer", next: "P2.6" }
            ]
        },
        "P2.5_fact": {
            text: (state) => `Quer registrar um fato especÃ­fico ligado a isso?`,
            type: "open-or-skip",
            placeholder: "Ex: Ele elogiava muito as conquistas do meu irmÃ£o e ignorava as minhas...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({
                        phrase: `PreferÃªncia de ${state.tempPessoa} por outro: ${val}`,
                        sentiments: state.premarkedSentiments || []
                    });
                }
                state.premarkedSentiments = null;
                return "P2.6";
            }
        },
        "P2.6": {
            text: (state) => `Em quais situaÃ§Ãµes <strong>${state.tempPessoa}</strong> fez vocÃª se sentir rejeitado(a)?`,
            type: "open-or-skip",
            placeholder: "Ex: Quando ele me deixou de lado para falar com amigos...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `SituaÃ§Ã£o de rejeiÃ§Ã£o com ${state.tempPessoa}: ${val}`, sentiments: ["rejeiÃ§Ã£o"] });
                }
                return "P2.7";
            }
        },
        "P2.7": {
            text: (state) => `O que <strong>${state.tempPessoa}</strong> fez, deixou de fazer, falou, deixou de falar ou pensou sobre vocÃª, que te incomodou?`,
            type: "open-or-skip",
            placeholder: "Ex: Ele disse que eu nÃ£o herdaria o negÃ³cio da famÃ­lia porque nÃ£o tinha capacidade...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `Incomodo gerado por ${state.tempPessoa}: ${val}`, sentiments: [] });
                }
                return "P2.8";
            }
        },
        "P2.8": {
            text: (state) => `O que vocÃª fez, deixou de fazer, falou, deixou de falar ou pensou sobre <strong>${state.tempPessoa}</strong>, que depois te incomodou?`,
            type: "open-or-skip",
            placeholder: "Ex: Fiquei anos sem mandar mensagem de aniversÃ¡rio para ele...",
            onNext: (val, state) => {
                if (val) {
                    state.addedFacts.push({ phrase: `AÃ§Ãµes com ${state.tempPessoa} que geraram incÃ´modo: ${val}`, sentiments: ["culpa"] });
                }
                return "P2.9";
            }
        },
        "P2.9": {
            text: (state) => `Existe outra pessoa ligada ao tema <strong>'${state.tempTheme}'</strong> que vocÃª quer trazer?`,
            type: "closed",
            options: [
                { text: "Sim", next: "P2.0" },
                { text: "NÃ£o", next: "2.1.9" }
            ]
        }
    };

    function startGuidedQuestionnaire() {
        state.currentQuestId = "triagem";
        state.questHistory = [];
        state.addedFacts = [];
        state.triagemNaoSei = false;
        
        switchSubStep(subStep1b, subStep2a);
        renderQuestStep();
    }

    function renderQuestStep() {
        const stepDef = QUESTIONNAIRE_STEPS[state.currentQuestId];
        if (!stepDef) {
            transitionToRevisionScreen();
            return;
        }

        // Popula Pergunta
        if (questQuestionText) {
            questQuestionText.innerHTML = stepDef.text(state);
        }

        // Resetar UI
        if (questInputWrapper) questInputWrapper.style.display = "none";
        if (questOptionsWrapper) questOptionsWrapper.style.display = "none";
        if (btnQuestNext) btnQuestNext.style.display = "none";
        if (btnQuestSkip) {
            btnQuestSkip.style.display = "none";
            btnQuestSkip.innerText = "AvanÃ§ar / NÃ£o sei";
        }

        if (stepDef.type === "open" || stepDef.type === "open-or-skip") {
            if (questInputWrapper) {
                questInputWrapper.style.display = "block";
                const textarea = document.getElementById("quest-open-input");
                if (textarea) {
                    textarea.value = "";
                    textarea.placeholder = stepDef.placeholder || "";
                    textarea.focus();
                }
            }
            if (btnQuestNext) btnQuestNext.style.display = "block";
            if (stepDef.type === "open-or-skip" && btnQuestSkip) {
                btnQuestSkip.style.display = "block";
            }
        } else if (stepDef.type === "closed") {
            if (questOptionsWrapper) {
                questOptionsWrapper.style.display = "flex";
                questOptionsWrapper.style.flexDirection = "column";
                questOptionsWrapper.style.gridTemplateColumns = "none";
                questOptionsWrapper.innerHTML = "";
                
                stepDef.options.forEach(opt => {
                    const btn = document.createElement("button");
                    btn.className = "btn btn-secondary";
                    btn.style.padding = "0.75rem";
                    btn.style.fontSize = "0.9rem";
                    btn.style.textAlign = "left";
                    btn.innerText = opt.text;
                    
                    btn.addEventListener("click", () => {
                        if (opt.action) opt.action(state);
                        
                        state.questHistory.push(state.currentQuestId);
                        
                        let nextId = opt.next;
                        if (!nextId && stepDef.dynamicNext) {
                            nextId = stepDef.dynamicNext(state);
                        }
                        
                        transitionToNextQuestStep(nextId);
                    });
                    
                    questOptionsWrapper.appendChild(btn);
                });
            }
        } else if (stepDef.type === "body-systems") {
            if (questOptionsWrapper) {
                questOptionsWrapper.style.display = "grid";
                questOptionsWrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
                questOptionsWrapper.style.gap = "0.6rem";
                questOptionsWrapper.innerHTML = "";
                
                BODY_SYSTEMS_MAP.forEach(sys => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "btn btn-secondary";
                    btn.style.padding = "0.65rem 0.85rem";
                    btn.style.fontSize = "0.82rem";
                    btn.style.textAlign = "left";
                    btn.style.display = "flex";
                    btn.style.flexDirection = "column";
                    btn.style.gap = "0.2rem";

                    btn.innerHTML = `<span style="font-weight: 600; color: var(--color-primary);">${sys.icon} ${sys.name}</span><span style="font-size: 0.72rem; color: var(--color-text-muted);">${sys.description}</span>`;

                    btn.addEventListener("click", () => {
                        state.addedFacts.push({
                            phrase: `Sintoma no sistema ${sys.name}: ${sys.description}`,
                            sentiments: [...sys.sentiments]
                        });
                        state.questHistory.push(state.currentQuestId);
                        
                        let nextId = stepDef.onNext ? stepDef.onNext("", state) : "2.1.9";
                        transitionToNextQuestStep(nextId);
                    });

                    questOptionsWrapper.appendChild(btn);
                });
            }
            if (btnQuestSkip) {
                btnQuestSkip.style.display = "block";
                btnQuestSkip.innerText = "NÃ£o associar a sintoma fÃ­sico â†’";
            }
        }
    }

    function transitionToNextQuestStep(nextId) {
        if (nextId === "2.1.9") {
            transitionToRevisionScreen();
        } else if (QUESTIONNAIRE_STEPS[nextId]) {
            state.currentQuestId = nextId;
            renderQuestStep();
        } else {
            transitionToRevisionScreen();
        }
    }

    // Handlers dos botÃµes de avanÃ§ar/pular na pergunta aberta
    if (btnQuestNext) {
        btnQuestNext.addEventListener("click", () => {
            const textarea = document.getElementById("quest-open-input");
            const val = textarea ? textarea.value.trim() : "";
            
            const stepDef = QUESTIONNAIRE_STEPS[state.currentQuestId];
            if (stepDef.type === "open" && !val) {
                alert("Por favor, preencha o campo antes de avanÃ§ar.");
                return;
            }
            
            state.questHistory.push(state.currentQuestId);
            const nextId = stepDef.onNext(val, state);
            transitionToNextQuestStep(nextId);
        });
    }

    if (btnQuestSkip) {
        btnQuestSkip.addEventListener("click", () => {
            const stepDef = QUESTIONNAIRE_STEPS[state.currentQuestId];
            state.questHistory.push(state.currentQuestId);
            const nextId = stepDef.onNext("", state);
            transitionToNextQuestStep(nextId);
        });
    }

    if (btnQuestBack) {
        btnQuestBack.addEventListener("click", () => {
            if (state.questHistory.length > 0) {
                const lastId = state.questHistory.pop();
                
                // Desfaz inserÃ§Ã£o de fatos caso tenha voltado de passos de inserÃ§Ã£o
                const lastStepDef = QUESTIONNAIRE_STEPS[lastId];
                if (lastStepDef && (lastStepDef.type === "open" || lastStepDef.type === "open-or-skip")) {
                    if (state.addedFacts.length > 0) {
                        state.addedFacts.pop();
                    }
                } else if (lastId === "P2.4" || lastId === "P2.5" || lastId === "P2.6" || lastId === "P2.7" || lastId === "P2.8") {
                    if (state.addedFacts.length > 0) {
                        state.addedFacts.pop();
                    }
                }
                
                state.currentQuestId = lastId;
                renderQuestStep();
            } else {
                switchSubStep(subStep2a, subStep1b);
            }
        });
    }

    // ==========================================================================
    // RevisÃ£o de Fatos - MFI (Tela 2.1.9)
    // ==========================================================================
    function transitionToRevisionScreen() {
        switchSubStep(subStep2a, subStep2b);
        renderRevisionFacts();
    }

    function renderRevisionFacts() {
        if (!revisionFactsList) return;
        revisionFactsList.innerHTML = "";

        if (state.addedFacts.length === 0) {
            revisionFactsList.innerHTML = `
                <div class="glass-card" style="padding: 2rem; text-align: center; border-radius: 8px; width: 100%;">
                    <p style="margin: 0; color: var(--color-text-muted); font-size: 0.9rem;">Nenhum fato especÃ­fico registrado. VocÃª pode avanÃ§ar diretamente para a liberaÃ§Ã£o geral.</p>
                </div>
            `;
            return;
        }

        state.addedFacts.forEach((fact, idx) => {
            const card = document.createElement("div");
            card.className = "practice-item-card";
            card.style.padding = "0.75rem";
            card.style.margin = "0";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "0.5rem";

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">Fato ${idx + 1}</span>
                    <button type="button" class="btn-delete-fact btn btn-text" data-idx="${idx}" style="color: #EA4335; padding: 0.25rem; font-size: 0.8rem;">ðŸ—‘ï¸ Excluir</button>
                </div>
                <input type="text" class="input-quantum input-edit-fact" data-idx="${idx}" value="${fact.phrase}" style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
            `;

            revisionFactsList.appendChild(card);
        });

        // Event Listeners para ediÃ§Ã£o
        revisionFactsList.querySelectorAll(".input-edit-fact").forEach(input => {
            input.addEventListener("input", (e) => {
                const idx = parseInt(e.target.dataset.idx);
                if (state.addedFacts[idx]) {
                    state.addedFacts[idx].phrase = e.target.value;
                }
            });
        });

        // Event Listeners para exclusÃ£o
        revisionFactsList.querySelectorAll(".btn-delete-fact").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.idx);
                state.addedFacts.splice(idx, 1);
                renderRevisionFacts();
            });
        });
    }

    if (btnRevisionAddMore) {
        btnRevisionAddMore.addEventListener("click", () => {
            state.currentQuestId = "P1.1";
            state.questHistory = [];
            switchSubStep(subStep2b, subStep2a);
            renderQuestStep();
        });
    }

    if (btnRevisionNext) {
        btnRevisionNext.addEventListener("click", () => {
            if (state.addedFacts.length === 0) {
                triggerFinalGeneration();
            } else {
                state.sentimentFactIdx = 0;
                switchSubStep(subStep2b, subStep2c);
                renderSentimentSelectStep();
            }
        });
    }

    // ==========================================================================
    // Passo 2.2: Escolha de Sentimentos por Fato (Tela 2.2)
    // ==========================================================================
    // Sentimentos - Banco Fixo
    const SENTIMENTS_LIST = [
        "culpa", "injustiÃ§a", "dor", "tristeza", "solidÃ£o", "rejeiÃ§Ã£o", "desaprovaÃ§Ã£o", "carÃªncia", 
        "raiva", "Ã³dio", "decepÃ§Ã£o", "incompetÃªncia", "incapacidade", "inferioridade", "pressÃ£o", 
        "invasÃ£o", "usada", "manipulada", "desrespeitada", "ser controlada", "nÃ£o controlar", 
        "perder o controle", "sensaÃ§Ã£o de estar ou ser feia", "pÃ¢nico", "medo", "trocada", 
        "frustraÃ§Ã£o", "sensaÃ§Ã£o de perder o sentido da vida", "inseguranÃ§a", "nojo", "desÃ¢nimo", 
        "nÃ£o servir pra nada", "vontade de morrer", "angÃºstia", "incerteza", "sensaÃ§Ã£o de nÃ£o ter estabilidade", 
        "abandonada", "submissÃ£o"
    ];

    function renderSentimentSelectStep() {
        if (!sentimentCurrentFactText || !sentimentFactTagsGrid || !sentimentStepCount) return;

        const fact = state.addedFacts[state.sentimentFactIdx];
        if (!fact) {
            triggerFinalGeneration();
            return;
        }

        sentimentCurrentFactText.innerHTML = `"${fact.phrase}"`;
        sentimentStepCount.innerText = `Processando fato ${state.sentimentFactIdx + 1} de ${state.addedFacts.length}`;
        sentimentFactTagsGrid.innerHTML = "";

        // Exibe ou esconde o botÃ£o de copiar sentimentos do fato anterior
        if (copyPrevSentimentsContainer) {
            if (state.sentimentFactIdx > 0) {
                copyPrevSentimentsContainer.style.display = "block";
            } else {
                copyPrevSentimentsContainer.style.display = "none";
            }
        }

        const activeSentiments = new Set(fact.sentiments || []);

        SENTIMENTS_LIST.forEach(s => {
            const tag = document.createElement("span");
            tag.className = "sentiment-tag";
            tag.innerText = s;
            
            if (activeSentiments.has(s)) {
                tag.classList.add("selected");
            }

            tag.addEventListener("click", () => {
                if (activeSentiments.has(s)) {
                    activeSentiments.delete(s);
                    tag.classList.remove("selected");
                } else {
                    activeSentiments.add(s);
                    tag.classList.add("selected");
                }
                fact.sentiments = Array.from(activeSentiments);
            });

            sentimentFactTagsGrid.appendChild(tag);
        });
    }

    if (btnSentimentSave) {
        btnSentimentSave.addEventListener("click", () => {
            state.sentimentFactIdx++;
            if (state.sentimentFactIdx < state.addedFacts.length) {
                renderSentimentSelectStep();
            } else {
                triggerFinalGeneration();
            }
        });
    }

    if (btnCopyPrevSentiments) {
        btnCopyPrevSentiments.addEventListener("click", () => {
            if (state.sentimentFactIdx > 0) {
                const prevFact = state.addedFacts[state.sentimentFactIdx - 1];
                const currentFact = state.addedFacts[state.sentimentFactIdx];
                if (prevFact && currentFact) {
                    currentFact.sentiments = [...(prevFact.sentiments || [])];
                    renderSentimentSelectStep();
                }
            }
        });
    }

    // ==========================================================================
    // GeraÃ§Ã£o de Decretos Final
    // ==========================================================================


    function triggerFinalGeneration() {
        const phrase = state.tempTheme || inputPhrase.value.trim();
        
        if (btnSentimentSave) btnSentimentSave.disabled = true;
        if (btnGenerate) {
            btnGenerate.disabled = true;
            btnGenerate.innerHTML = '<span class="spinner"></span> Analisando padrÃµes...';
        }
        
        setTimeout(() => {
            const result = ReorganizationEngine.analyzeInput(phrase, state.isHereditary, state.hereditaryType, state.addedFacts, state.factDetail, state.selectedLevel, state.addedPositivosAtrapalham, state.hasMdiCondicional, state.addedMdiBehaviors);
            state.currentData = result;
            
            // Popula Tela 2 (ConsciÃªncia)
            outputAjuste.innerText = result.ajuste;
            outputMovimento.innerText = result.movimento;
            
            // Popula Tela 3 (PrÃ¡ticas Guiadas)
            outputCategory.innerHTML = `<span class="category-pill">${result.categoryEmoji}</span>`;
            outputObjetivo.innerText = result.objetivo;
            
            const itemEspecifico = document.getElementById("item-especifico") || (outputEspecifico ? outputEspecifico.closest(".hqi-item") : null);
            if (!result.declaracaoEspecifica || result.declaracaoEspecifica.trim() === "") {
                if (itemEspecifico) itemEspecifico.style.display = "none";
            } else {
                if (itemEspecifico) itemEspecifico.style.display = "block";
                if (outputEspecifico) outputEspecifico.innerText = result.declaracaoEspecifica;
            }

            if (outputNaoEspecifico) outputNaoEspecifico.innerText = result.declaracaoNaoEspecifica;
            
            const itemMicroacao = outputMicroacao ? outputMicroacao.closest(".hqi-item") : null;
            if (!result.microacao || result.microacao.trim() === "") {
                if (itemMicroacao) itemMicroacao.style.display = "none";
            } else {
                if (itemMicroacao) itemMicroacao.style.display = "block";
                if (outputMicroacao) outputMicroacao.innerText = result.microacao;
            }
            
            showScreen("step3");
            startPracticeTimer();
            
            if (btnGenerate) {
                btnGenerate.disabled = false;
                btnGenerate.innerText = "Gerar Ajustes Informacionais â†’";
            }
            if (btnSentimentSave) btnSentimentSave.disabled = false;
        }, 1200);
    }

    function resetStep1Wizard() {
        state.isHereditary = false;
        state.hereditaryType = null;
        state.addedFacts = [];
        state.factDetail = "";
        state.tempTheme = "";
        state.tempPessoa = "";
        state.tempCaracteristicas = [];
        state.caractIdx = 0;
        state.triagemNaoSei = false;
        state.sentimentFactIdx = 0;
        
        // Reset MFPI & MDI Condicional
        state.addedPositivosAtrapalham = [];
        state.hasMdiCondicional = false;
        state.addedMdiBehaviors = [];
        renderMdiList();
        if (inputMfpiItem) inputMfpiItem.value = "";
        if (inputMdiBehavior) inputMdiBehavior.value = "";
        if (inputMdiSentiment) inputMdiSentiment.value = "";
        if (btnMdiCondYes) btnMdiCondYes.classList.remove("active");
        if (btnMdiCondNo) btnMdiCondNo.classList.remove("active");
        if (mdiCondInputsContainer) mdiCondInputsContainer.style.display = "none";
        if (btnMdiCondNext) btnMdiCondNext.disabled = true;
        
        btnFamilyNo.classList.remove("active");
        btnFamilyYesSentimento.classList.remove("active");
        btnFamilyYesPensamento.classList.remove("active");
        btnFamilyYesComportamento.classList.remove("active");
        
        state.selectedLevel = "avancado";
        if (levelCards) {
            levelCards.forEach(c => c && c.classList.remove("active"));
        }
        if (btnLevelAvancado) {
            btnLevelAvancado.classList.add("active");
        }
        
        inputPhrase.value = "";
        themeChips.forEach(c => c.classList.remove("selected"));
        
        subStep1a.style.display = "block";
        subStep1a.classList.add("active");
        subStep1aConfirm.style.display = "none";
        subStep1aConfirm.classList.remove("active");
        
        if (subStep1aMfpi) {
            subStep1aMfpi.style.display = "none";
            subStep1aMfpi.classList.remove("active");
        }
        if (subStep1aMdiCond) {
            subStep1aMdiCond.style.display = "none";
            subStep1aMdiCond.classList.remove("active");
        }
        
        subStep1b.style.display = "none";
        subStep1b.classList.remove("active");
        subStep2a.style.display = "none";
        subStep2a.classList.remove("active");
        subStep2b.style.display = "none";
        subStep2b.classList.remove("active");
        subStep2c.style.display = "none";
        subStep2c.classList.remove("active");
    }

    // Tela 2 (ConsciÃªncia) -> Tela 4: Ir para Registro & Acompanhamento
    btnToStep3.addEventListener("click", () => {
        showScreen("step4");
    });

    // LÃ³gica do Timer de PrÃ¡tica (Tela 3)
    function startPracticeTimer() {
        btnToStep4.disabled = true;
        btnToStep4.innerText = "Realize a prÃ¡tica com atenÃ§Ã£o... (10s)";
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
                btnToStep4.innerText = "Concluir PrÃ¡tica e Ver Leitura Informacional â†’";
                btnToStep4.classList.add("pulse-glow");
            } else {
                btnToStep4.innerText = `Realize a prÃ¡tica com atenÃ§Ã£o... (${timeLeft}s)`;
            }
        }, 1000);
    }

    // Tela 3 (PrÃ¡ticas Guiadas) -> Tela 2: Ir para ConsciÃªncia
    btnToStep4.addEventListener("click", () => {
        if (state.timerInterval) clearInterval(state.timerInterval);
        showScreen("step2");
    });

    // SeleÃ§Ã£o de sentimentos na Tela 4
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
        
        // Criar e salvar Agenda de 15 dias
        if (state.currentUser && state.currentData) {
            const agenda = {
                reorgId: Date.now().toString(),
                title: state.currentData.title,
                phrase: inputPhrase.value.trim(),
                command: state.currentData.declaracaoNaoEspecifica,
                microaction: state.currentData.microacao,
                startDate: new Date().toISOString(),
                ticks: {}
            };
            localStorage.setItem("active_agenda_" + state.currentUser.email, JSON.stringify(agenda));
            if (window.renderAgenda) window.renderAgenda();
        }

        ratingOptions.forEach(o => o.classList.remove("selected"));
        document.querySelector('[data-value="Mais leve"]').classList.add("selected");
        selectedRating = "Mais leve";
        inputRatingCustom.style.display = "none";
        inputRatingCustom.value = "";
        
        resetStep1Wizard();
        showScreen("step1");
        showToast("Processo salvo na sua biblioteca!");
    });

    // Helper: Mostrar tela especÃ­fica com interceptaÃ§Ãµes de autenticaÃ§Ã£o e paywall
    function showScreen(screenId) {
        Object.keys(screens).forEach(key => {
            if (screens[key]) {
                screens[key].classList.remove("active");
            }
        });
        
        // InterceptaÃ§Ã£o de seguranÃ§a e faturamento
        if (!state.currentUser) {
            if (screens["auth"]) screens["auth"].classList.add("active");
            state.currentStep = 0;
            updateUserUI();
            return;
        }
        
        if (!state.subscription && screenId !== "auth" && screenId !== "paywall") {
            // Se o usuÃ¡rio logado for terapeuta, nÃ£o precisa de assinatura ativa e pode acessar qualquer tela
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

        // Se a tela ativa for o painel do terapeuta, adiciona classe ao body para limpar o layout
        if (screenId === "therapist") {
            document.body.classList.add("mode-therapist");
        } else {
            document.body.classList.remove("mode-therapist");
        }
        updateUserUI();
    }

    // ==========================================================================
    // LÃ³gica de AutenticaÃ§Ã£o e Assinaturas (Simulador SaaS)
    // ==========================================================================
    const userNavContainer = document.getElementById("user-nav-container");
    const userEmailDisplay = document.getElementById("user-email-display");
    const userStatusDisplay = document.getElementById("user-status-display");
    const btnLogout = document.getElementById("btn-logout");

    function updateUserUI() {
        if (!userNavContainer) return;
        if (state.currentUser) {
            userNavContainer.style.display = "flex";
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
                    userStatusDisplay.innerText = "Terapeuta ðŸ”‘";
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
            if (window.renderAgenda) window.renderAgenda();
            if (window.checkDailyReminder) window.checkDailyReminder();
        } else {
            userNavContainer.style.display = "none";
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
                        
                        // Salvar usuÃ¡rio
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
                    alert("Erro na autenticaÃ§Ã£o: " + err.message);
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
                // SimulaÃ§Ã£o local
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
                // SimulaÃ§Ã£o local
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
            showToast("VocÃª saiu da sua conta.");
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
        
        // Prioridade mÃ¡xima: se links estÃ¡ticos estÃ£o configurados, redirecionar na hora (evita CORS e delay)
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
                console.warn("Falha ao gerar link dinÃ¢mico da InfinitePay, tentando link estÃ¡tico ou simulaÃ§Ã£o:", err);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                }
            }
        }
        
        // Se nenhuma configuraÃ§Ã£o da InfinitePay estiver ativa, usa a simulaÃ§Ã£o local anterior
        if (checkoutPlanName) {
            checkoutPlanName.innerText = plan === "yearly" ? "Anual (R$ 39,90/mÃªs)" : "Mensal (R$ 49,90/mÃªs)";
        }
        if (checkoutModal) checkoutModal.style.display = "flex";
    }

    document.querySelectorAll(".btn-select-plan").forEach(btn => {
        btn.addEventListener("click", () => {
            startCheckout(btn.dataset.plan);
        });
    });

    // CÃ³digo de convite / Reivindicar Assinatura Gratuita
    const btnClaimInvite = document.getElementById("btn-claim-invite");
    const inputInviteCode = document.getElementById("input-invite-code");

    if (btnClaimInvite && inputInviteCode) {
        btnClaimInvite.addEventListener("click", () => {
            const rawCode = inputInviteCode.value.trim();
            // Remover acentos e comparar de forma insensÃ­vel a maiÃºsculas/minÃºsculas e sem hashtag
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
                    showToast("CÃ³digo de convite ativado! Seus 15 dias de teste comeÃ§aram agora. ðŸŽ‰");
                    showScreen("step1");
                }).catch(err => {
                    console.error(err);
                    showToast("Erro ao processar ativaÃ§Ã£o do convite.");
                }).finally(() => {
                    btnClaimInvite.disabled = false;
                    btnClaimInvite.innerText = "Reivindicar";
                });
            } else {
                showToast("CÃ³digo de convite invÃ¡lido ou expirado.");
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
                showToast("CÃ³digo Copia e Cola copiado!");
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
                btnConfirmPayment.innerText = "Simular ConfirmaÃ§Ã£o de Pagamento";
                
                updateUserUI();
                showScreen("step1");
                showToast("Assinatura confirmada! Acesso Premium liberado.");
            }, 1500);
        });
    }

    // Helper: Renderizar Biblioteca (HistÃ³rico)
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
                            <strong>LiberaÃ§Ã£o de Registros EspecÃ­ficos (1x na vida):</strong>
                            <p class="hqi-box" style="background: rgba(234, 67, 53, 0.03); border: 1px solid rgba(234, 67, 53, 0.1); border-radius: 6px; padding: 0.5rem; font-family: monospace; white-space: pre-wrap; font-size: 0.82rem;">${item.data.declaracaoEspecifica}</p>
                        </div>
                        ` : ''}
                        ${item.data && item.data.declaracaoNaoEspecifica ? `
                        <div class="detail-section">
                            <strong>LiberaÃ§Ã£o dos NÃ£o EspecÃ­ficos (1x por dia / 15 dias):</strong>
                            <p class="hqi-box-fortify" style="background: rgba(102, 252, 241, 0.03); border: 1px solid rgba(102, 252, 241, 0.1); border-radius: 6px; padding: 0.5rem; font-family: monospace; white-space: pre-wrap; font-size: 0.82rem; color: var(--color-primary);">${item.data.declaracaoNaoEspecifica}</p>
                        </div>
                        ` : ''}
                        <div class="detail-section">
                            <strong>AÃ§Ã£o de IntegraÃ§Ã£o:</strong>
                            <p class="action-box" style="background: rgba(255, 255, 255, 0.02); padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">ðŸŽ¯ ${item.data.microacao || 'Nenhuma'}</p>
                        </div>
                    </div>
                    <button class="btn-toggle-details">Ver detalhes â†“</button>
                `;
                
                const btnToggle = card.querySelector(".btn-toggle-details");
                const details = card.querySelector(".card-details");
                
                btnToggle.addEventListener("click", () => {
                    const isVisible = details.style.display === "block";
                    details.style.display = isVisible ? "none" : "block";
                    btnToggle.innerText = isVisible ? "Ver detalhes â†“" : "Ocultar detalhes â†‘";
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
    // LÃ³gica do Simulador RAG e Banco de Dados no Console
    // ==========================================================================

    function renderVectorList() {
        if (!ragVectorList) return;
        ragVectorList.innerHTML = "";
        const history = state.history;

        if (history.length === 0) {
            ragVectorList.innerHTML = `<li class="empty-stats">Nenhum vetor salvo ainda. Crie reorganizaÃ§Ãµes na aba InÃ­cio.</li>`;
            return;
        }

        history.forEach(item => {
            const li = document.createElement("li");
            li.style.background = "rgba(255, 255, 255, 0.02)";
            li.style.border = "1px solid var(--color-border)";
            li.style.borderRadius = "8px";
            li.style.padding = "0.75rem";
            
            // Gerar embedding caso o item antigo nÃ£o possua
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
                // Passo 1: GeraÃ§Ã£o de Embedding
                const queryEmbedding = generateMockEmbedding(query);
                const firstValues = queryEmbedding.slice(0, 4).join(", ");
                
                appendConsoleLog(`[PASSO 1] Gerando Vector Embedding via OpenAI API (text-embedding-3-small)...`);
                appendConsoleLog(`Vector gerado com sucesso! DimensÃ£o: 1536.`, "color-green");
                appendConsoleLog(`Vetor do usuÃ¡rio: [${firstValues}, ...]`, "color-grey");

                setTimeout(() => {
                    // Passo 2: Busca Vetorial Cosseno no pgvector
                    appendConsoleLog(`[PASSO 2] Consultando banco de dados PostgreSQL usando operador de distÃ¢ncia cosseno (<=>) no pgvector...`);
                    
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

                    // Filtrar por limite semÃ¢ntico (threshold de 0.60 para simulaÃ§Ã£o)
                    const threshold = 0.60;
                    const relevantMatches = matches.filter(m => m.similarity >= threshold).slice(0, 2);

                    if (matches.length === 0) {
                        appendConsoleLog(`Varredura completa. Tabela journal_entries estÃ¡ vazia. Nenhum contexto histÃ³rico recuperado.`, "color-yellow");
                    } else {
                        appendConsoleLog(`Similaridades calculadas com sucesso no banco de dados:`);
                        matches.slice(0, 3).forEach(m => {
                            const isSelected = m.similarity >= threshold ? "SELECIONADO (>= 0.60)" : "IGNORADO (< 0.60)";
                            const color = m.similarity >= threshold ? "color-green" : "color-grey";
                            appendConsoleLog(`  - "${m.phrase.substring(0, 30)}..." | Similaridade Cosseno: ${m.similarity.toFixed(4)} | Status: ${isSelected}`, color);
                        });
                    }

                    setTimeout(() => {
                        // Passo 3: InjeÃ§Ã£o de Contexto & Montagem do Prompt
                        appendConsoleLog(`[PASSO 3] Sintetizando prompt contextualizado com MemÃ³ria Inteligente para o LLM...`);
                        
                        let contextBlock = "";
                        if (relevantMatches.length > 0) {
                            contextBlock = `--- MEMÃ“RIA INTELIGENTE (HistÃ³rico relevante recuperado) ---\n`;
                            relevantMatches.forEach((m, idx) => {
                                contextBlock += `- Registro antigo ${idx+1}: '${m.phrase}' | Feedback emocional pÃ³s-prÃ¡tica: ${m.rating}\n`;
                            });
                            contextBlock += `---------------------------------------------------------\n`;
                        } else {
                            contextBlock = `(Nenhum histÃ³rico semanticamente relevante foi injetado para economizar tokens)\n`;
                        }

                        const promptPreview = `
[SYSTEM PROMPT]
VocÃª Ã© o InnerMap, assistente especializado em reorganizar padrÃµes internos...

[RETRIEVED CONTEXT]
${contextBlock}
[USER QUERY]
Pergunta atual: "${query}"
`;
                        appendConsoleLog(`Prompt construÃ­do com sucesso:`);
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
                                <strong>LiberaÃ§Ã£o:</strong> <span style="font-family: monospace;">${result.declaracao}</span>
                            `;
                            if (ragConsoleLogs) ragConsoleLogs.appendChild(responseBlock);
                            
                            appendConsoleLog(`[COMPLETO] Registro atualizado salvo com sucesso na tabela journal_entries do PostgreSQL.`, "color-green");
                            
                            btnSimulateRag.disabled = false;
                            btnSimulateRag.innerHTML = 'Simular Fluxo RAG â†’';
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
        // Se o usuÃ¡rio for um terapeuta/admin, desativa o limite e o aviso de 15 dias de teste
        if (state.currentUser && state.currentUser.role === "therapist") {
            return true;
        }

        if (state.subscription && state.subscription.plan === "trial") {
            const activationDate = new Date(state.subscription.date);
            const currentDate = new Date();
            
            let diffTime = currentDate - activationDate;
            if (isNaN(diffTime)) {
                // Tenta tratar formato local dd/mm/aaaa se houver no histÃ³rico antigo
                const parts = state.subscription.date.split('/');
                if (parts.length === 3) {
                    const parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                    diffTime = currentDate - parsedDate;
                }
            }
            
            const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const daysRemaining = 15 - daysElapsed;
            
            if (daysRemaining <= 0) {
                alert("Seu perÃ­odo de teste de 15 dias acabou! Por favor, assine um plano para continuar.");
                state.saveSubscription(null);
                state.saveUser(null);
                if (supabaseClient) {
                    supabaseClient.auth.signOut();
                }
                updateUserUI();
                showScreen("auth");
                return false;
            } else if ([10, 5, 3, 1].includes(daysRemaining)) {
                showToast(`AtenÃ§Ã£o: Restam ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'} do seu perÃ­odo de teste! Assine o plano Mensal ou Anual para continuar.`);
            }
        }
        return true;
    }

    // InicializaÃ§Ã£o da Tela no Load
    if (supabaseClient) {
        // Carregar a base de padrÃµes do Supabase e semear se necessÃ¡rio
        loadPatternsFromSupabase().then(() => {
            seedPatternsDatabaseIfEmpty();
        });

        // 1. Obter sessÃ£o inicial de forma imediata (Promise)
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
            console.error("Erro ao obter sessÃ£o inicial:", err);
            showScreen("auth");
        });

        // 2. Ouvir mudanÃ§as futuras de autenticaÃ§Ã£o (como login, logout, OAuth)
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
        // Fallback local se Supabase nÃ£o configurado
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

    // Verificar retorno de pagamento da InfinitePay na URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
        const plan = urlParams.get("plan");
        // Limpar parÃ¢metros da URL para evitar recargas ativando repetidamente
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

    // Verificar se hÃ¡ algum pagamento pendente no localStorage e consultar na API da InfinitePay
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
            throw new Error("Erro na requisiÃ§Ã£o");
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
                console.log("Banco de dados do MÃ©todo carregado com sucesso do Supabase.");
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
                    console.log("Carga inicial de padrÃµes concluÃ­da com sucesso!");
                    await loadPatternsFromSupabase();
                } else {
                    console.error("Erro na carga inicial:", insertErr);
                }
            }
        } catch (err) {
            console.warn("Erro ao verificar/semear base de padrÃµes:", err);
        }
    }

    async function loadTherapistDashboardData() {
        if (!supabaseClient) {
            showToast("Supabase nÃ£o configurado.");
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

            // Guardar no escopo local do window para manipulaÃ§Ã£o
            window.dashProfiles = profiles;
            window.dashSubscriptions = subs;
            window.dashReorganizations = reorgs;

            // 2. Calcular estatÃ­sticas filtrando apenas contas que sÃ£o Clientes (role === 'client')
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
                    const daysRemaining = 15 - daysElapsed;
                    if (daysRemaining > 0) {
                        activeTrials++;
                    }
                }
            });

            const totalPractices = reorgs.filter(r => clientIds.has(r.user_id) || clientEmails.has(r.email) || clientEmails.has(r.user_id)).length;

            // Exibir estatÃ­sticas
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
                    <button class="btn btn-outline btn-view-history" data-email="${c.email}" data-id="${c.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Ver HistÃ³rico</button>
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
            container.innerHTML = `<p style="color: var(--color-text-muted); text-align: center; padding: 2rem 0;">Este cliente ainda nÃ£o realizou nenhuma prÃ¡tica informacional.</p>`;
        } else {
            clientReorgs.sort((a, b) => b.id - a.id);
            clientReorgs.forEach(r => {
                const card = document.createElement("div");
                card.className = "practice-item-card";
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--color-text-muted);">
                        <span>ðŸ“… ${r.date}</span>
                        <span style="font-weight: 600; color: var(--color-primary-glow);">${r.categoryEmoji}</span>
                    </div>
                    <div style="font-weight: 500; font-size: 1rem; margin-bottom: 0.75rem; color: var(--color-text-main);">"${r.phrase}"</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.85rem; padding-bottom: 0.75rem; border-bottom: 1px dashed rgba(255,255,255,0.06);">
                        <div><strong style="color: var(--color-text-muted);">PadrÃ£o Ativado:</strong><br>${r.title}</div>
                        <div><strong style="color: var(--color-text-muted);">Sentimento PÃ³s-PrÃ¡tica:</strong><br><span style="color: var(--color-primary);">${r.rating}</span></div>
                    </div>

                    <!-- Detalhes do DiagnÃ³stico e Comandos Sugeridos -->
                    <div class="practice-details-section" style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem; background: rgba(255,255,255,0.01); padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04);">
                        ${r.data && r.data.declaracaoEspecifica ? `
                        <div>
                            <strong style="color: #EA4335; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">âš ï¸ LiberaÃ§Ã£o EspecÃ­fica (1x na vida)</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(234, 67, 53, 0.03); border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 0.8rem; color: var(--color-text-main);">${r.data.declaracaoEspecifica}</p>
                        </div>
                        ` : ''}

                        ${r.data && r.data.declaracaoNaoEspecifica ? `
                        <div>
                            <strong style="color: var(--color-primary); font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">ðŸ”„ LiberaÃ§Ã£o NÃ£o EspecÃ­fica (1x por dia / 15 dias)</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(102, 252, 241, 0.03); border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 0.8rem; color: var(--color-text-main);">${r.data.declaracaoNaoEspecifica}</p>
                        </div>
                        ` : ''}

                        ${r.data && r.data.microacao ? `
                        <div>
                            <strong style="color: var(--color-primary-glow); font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">ðŸ’¡ MicroaÃ§Ã£o & SugestÃ£o de Melhoria</strong>
                            <p style="margin: 0; padding: 0.5rem; background: rgba(255, 255, 255, 0.02); border-radius: 4px; font-size: 0.8rem; color: var(--color-text-muted); white-space: pre-wrap;">${r.data.microacao}</p>
                        </div>
                        ` : ''}
                    </div>

                    <!-- BotÃµes de AÃ§Ãµes do Terapeuta -->
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 0.75rem;">
                        <button class="btn btn-outline btn-edit-reorg" data-id="${r.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Editar Ajustes</button>
                        <button class="btn btn-text btn-delete-reorg" data-id="${r.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #EA4335;">Excluir</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // Adicionar event listeners para os botÃµes de ediÃ§Ã£o e exclusÃ£o
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
        if (!confirm("Tem certeza que deseja excluir esta prÃ¡tica do histÃ³rico do cliente permanentemente?")) return;

        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from("reorganizations").delete().eq("id", reorgId);
                if (error) {
                    showToast("Erro ao excluir do Supabase: " + error.message);
                    return;
                }
            } catch (err) {
                console.error(err);
                showToast("Erro crÃ­tico ao excluir.");
                return;
            }
        }

        // Remover do escopo local
        window.dashReorganizations = window.dashReorganizations.filter(r => r.id !== reorgId);
        showToast("PrÃ¡tica excluÃ­da com sucesso!");
        
        // Re-renderizar o histÃ³rico e a lista
        openClientDetailsModal(email, clientId);
        loadTherapistDashboardData();
    }

    // Fechar e Submeter Modal de EdiÃ§Ã£o de ReorganizaÃ§Ã£o
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
                        showToast("Erro ao salvar alteraÃ§Ãµes no Supabase: " + error.message);
                        return;
                    }
                } catch (err) {
                    console.error(err);
                    showToast("Erro crÃ­tico ao salvar alteraÃ§Ãµes.");
                    return;
                }
            }

            // Atualizar no escopo local
            reorg.phrase = newPhrase;
            reorg.data = updatedData;

            showToast("Ajustes atualizados com sucesso!");
            modalEditReorg.style.display = "none";

            // Atualizar modal de histÃ³rico e estatÃ­sticas
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
            body.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Nenhum padrÃ£o cadastrado.</td></tr>`;
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
            titleEl.innerText = "Editar PadrÃ£o TerapÃªutico";
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
            titleEl.innerText = "Novo PadrÃ£o TerapÃªutico";
            idInput.value = "";
            idDisplayInput.value = "";
            idDisplayInput.disabled = false;
        }

        modal.style.display = "flex";
    }

    async function deletePattern(id) {
        if (!confirm(`Tem certeza que deseja excluir o padrÃ£o '${id}'? Esta aÃ§Ã£o nÃ£o pode ser desfeita.`)) {
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
                    showToast("PadrÃ£o excluÃ­do!");
                    await loadPatternsFromSupabase();
                    renderKbTable();
                }
            } else {
                if (window.patternsDatabase && window.patternsDatabase[id]) {
                    delete window.patternsDatabase[id];
                    showToast("ExcluÃ­do localmente (offline).");
                    renderKbTable();
                }
            }
        } catch (err) {
            console.error("Falha ao excluir padrÃ£o:", err);
            showToast("Erro crÃ­tico ao excluir.");
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
                showToast("ID invÃ¡lido.");
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
                        console.error("Erro ao salvar padrÃ£o no Supabase:", error);
                        showToast("Erro ao salvar padrÃ£o no banco remoto.");
                    } else {
                        showToast("PadrÃ£o salvo com sucesso!");
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
                console.error("Falha ao salvar padrÃ£o:", err);
                showToast("Erro crÃ­tico ao salvar.");
            } finally {
                btnSave.disabled = false;
                btnSave.innerText = "Salvar PadrÃ£o";
            }
        });
    }

    // ==========================================================================
    // LÃ³gica da Agenda de ExercÃ­cios DiÃ¡rios (15 dias)
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

        // Popula as informaÃ§Ãµes da agenda
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
                        showToast(`Dia ${day} concluÃ­do com sucesso! Ã“timo trabalho!`);
                        
                        // Se concluiu todos os 15 dias, parabenizar!
                        let allDone = true;
                        for (let d = 1; d <= 15; d++) {
                            if (!agenda.ticks[d]) {
                                allDone = false;
                                break;
                            }
                        }
                        if (allDone) {
                            showToast("ðŸŽ‰ ParabÃ©ns! VocÃª completou o ciclo de 15 dias de reprogramaÃ§Ã£o!");
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

            // Se o dia atual da prÃ¡tica ainda nÃ£o foi marcado como completo
            if (!agenda.ticks || !agenda.ticks[currentDay]) {
                // Verificar se jÃ¡ mostramos lembrete hoje para nÃ£o fludar
                const lastReminderStr = localStorage.getItem("last_reminder_date_" + emailKey);
                const todayStr = new Date().toDateString();
                if (lastReminderStr !== todayStr) {
                    localStorage.setItem("last_reminder_date_" + emailKey, todayStr);
                    
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("InnerMap: ExercÃ­cio de Hoje", {
                            body: `Dia ${currentDay} da sua reprogramaÃ§Ã£o: "${agenda.phrase}". Realize o comando diÃ¡rio e sua microaÃ§Ã£o!`,
                            icon: "favicon.ico"
                        });
                    } else {
                        showToast(`ðŸ“ Lembrete: Dia ${currentDay} da sua reprogramaÃ§Ã£o estÃ¡ pendente. Pratique hoje!`);
                    }
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    // InicializaÃ§Ã£o do botÃ£o de Lembretes
    const btnToggleReminders = document.getElementById("btn-toggle-reminders");
    if (btnToggleReminders) {
        const updateRemindersBtnUI = () => {
            const enabled = localStorage.getItem("reminders_enabled") === "true";
            if (enabled) {
                btnToggleReminders.className = "btn btn-outline active";
                btnToggleReminders.innerHTML = `<span>ðŸ”• Desativar Lembretes</span>`;
                btnToggleReminders.style.borderColor = "var(--color-primary)";
                btnToggleReminders.style.color = "var(--color-primary)";
            } else {
                btnToggleReminders.className = "btn btn-outline";
                btnToggleReminders.innerHTML = `<span>ðŸ”” Ativar Lembretes</span>`;
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
                        showToast("NotificaÃ§Ãµes ativadas com sucesso!");
                        new Notification("InnerMap", {
                            body: "VocÃª receberÃ¡ lembretes diÃ¡rios para realizar seus exercÃ­cios informacionais.",
                            icon: "favicon.ico"
                        });
                    } else {
                        showToast("PermissÃ£o de notificaÃ§Ã£o negada pelo navegador.");
                    }
                } else {
                    showToast("Este navegador nÃ£o suporta notificaÃ§Ãµes de Ã¡rea de trabalho.");
                }
            } else {
                localStorage.setItem("reminders_enabled", "false");
                showToast("Lembretes diÃ¡rios desativados.");
            }
            updateRemindersBtnUI();
        });

        updateRemindersBtnUI();
    }

    // ExpÃµe para uso em outros handlers
    window.renderAgenda = renderAgenda;
    window.checkDailyReminder = checkDailyReminder;
});
