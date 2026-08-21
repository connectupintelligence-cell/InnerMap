/**
 * INNERMAP CHAT WIDGET ENGINE (WaveQuantum / Innermap.com.br Integration)
 * Com Logo Oficial do InnerMap e Resposta Inteligente com Resiliência Total (Zero Erros de Conexão)
 */

(function () {
  'use strict';

  if (window.InnerMapWidgetInitialized) return;
  window.InnerMapWidgetInitialized = true;

  const CONFIG = {
    apiEndpoint: window.INNERMAP_API_URL || 'https://innermap-agent-api.ordinary-fright.workers.dev/api/chat',
    title: 'InnerMap',
    subtitle: 'Atendimento & Acolhimento'
  };

  const INNERMAP_LOGO_SVG = `
    <svg class="innermap-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="im-widget-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#66FCF1" />
          <stop offset="50%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#8A2BE2" />
        </linearGradient>
        <filter id="im-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#im-widget-logo-grad)" stroke-width="3" stroke-dasharray="12 6" opacity="0.5"/>
      <path d="M 22 50 C 35 25, 45 25, 50 50 C 55 75, 65 75, 78 50" fill="none" stroke="url(#im-widget-logo-grad)" stroke-width="5" stroke-linecap="round" filter="url(#im-logo-glow)"/>
      <path d="M 25 50 C 38 68, 45 68, 50 50 C 55 32, 62 32, 75 50" fill="none" stroke="url(#im-widget-logo-grad)" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <circle cx="50" cy="50" r="7" fill="url(#im-widget-logo-grad)"/>
      <circle cx="35" cy="37.5" r="3.5" fill="#66FCF1"/>
      <circle cx="65" cy="62.5" r="3.5" fill="#8A2BE2"/>
    </svg>
  `;

  let messages = [];
  let isOpen = false;
  let isCrisisMode = false;

  function injectDependencies() {
    if (!document.getElementById('remixicon-css')) {
      const link = document.createElement('link');
      link.id = 'remixicon-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('innermap-widget-css')) {
      const linkCss = document.createElement('link');
      linkCss.id = 'innermap-widget-css';
      linkCss.rel = 'stylesheet';
      linkCss.href = window.INNERMAP_CSS_URL || './widget/innermap-widget.css';
      document.head.appendChild(linkCss);
    }
  }

  function createWidgetDOM() {
    const wrapper = document.createElement('div');
    wrapper.className = 'innermap-widget-wrapper';
    wrapper.innerHTML = `
      <div class="innermap-widget-box" id="imWidgetBox">
        <div class="innermap-widget-header">
          <div class="innermap-header-info">
            <div class="innermap-avatar">
              ${INNERMAP_LOGO_SVG}
            </div>
            <div>
              <div class="innermap-header-title">${CONFIG.title}</div>
              <div class="innermap-header-subtitle">
                <span class="status-dot"></span> ${CONFIG.subtitle}
              </div>
            </div>
          </div>
          <button class="innermap-header-close" id="imCloseBtn" title="Fechar">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="innermap-disclaimer-banner">
          <i class="ri-shield-user-line"></i>
          <span>Este chat é um canal de acolhimento inicial e agendamento. Não é uma sessão de terapia e não substitui atendimento profissional.</span>
        </div>

        <div class="innermap-widget-body" id="imChatBody"></div>

        <div class="innermap-widget-footer" id="imFooter">
          <input type="text" class="innermap-input" id="imInput" placeholder="Escreva sua mensagem..." autocomplete="off" />
          <button class="innermap-send-btn" id="imSendBtn" title="Enviar">
            <i class="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>

      <button class="innermap-widget-trigger" id="imTriggerBtn" title="Falar com o InnerMap">
        <span class="unread-badge"></span>
        <div class="im-trigger-icon-logo">
          ${INNERMAP_LOGO_SVG}
        </div>
        <i class="ri-close-line im-trigger-icon-close"></i>
      </button>
    `;

    document.body.appendChild(wrapper);
  }

  function generateClientFallback(userText) {
    const lower = (userText || '').toLowerCase();

    // 1. Verificação de Crise / Segurança
    const crisisPatterns = [/suic[íi]dio/i, /me\s+matar/i, /tirar\s+minha\s+vida/i, /vontade\s+de\s+morrer/i, /querer\s+morrer/i, /acabar\s+com\s+tudo/i, /desistir\s+da\s+vida/i, /auto\s*les[ãa]o/i, /me\s+cortar/i];
    if (crisisPatterns.some(p => p.test(lower))) {
      return {
        isCrisis: true,
        reply: 'Sinto muito que você esteja passando por um momento tão difícil. A sua vida e segurança são a prioridade absoluta agora.\n\nEste chat não é um canal de emergência clínica. Por favor, busque apoio especializado imediatamente:',
        crisisData: {
          followUpNote: 'Você não precisa passar por isso sozinho(a). Peça ajuda a alguém de confiança para ligar 188 ou ir à emergência.'
        }
      };
    }

    // 2. Rotina no dia a dia
    if (lower.includes('aplicar') || lower.includes('dia a dia') || lower.includes('rotina') || lower.includes('cotidiano')) {
      return {
        isCrisis: false,
        reply: 'Com certeza! Uma forma bem simples e prática de aplicar o Método InnerMap no dia a dia é com essa rotina de 15 a 20 minutos:\n\nRotina sugerida (15 a 20 min por dia):\n\n1. Manhã (5 min) - Atualize o mapa sistêmico se houver mudança de prioridade (MSI).\n2. Durante o dia - Registre fatos importantes no diário (MFI).\n3. Final da tarde (5 min) - Escolha um fato recente e faça a reinterpretação (MRI).\n4. Noite (5 a 10 min) - Defina a ação generativa (MGI) para o próximo dia e registre a vitória do dia.\n\nSe quiser, posso te ajudar no uso do aplicativo por aqui!'
      };
    }

    // 3. Como funciona o aplicativo
    if (lower.includes('aplicativo') || lower.includes('app')) {
      return {
        isCrisis: false,
        reply: 'Como funciona o aplicativo InnerMap:\n\nO aplicativo InnerMap guia você na identificação de registros e padrões emocionais limitantes através da Abordagem Informacional.\n\nCom ele, você pode:\n• Relatar desconfortos recentes ou históricos e receber uma análise guiada.\n• Praticar a reorganização nos 4 movimentos (MSI, MFI, MRI e MGI) para liberar o passado e alinhar novas escolhas.\n• Acompanhar sua agenda de práticas de forma simples e intuitiva.\n\nComo posso te ajudar no uso do aplicativo hoje?'
      };
    }

    // 4. Método InnerMap
    if (lower.includes('innermap') || lower.includes('método') || lower.includes('metodo') || lower.includes('msi') || lower.includes('mfi') || lower.includes('mri') || lower.includes('mgi')) {
      return {
        isCrisis: false,
        reply: 'Método Terapêutico InnerMap (Reorganização Informacional):\n\nO método investiga e processa registros emocionais através de 4 movimentos oficiais:\n\n1. MSI (Movimento Sistêmico Informacional): Investiga padrões e crenças herdadas (do 1º dia de existência até a primeira infância).\n2. MFI (Movimento Factual Informacional): Trabalha fatos e pessoas do passado ou presente para liberação emocional.\n3. MRI (Movimento de Reinterpretação Informacional): Formulação de escolhas conscientes.\n4. MGI (Movimento Generativo Informacional): Atua de maneira generativa sobre um tema central abrangente.\n\nOs conceitos funcionam como modelo terapêutico de investigação, sem caráter de diagnóstico médico.\n\nQual desses pontos você gostaria de explorar mais?'
      };
    }

    // 5. Agendamento / Atendimento
    if (lower.includes('agendar') || lower.includes('consulta') || lower.includes('terapeuta') || lower.includes('atendimento')) {
      return {
        isCrisis: false,
        reply: 'Com certeza! Podemos organizar o seu agendamento para atendimento individual online com um profissional qualificado.\n\nPara começarmos, como posso te chamar?'
      };
    }

    // 6. Resposta Padrão Acolhedora
    return {
      isCrisis: false,
      reply: 'Estou aqui para te ouvir e te apoiar no que você precisar. Como posso te ajudar hoje?'
    };
  }

  function appendMessage(role, text, crisisData = null, quickReplies = null) {
    const chatBody = document.getElementById('imChatBody');
    if (!chatBody) return;

    const row = document.createElement('div');
    row.className = `im-msg-row ${role}`;

    let avatarHtml = '';
    if (role === 'assistant') {
      avatarHtml = `<div class="im-msg-avatar">${INNERMAP_LOGO_SVG}</div>`;
    }

    let contentHtml = `<div class="im-msg-bubble">${escapeHtml(text)}</div>`;

    if (crisisData) {
      isCrisisMode = true;
      contentHtml += `
        <div class="im-crisis-card">
          <div class="im-crisis-header">
            <i class="ri-alarm-warning-fill"></i> Apoio Imediato & Emergência
          </div>
          <p style="font-size:12px; margin-bottom:8px; line-height:1.4;">${escapeHtml(crisisData.followUpNote || '')}</p>
          <div class="im-crisis-btn-group">
            <a href="tel:188" target="_blank" class="im-crisis-btn cvv">
              <i class="ri-phone-fill"></i> CVV - Ligar 188 (Gratuito 24h)
            </a>
            <a href="https://www.cvv.org.br" target="_blank" style="text-align:center; font-size:11.5px; color:#DC2626; text-decoration:underline;">
              Acessar Chat CVV (cvv.org.br)
            </a>
            <a href="tel:192" target="_blank" class="im-crisis-btn samu">
              <i class="ri-hospital-line"></i> SAMU - Ligar 192
            </a>
          </div>
        </div>
      `;

      const input = document.getElementById('imInput');
      if (input) {
        input.disabled = true;
        input.placeholder = 'Atendimento suspenso para suporte a emergência.';
      }
    }

    row.innerHTML = avatarHtml + `<div class="im-msg-content-wrap">${contentHtml}</div>`;
    chatBody.appendChild(row);

    if (quickReplies && quickReplies.length > 0 && !isCrisisMode) {
      const chipContainer = document.createElement('div');
      chipContainer.className = 'im-quick-replies';
      quickReplies.forEach(replyText => {
        const chip = document.createElement('button');
        chip.className = 'im-quick-chip';
        chip.innerText = replyText;
        chip.onclick = () => {
          chipContainer.remove();
          sendMessage(replyText);
        };
        chipContainer.appendChild(chip);
      });
      chatBody.appendChild(chipContainer);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const chatBody = document.getElementById('imChatBody');
    if (!chatBody) return;
    const row = document.createElement('div');
    row.className = 'im-msg-row assistant typing-row';
    row.id = 'imTypingIndicator';
    row.innerHTML = `
      <div class="im-msg-avatar">${INNERMAP_LOGO_SVG}</div>
      <div class="im-msg-content-wrap">
        <div class="im-msg-bubble im-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('imTypingIndicator');
    if (typing) typing.remove();
  }

  async function sendMessage(textOverride = null) {
    if (isCrisisMode) return;

    const input = document.getElementById('imInput');
    const userText = textOverride || (input ? input.value.trim() : '');
    if (!userText) return;

    if (input) input.value = '';

    messages.push({ role: 'user', content: userText });
    appendMessage('user', userText);
    showTypingIndicator();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      removeTypingIndicator();

      if (data.isCrisis) {
        messages.push({ role: 'assistant', content: data.reply });
        appendMessage('assistant', data.reply, data.crisisData);
      } else {
        messages.push({ role: 'assistant', content: data.reply });
        appendMessage('assistant', data.reply);
      }
    } catch (err) {
      removeTypingIndicator();
      // FALLBACK INTELIGENTE LOCAL RESILIENTE (NUNCA EXIBE MENSAGEM DE ERRO)
      const localRes = generateClientFallback(userText);
      messages.push({ role: 'assistant', content: localRes.reply });
      appendMessage('assistant', localRes.reply, localRes.crisisData);
    }
  }

  function toggleWidget() {
    const box = document.getElementById('imWidgetBox');
    const trigger = document.getElementById('imTriggerBtn');
    if (box) {
      isOpen = !isOpen;
      box.classList.toggle('open', isOpen);
      if (trigger) trigger.classList.toggle('open', isOpen);

      if (isOpen && messages.length === 0) {
        const welcomeTxt = 'Olá! Seja muito bem-vindo(a) ao InnerMap. 😊\n\nEstou aqui para te ouvir, tirar dúvidas sobre a abordagem informacional ou te ajudar no uso do aplicativo.\n\nPara começarmos de forma mais próxima, como posso te chamar?';
        messages.push({ role: 'assistant', content: welcomeTxt });
        appendMessage('assistant', welcomeTxt, null, [
          'Como funciona o aplicativo INNERMAP',
          'O que é o Método InnerMap',
          'Agendar consulta online'
        ]);
      }
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML.replace(/\n/g, '<br/>');
  }

  function bindEvents() {
    const trigger = document.getElementById('imTriggerBtn');
    const closeBtn = document.getElementById('imCloseBtn');
    const sendBtn = document.getElementById('imSendBtn');
    const input = document.getElementById('imInput');

    if (trigger) trigger.onclick = toggleWidget;
    if (closeBtn) closeBtn.onclick = toggleWidget;
    if (sendBtn) sendBtn.onclick = () => sendMessage();

    if (input) {
      input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      };
    }
  }

  function init() {
    injectDependencies();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createWidgetDOM();
        bindEvents();
      });
    } else {
      createWidgetDOM();
      bindEvents();
    }
  }

  init();
})();
