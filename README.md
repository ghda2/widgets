# 🤖 Chat Widget Project - Bot Nexr

Widget de chat inteligente multi-tenant com IA integrada (Google Gemini), personalização por cliente e deploy containerizado.

## 🚀 Funcionalidades

- **Widget de Chat Flutuante**: Ícone de chat que aparece no canto inferior direito
- **Multi-Tenant**: Suporte a múltiplos clientes com configurações independentes
- **IA Personalizada**: Cada cliente tem suas próprias instruções e comportamento da IA
- **Estilos Customizáveis**: CSS personalizado por cliente via Shadow DOM
- **Interface Interativa**: Janela de chat com animações suaves e responsiva
- **Fácil Integração**: Basta adicionar uma linha de script em qualquer site
- **Containerizado**: Deploy fácil com Docker e Docker Compose
- **Proxy Reverso**: Configurado com Caddy para SSL automático
- **Google Gemini**: Respostas inteligentes usando modelo gemini-2.0-flash

## 📁 Estrutura do Projeto

```
chat_widget_project/
├── app/
│   ├── main.py              # Aplicação FastAPI com endpoints REST
│   ├── ai_handler.py        # Integração com Google Gemini AI
│   ├── index.html           # Página principal
│   ├── test.html            # Página de teste do widget
│   ├── test_serinox.html    # Página de teste - Serinox
│   ├── test_nexr.html       # Página de teste - Nexr
│   └── static/
│       └── widget.js        # Script do widget (Shadow DOM)
├── clients/                 # Configurações por cliente
│   ├── default/
│   │   ├── instructions.md  # Prompt da IA
│   │   └── styles.css       # Estilos personalizados
│   ├── serinox/
│   │   ├── instructions.md
│   │   └── styles.css
│   └── nexr/
│       ├── instructions.md
│       └── styles.css
├── Dockerfile               # Configuração Docker
├── docker-compose.yml       # Orquestração dos serviços
├── Caddyfile               # Configuração do Caddy (proxy reverso)
├── requirements.txt        # Dependências Python
├── INSTRUCOES_CLIENTES.md  # Documentação de integração
├── EXEMPLO_SERINOX.html    # Exemplo de site com widget
└── README.md              # Este arquivo
```

## 🛠️ Como Usar

### 1. Development Local

```bash
# Clonar o projeto
git clone <seu-repositorio>
cd chat_widget_project

# Construir e executar com Docker Compose
docker-compose up --build

# A aplicação estará disponível em:
# - http://localhost:8000 (FastAPI)
# - http://localhost:8080 (Caddy proxy)
```

### 2. Integração no Site

Para integrar o widget em qualquer site, adicione o script no final do `<body>`:

#### Cliente Serinox:
```html
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="serinox"
    data-title="Fale com a Serinox"
    data-primary-color="#2c3e50"
></script>
```

#### Cliente Nexr:
```html
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="nexr"
    data-title="Fale com a Nexr"
    data-primary-color="#ff6b6b"
></script>
```

#### Cliente Default (padrão):
```html
<script src="https://bot.nexr.me/widget.js"></script>
```

Veja o arquivo `INSTRUCOES_CLIENTES.md` para documentação completa.

### 3. Deploy em Produção

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves reais

# 2. Executar em produção
docker-compose up -d

# 3. Verificar se está funcionando
curl https://bot.nexr.me/health
```

#### Configuração de Produção
- **Domínio**: Configure `DOMAIN=bot.nexr.me` no `.env`
- **SSL**: Caddy automaticamente obtém certificado Let's Encrypt
- **API Key**: Configure `GOOGLE_AI_API_KEY` no `.env`
- **Logs**: Verifique `/var/log/caddy/bot.nexr.me.log` no container Caddy

## 🔧 Configuração

### Variáveis de Ambiente

- `GOOGLE_AI_API_KEY`: Chave da API do Google Gemini (obrigatória)
- `ENV`: Ambiente (development/production)
- `DOMAIN`: Domínio para o Caddy (padrão: bot.nexr.me)

### 🎨 Adicionar Novo Cliente

1. **Criar pasta do cliente:**
```bash
mkdir clients/nome-cliente
```

2. **Criar arquivo de instruções** (`clients/nome-cliente/instructions.md`):
```markdown
# Instruções para o Assistente - Nome do Cliente

Você é um assistente especializado de [Nome da Empresa]...

## Comportamento:
- Seja profissional
- Responda em português brasileiro
...
```

3. **Criar estilos personalizados** (`clients/nome-cliente/styles.css`):
```css
:root {
  --primary-color: #seu-azul;
  --primary-dark: #seu-azul-escuro;
  /* ... outras variáveis */
}
```

4. **Usar no site:**
```html
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="nome-cliente"
></script>
```

### Personalizações do Widget

#### Via Atributos HTML:
- `data-client-id`: ID do cliente (default: "default")
- `data-title`: Título do chat (default: "Fale Conosco")
- `data-primary-color`: Cor principal (default: "#dc3545")
- `data-position`: Posição do botão ("bottom-right" ou "bottom-left")

Para adicionar funcionalidades de backend (envio de mensagens, integração com APIs, etc.), modifique:

- `app/main.py`: Adicionar endpoints
- `app/static/widget.js`: Implementar chamadas para APIs

## 🌐 Endpoints da API

- `GET /`: Status da API
- `GET /widget.js`: Script do widget
- `GET /chat-icon.svg`: Ícone do chat
- `GET /health`: Health check

## 📱 Funcionalidades do Widget

### Interface do Usuário

- **Launcher**: Botão flutuante no canto inferior direito
- **Janela de Chat**: Interface limpa e moderna
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Animações**: Transições suaves para melhor UX

### Interações

- **Clicar no launcher**: Abre/fecha a janela de chat
- **Botão fechar**: Fecha a janela de chat
- **ESC**: Fecha a janela de chat
- **Clicar fora**: Fecha a janela de chat
- **Enter**: Envia mensagem (placeholder)

### Recursos Técnicos

- **Auto-detecção de domínio**: Funciona em qualquer domínio
- **Fallback de ícone**: Emoji se SVG não carregar
- **Prevenção de conflitos**: IDs únicos e namespace isolado
- **Acessibilidade**: Labels ARIA e navegação por teclado

## 🔒 Segurança

- **CORS**: Configurado para permitir uso em outros domínios
- **Headers de Segurança**: X-Content-Type-Options, X-Frame-Options, etc.
- **Rate Limiting**: Proteção contra abuso (via Caddy)
- **SSL/TLS**: HTTPS automático via Let's Encrypt

## 📊 Monitoramento

- **Health Check**: Endpoint `/health` para verificação
- **Logs**: Logs estruturados em JSON via Caddy
- **Métricas**: Docker Compose com healthcheck

## 🚀 Deploy Avançado

### Com SSL Personalizado

```yaml
# docker-compose.yml
services:
  caddy:
    volumes:
      - ./ssl:/ssl
      - ./Caddyfile.ssl:/etc/caddy/Caddyfile
```

### Com Banco de Dados

```yaml
# Adicionar ao docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chatwidget
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🛠️ Desenvolvimento

### Executar Localmente Sem Docker

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Executar Testes

```bash
# Instalar dependências de desenvolvimento
pip install pytest pytest-asyncio httpx

# Executar testes
pytest
```

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do chat widget! 😉

---

Desenvolvido com ❤️ para facilitar a comunicação entre sites e seus visitantes.