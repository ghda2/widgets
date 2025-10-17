(function() {
    'use strict';

    let baseUrl = '';

    // Aguarda o DOM estar carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

    function initChatWidget() {
        console.log('Inicializando widget de chat...');
        // Verifica se o widget já foi inicializado
        if (document.getElementById('nexr-chat-widget')) {
            return;
        }

        // Detecta o domínio base do script
        const currentScript = document.currentScript || document.querySelector('script[src*="widget.js"]');
        const scriptSrc = currentScript ? currentScript.src : '//bot.nexr.me/widget.js';
        baseUrl = scriptSrc.replace('/widget.js', '');
        console.log('Base URL detectado:', baseUrl);

        // Cria e injeta os estilos CSS
        createStyles();

        // Cria o botão launcher
        createLauncher(baseUrl);
        console.log('Launcher criado.');

        // Cria a janela do chat
        createChatWindow();

        // Adiciona event listeners
        addEventListeners();
    }

    function createStyles() {
        const styleId = 'nexr-chat-widget-styles';
        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Chat Widget Styles */
            #nexr-chat-launcher {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #007bff, #0056b3);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                transition: all 0.3s ease;
                border: none;
                outline: none;
            }

            #nexr-chat-launcher:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
            }

            #nexr-chat-launcher img {
                width: 28px;
                height: 28px;
                filter: brightness(0) invert(1);
            }

            #nexr-chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                z-index: 1000000;
                display: none;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
            }

            #nexr-chat-window.chat-aberto {
                display: flex;
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .nexr-chat-header {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            }

            .nexr-chat-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .nexr-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .nexr-chat-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .nexr-chat-body {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
                display: flex;
                flex-direction: column;
            }

            .nexr-welcome-message {
                background: white;
                padding: 16px;
                border-radius: 8px;
                margin-bottom: 16px;
                border-left: 4px solid #007bff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .nexr-welcome-message h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 14px;
                font-weight: 600;
            }

            .nexr-welcome-message p {
                margin: 0;
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }

            .nexr-chat-message {
                background: white;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 8px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                font-size: 14px;
                line-height: 1.4;
            }

            .nexr-chat-footer {
                padding: 16px 20px;
                border-top: 1px solid #e9ecef;
                background: white;
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .nexr-chat-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .nexr-chat-input:focus {
                border-color: #007bff;
            }

            .nexr-chat-input::placeholder {
                color: #999;
            }

            .nexr-chat-send {
                background: #007bff;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-weight: 500;
            }

            .nexr-chat-send:hover {
                background: #0056b3;
            }

            .nexr-chat-send:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            /* Responsividade para telas pequenas */
            @media (max-width: 480px) {
                #nexr-chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 140px);
                    right: 20px;
                    bottom: 90px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function createLauncher(baseUrl) {
        const launcher = document.createElement('div');
        launcher.id = 'nexr-chat-launcher';
        
        const icon = document.createElement('img');
        icon.src = baseUrl + '/chat-icon.svg';
        icon.alt = 'Chat';
        icon.onerror = function() {
            // Fallback se o SVG não carregar
            this.style.display = 'none';
            launcher.innerHTML = '💬';
            launcher.style.fontSize = '24px';
            launcher.style.color = 'white';
        };
        
        launcher.appendChild(icon);
        document.body.appendChild(launcher);
        console.log('Launcher criado e adicionado ao DOM.');
    }

    function createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'nexr-chat-window';
        
        // Header
        const header = document.createElement('div');
        header.className = 'nexr-chat-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Fale Conosco';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'nexr-chat-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Fechar chat');
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Body
        const body = document.createElement('div');
        body.className = 'nexr-chat-body';
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'nexr-welcome-message';
        
        const welcomeTitle = document.createElement('h4');
        welcomeTitle.textContent = '👋 Bem-vindo!';
        
        const welcomeText = document.createElement('p');
        welcomeText.textContent = 'Olá! Como podemos ajudá-lo hoje? Digite sua mensagem abaixo e entraremos em contato.';
        
        welcomeMessage.appendChild(welcomeTitle);
        welcomeMessage.appendChild(welcomeText);
        body.appendChild(welcomeMessage);
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'nexr-chat-footer';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'nexr-chat-input';
        input.placeholder = 'Digite sua mensagem...';
        input.setAttribute('aria-label', 'Digite sua mensagem');
        
        const sendButton = document.createElement('button');
        sendButton.className = 'nexr-chat-send';
        sendButton.textContent = 'Enviar';
        sendButton.disabled = true;
        
        footer.appendChild(input);
        footer.appendChild(sendButton);
        
        // Monta a janela
        chatWindow.appendChild(header);
        chatWindow.appendChild(body);
        chatWindow.appendChild(footer);
        
        document.body.appendChild(chatWindow);
        
        // Event listener para habilitar/desabilitar botão enviar
        input.addEventListener('input', function() {
            sendButton.disabled = this.value.trim() === '';
        });
        
        // Event listener para envio via Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !sendButton.disabled) {
                handleSendMessage();
            }
        });
        
        // Event listener para botão enviar
        sendButton.addEventListener('click', handleSendMessage);
        
        function handleSendMessage() {
            const message = input.value.trim();
            if (message) {
                // Envia a mensagem para o servidor
                fetch(baseUrl + '/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log('Mensagem enviada com sucesso:', message);
                        // Adiciona a mensagem ao chat
                        addMessageToChat('Você', message);
                    } else {
                        console.error('Erro ao enviar mensagem:', data.message);
                        alert('Erro ao enviar mensagem: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                    alert('Erro ao conectar com o servidor.');
                });
                
                // Limpa o input
                input.value = '';
                sendButton.disabled = true;
                
                // Feedback visual
                const originalText = sendButton.textContent;
                sendButton.textContent = 'Enviando...';
                setTimeout(() => {
                    sendButton.textContent = originalText;
                }, 1000);
            }
        }

        function addMessageToChat(sender, message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'nexr-chat-message';
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
            body.appendChild(messageDiv);
            body.scrollTop = body.scrollHeight;
        }
    }

    function addEventListeners() {
        const launcher = document.getElementById('nexr-chat-launcher');
        const chatWindow = document.getElementById('nexr-chat-window');
        const closeButton = document.querySelector('.nexr-chat-close');
        
        // Toggle chat ao clicar no launcher
        launcher.addEventListener('click', function() {
            chatWindow.classList.toggle('chat-aberto');
            
            // Foca no input quando abrir
            if (chatWindow.classList.contains('chat-aberto')) {
                setTimeout(() => {
                    const input = chatWindow.querySelector('.nexr-chat-input');
                    if (input) input.focus();
                }, 300);
            }
        });
        
        // Fechar chat ao clicar no botão fechar
        closeButton.addEventListener('click', function() {
            chatWindow.classList.remove('chat-aberto');
        });
        
        // Fechar chat ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && chatWindow.classList.contains('chat-aberto')) {
                chatWindow.classList.remove('chat-aberto');
            }
        });
        
        // Previne que cliques dentro da janela fechem o chat
        chatWindow.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Fechar chat ao clicar fora (opcional)
        document.addEventListener('click', function(e) {
            if (chatWindow.classList.contains('chat-aberto') && 
                !chatWindow.contains(e.target) && 
                !launcher.contains(e.target)) {
                chatWindow.classList.remove('chat-aberto');
            }
        });
    }

})();