;(function () {
    'use strict'

    // Evita instalação duplicada
    if (window.__NEXR_WIDGET_LOADED__) {
        return
    }
    window.__NEXR_WIDGET_LOADED__ = true

    // Descobre a URL base do script e lê configurações do data-attributes
    const currentScript =
        document.currentScript || document.querySelector('script[src*="widget.js"]')
    const scriptSrc = currentScript ? currentScript.src : window.location.origin + '/widget.js'
    const explicitBase = currentScript && currentScript.dataset.baseUrl
    const baseUrl = (explicitBase || scriptSrc).replace(/\/widget\.js(?:\?.*)?$/, '')

    const config = {
        position: (currentScript && currentScript.dataset.position) || 'bottom-right',
        primaryColor: (currentScript && currentScript.dataset.primaryColor) || '#dc3545',
        title: (currentScript && currentScript.dataset.title) || 'Fale Conosco',
        clientId: (currentScript && currentScript.dataset.clientId) || 'default', // Novo: ID do cliente
    }

    function createStyles(primary) {
        return `
            :host { all: initial; }
            *, *::before, *::after { box-sizing: border-box; }
            :host { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            :host { --primary-color: ${primary}; --primary-dark: #b02a37; --border-color: #ddd; --text-primary: #333; --text-secondary: #666; --bg-light: #f8f9fa; --shadow: 0 4px 12px rgba(0,0,0,.2); }

            #n-launcher {
                position: fixed; inset: auto 20px 20px auto; width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: #fff; display: flex; align-items: center; justify-content: center;
                box-shadow: var(--shadow); z-index: 2147483000; transition: transform .2s ease, box-shadow .2s ease; padding: 0;
            }
            :host([data-pos="bottom-left"]) #n-launcher { inset: auto auto 20px 20px; }
            #n-launcher:hover { transform: scale(1.06); }
            #n-launcher:active { transform: scale(.96); }
            #n-badge { position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%; background: #28a745; color: #fff; display: none; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
            #n-badge.show { display: flex; }

            #n-window { position: fixed; inset: auto 20px 90px auto; width: 350px; height: 500px; background: #fff; border-radius: 12px; overflow: hidden;
                box-shadow: 0 8px 32px rgba(0,0,0,.2); display: flex; flex-direction: column; opacity: 0; transform: translateY(20px) scale(.96); pointer-events: none;
                transition: all .25s cubic-bezier(.4,0,.2,1); z-index: 2147483001; }
            :host([data-pos="bottom-left"]) #n-window { inset: auto auto 90px 20px; }
            #n-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

            #n-header { background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: #fff; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; }
            #n-title { margin: 0; font-size: 15px; font-weight: 600; }
            #n-close { background: none; border: none; color: #fff; font-size: 22px; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }
            #n-close:hover { background: rgba(255,255,255,.18); }

            #n-body { flex: 1; background: var(--bg-light); padding: 16px; overflow: auto; display: flex; flex-direction: column; gap: 10px; }
            .n-msg { background: #fff; padding: 10px 12px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.08); font-size: 14px; color: var(--text-primary); }
            .n-msg.user { background: var(--primary-color); color: #fff; margin-left: 40px; text-align: right; }
            .n-msg.bot { margin-right: 40px; }
            .n-welcome { background: #fff; border-left: 4px solid var(--primary-color); }

            #n-footer { background: #fff; border-top: 1px solid var(--border-color); padding: 10px; display: flex; align-items: center; gap: 8px; }
            #n-input { flex: 1; border: 1px solid var(--border-color); border-radius: 18px; padding: 10px 12px; font-size: 14px; outline: none; }
            #n-input:focus { border-color: var(--primary-color); }
            #n-send { background: var(--primary-color); color: #fff; border: none; border-radius: 18px; padding: 10px 14px; font-size: 14px; cursor: pointer; }
            #n-send:disabled { background: #ccc; cursor: not-allowed; }

            @media (max-width: 480px) {
                #n-window { width: calc(100vw - 40px); height: calc(100vh - 140px); }
            }
        `
    }

    function init() {
        // Container raiz com Shadow DOM para isolar CSS/HTML
        const mountId = 'nexr-widget-mount'
        if (document.getElementById(mountId)) return
        const mount = document.createElement('div')
        mount.id = mountId
        document.body.appendChild(mount)
        const root = mount.attachShadow({ mode: 'open' })

        // Suporte a posição
        mount.setAttribute('data-pos', config.position === 'bottom-left' ? 'bottom-left' : 'bottom-right')

        // Carrega estilos personalizados do cliente
        loadClientStyles(root).then(() => {
            // Estilos padrão (fallback)
            const style = document.createElement('style')
            style.textContent = createStyles(config.primaryColor)
            root.appendChild(style)

            // Continua com a criação do HTML...
            createWidgetHTML(root)
        }).catch(() => {
            // Fallback se falhar ao carregar estilos
            const style = document.createElement('style')
            style.textContent = createStyles(config.primaryColor)
            root.appendChild(style)
            createWidgetHTML(root)
        })
    }

    async function loadClientStyles(root) {
        try {
            const response = await fetch(`${baseUrl}/client/${config.clientId}/styles.css`)
            if (response.ok) {
                const cssText = await response.text()
                const clientStyle = document.createElement('style')
                clientStyle.textContent = cssText
                root.appendChild(clientStyle)
            }
        } catch (e) {
            console.warn('[nexr-widget] Failed to load client styles:', e)
        }
    }

    function createWidgetHTML(root) {
        // HTML minimal do widget
        const launcher = document.createElement('button')
        launcher.id = 'n-launcher'
        launcher.setAttribute('aria-label', 'Abrir chat de suporte')
        launcher.setAttribute('aria-expanded', 'false')
        launcher.innerHTML = '<span style="font-size:26px">💬</span><span id="n-badge" aria-label="Nova mensagem">1</span>'

        const win = document.createElement('div')
        win.id = 'n-window'
        win.setAttribute('role', 'dialog')
        win.setAttribute('aria-modal', 'true')

        const header = document.createElement('div')
        header.id = 'n-header'
        header.innerHTML = `<h3 id="n-title">${config.title}</h3>`
        const close = document.createElement('button')
        close.id = 'n-close'
        close.setAttribute('aria-label', 'Fechar chat')
        close.textContent = '×'
        header.appendChild(close)

        const body = document.createElement('div')
        body.id = 'n-body'
        const welcome = document.createElement('div')
        welcome.className = 'n-msg n-welcome'
        welcome.innerHTML = '<strong>👋 Bem-vindo!</strong><br/>Olá! Como podemos ajudá-lo hoje?'
        body.appendChild(welcome)

        const footer = document.createElement('div')
        footer.id = 'n-footer'
        const input = document.createElement('input')
        input.id = 'n-input'
        input.type = 'text'
        input.placeholder = 'Digite sua mensagem...'
        const send = document.createElement('button')
        send.id = 'n-send'
        send.type = 'button'
        send.textContent = 'Enviar'
        send.disabled = true
        footer.appendChild(input)
        footer.appendChild(send)

        win.appendChild(header)
        win.appendChild(body)
        win.appendChild(footer)

        root.appendChild(launcher)
        root.appendChild(win)

        // Estado
        let isOpen = false
        const badge = launcher.querySelector('#n-badge')

        function toggle(open) {
            isOpen = open ?? !isOpen
            win.classList.toggle('open', isOpen)
            launcher.setAttribute('aria-expanded', String(isOpen))
            if (isOpen) {
                badge.classList.remove('show')
                setTimeout(() => input.focus(), 50)
            }
        }

        function addMessage(text, who) {
            const m = document.createElement('div')
            m.className = `n-msg ${who}`
            m.textContent = text
            body.appendChild(m)
            body.scrollTop = body.scrollHeight
        }

        function updateSendState() {
            send.disabled = !(input.value && input.value.trim().length > 0)
        }

        async function sendMessage() {
            const text = (input.value || '').trim()
            if (!text) return
            addMessage(text, 'user')
            input.value = ''
            updateSendState()

            try {
                const res = await fetch(baseUrl + '/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: text,
                        page: location.href,
                        userAgent: navigator.userAgent,
                        clientId: config.clientId, // Novo: envia ID do cliente
                        ts: Date.now(),
                    }),
                })
                if (!res.ok) throw new Error('Falha ao enviar')
                const data = await res.json()
                const reply = (data && data.reply) || 'Obrigado! Recebemos sua mensagem.'
                addMessage(reply, 'bot')
            } catch (e) {
                addMessage('Desculpe, houve um erro ao enviar. Tente novamente mais tarde.', 'bot')
                console.error('[nexr-widget] send-message error:', e)
            }
        }

        // Eventos
        launcher.addEventListener('click', () => toggle())
        close.addEventListener('click', () => toggle(false))
        input.addEventListener('input', updateSendState)
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                sendMessage()
            }
        })
        send.addEventListener('click', sendMessage)

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            const path = e.composedPath ? e.composedPath() : []
            if (isOpen && !path.includes(mount)) {
                toggle(false)
            }
        })
        // ESC fecha
        document.addEventListener('keydown', (e) => {
            if (isOpen && e.key === 'Escape') toggle(false)
        })

        // Simula badge de nova mensagem após 5s se fechado
        setTimeout(() => {
            if (!isOpen) badge.classList.add('show')
        }, 5000)
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
    } else {
        init()
    }
})()
