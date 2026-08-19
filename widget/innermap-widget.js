/**
 * INNERMAP CHAT WIDGET ENGINE (WaveQuantum / Innermap.com.br Integration)
 */

(function () {
  'use strict';

  if (window.InnerMapWidgetInitialized) return;
  window.InnerMapWidgetInitialized = true;

  const CONFIG = {
    apiEndpoint: window.INNERMAP_API_URL || 'https://innermap-agent-api.glamorous-ant.workers.dev/api/chat',
    title: 'Innermap Atendimento',
    subtitle: 'Acolhimento & Triagem'
  };

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
              <i class="ri-heart-pulse-fill"></i>
            </div>
            <div>
              <div class="innermap-header-title">${CONFIG.title}</div>
              <div class="innermap-header-subtitle">
                <span class="status-dot"></span> Online agora
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

      <button class="innermap-widget-trigger" id="imTriggerBtn" title="Falar com o Innermap">
        <span class="unread-badge"></span>
        <i class="ri-chat-3-line"></i>
      </button>
    `;

    document.body.appendChild(wrapper);
  }

  function appendMessage(role, text, crisisData = null, quickReplies = null) {
    const chatBody = document.getElementById('imChatBody');
    if (!chatBody) return;

    const row = document.createElement('div');
    row.className = `im-msg-row ${role}`;

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
      const sendBtn = document.getElementById('imSendBtn');
      if (input) {
        input.disabled = true;
        input.placeholder = 'Atendimento suspenso para suporte a emergência.';
      }
      if (sendBtn) sendBtn.disabled = true;
    }

    if (quickReplies && Array.isArray(quickReplies) && quickReplies.length > 0 && !isCrisisMode) {
      contentHtml += `<div class="im-quick-replies">`;
      quickReplies.forEach(chipText => {
        contentHtml += `<button class="im-chip" data-chip="${escapeHtml(chipText)}">${escapeHtml(chipText)}</button>`;
      });
      contentHtml += `</div>`;
    }

    row.innerHTML = contentHtml;
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const chatBody = document.getElementById('imChatBody');
    if (!chatBody || document.getElementById('imTypingElem')) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'im-msg-row assistant';
    typingDiv.id = 'imTypingElem';
    typingDiv.innerHTML = `
      <div class="im-typing">
        <div class="im-typing-dot"></div>
        <div class="im-typing-dot"></div>
        <div class="im-typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTyping() {
    const elem = document.getElementById('imTypingElem');
    if (elem) elem.remove();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  async function sendMessage(textToSend) {
    const text = textToSend || (document.getElementById('imInput').value || '').trim();
    if (!text || isCrisisMode) return;

    const input = document.getElementById('imInput');
    if (input) input.value = '';

    messages.push({ role: 'user', content: text });
    appendMessage('user', text);

    showTyping();

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      const data = await response.json();
      hideTyping();

      if (data.isCrisis) {
        messages.push({ role: 'assistant', content: data.reply });
        appendMessage('assistant', data.reply, data.crisisData);
      } else if (data.reply) {
        messages.push({ role: 'assistant', content: data.reply });

        let chips = null;
        if (messages.length <= 2) {
          chips = ['Como funciona o aplicativo INNERMAP', 'Quero agendar uma sessão', 'O que é o Método InnerMap?', 'Como funciona a 1ª sessão?'];
        }

        appendMessage('assistant', data.reply, null, chips);
      }
    } catch (err) {
      hideTyping();
      appendMessage('assistant', 'Desculpe, ocorreu uma instabilidade de conexão. Por favor, tente novamente em instantes.');
    }
  }

  function initEvents() {
    const triggerBtn = document.getElementById('imTriggerBtn');
    const closeBtn = document.getElementById('imCloseBtn');
    const box = document.getElementById('imWidgetBox');
    const sendBtn = document.getElementById('imSendBtn');
    const input = document.getElementById('imInput');
    const chatBody = document.getElementById('imChatBody');

    triggerBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      box.classList.toggle('open', isOpen);
      if (isOpen && messages.length === 0) {
        const welcomeTxt = 'Olá! Seja muito bem-vindo(a) ao InnerMap. 😊\n\nEstou aqui para te ouvir, tirar dúvidas sobre a abordagem informacional ou te ajudar no uso do aplicativo.\n\nComo posso te apoiar hoje?';
        messages.push({ role: 'assistant', content: welcomeTxt });
        appendMessage('assistant', welcomeTxt, null, [
          'Como funciona o aplicativo INNERMAP',
          'Quero agendar uma sessão',
          'O que é o Método InnerMap?',
          'Como funciona a 1ª sessão?'
        ]);
      }
    });

    closeBtn.addEventListener('click', () => {
      isOpen = false;
      box.classList.remove('open');
    });

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    chatBody.addEventListener('click', (e) => {
      const chip = e.target.closest('.im-chip');
      if (chip) {
        const text = chip.getAttribute('data-chip');
        if (text) sendMessage(text);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectDependencies();
      createWidgetDOM();
      initEvents();
    });
  } else {
    injectDependencies();
    createWidgetDOM();
    initEvents();
  }
})();
