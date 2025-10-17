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
        const scriptSrc = currentScript ? currentScript.src : '//localhost:8001/widget.js';
        baseUrl = scriptSrc.replace('/widget.js', '');
        console.log('Base URL detectado:', baseUrl);

        // Cria e injeta os estilos CSS
        createStyles();

        // Cria o botão launcher se não existir
        if (!document.getElementById('nexr-chat-launcher')) {
            createLauncher(baseUrl);
            console.log('Launcher criado.');
        }

        // Cria a janela do chat se não existir
        if (!document.getElementById('nexr-chat-window')) {
            createChatWindow();
        } else {
            // Se já existe, configura os event listeners
            setupChatWindow();
        }

        // Adiciona event listeners
        addEventListeners();
    }

    function createStyles() {
        const linkId = 'nexr-chat-widget-styles';
        if (document.getElementById(linkId)) {
            return;
        }

        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = baseUrl + '/widget.css';
        document.head.appendChild(link);

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

    function setupChatWindow() {
        const chatWindow = document.getElementById('nexr-chat-window');
        const input = chatWindow.querySelector('.nexr-chat-input');
        const sendButton = chatWindow.querySelector('.nexr-chat-send');
        const body = chatWindow.querySelector('.nexr-chat-body');

        // Event listener para habilitar/desabilitar botão enviar
        input.addEventListener('input', function() {
            sendButton.disabled = this.value.trim() === '';
        });

        // Event listener para envio via Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !sendButton.disabled) {
                handleSendMessage(input, sendButton, body);
            }
        });

        // Event listener para botão enviar
        sendButton.addEventListener('click', function() {
            handleSendMessage(input, sendButton, body);
        });

        function handleSendMessage(input, sendButton, body) {
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
                        addMessageToChat(body, 'Você', message);
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
    }

    function addMessageToChat(body, sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'nexr-chat-message';
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        body.appendChild(messageDiv);
        body.scrollTop = body.scrollHeight;
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