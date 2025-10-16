# Chat Widget Project

Este é um projeto completo para um widget de chat flutuante servido via FastAPI e containerizado com Docker.

## 🚀 Funcionalidades

- **Widget de Chat Flutuante**: Ícone de chat que aparece no canto inferior direito
- **Interface Interativa**: Janela de chat com animações suaves
- **Responsivo**: Funciona em desktop e dispositivos móveis
- **Fácil Integração**: Basta adicionar uma linha de script em qualquer site
- **Containerizado**: Deploy fácil com Docker e Docker Compose
- **Proxy Reverso**: Configurado com Caddy para SSL automático

## 📁 Estrutura do Projeto

```
chat_widget_project/
├── app/
│   ├── main.py              # Aplicação FastAPI
│   └── static/
│       ├── widget.js        # Script do widget
│       └── chat-icon.svg    # Ícone do chat
├── Dockerfile               # Configuração Docker
├── docker-compose.yml       # Orquestração dos serviços
├── Caddyfile               # Configuração do Caddy
├── requirements.txt        # Dependências Python
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

Para integrar o widget em qualquer site, adicione esta linha no HTML:

```html
<script src="https://bot.nexr.me/widget.js"></script>
```

### 3. Deploy em Produção

```bash
# Configurar o domínio no Caddyfile
# Executar em produção
docker-compose up -d

# O Caddy automaticamente:
# - Obtém certificado SSL via Let's Encrypt
# - Configura HTTPS
# - Faz proxy para a aplicação FastAPI
```

## 🔧 Configuração

### Variáveis de Ambiente

- `ENV`: Ambiente (development/production)
- `DOMAIN`: Domínio para o Caddy (padrão: bot.nexr.me)

### Personalizações

#### Modificar Aparência do Widget

Edite `app/static/widget.js` na função `createStyles()` para personalizar:

- Cores do tema
- Tamanho da janela
- Posicionamento
- Animações

#### Modificar Ícone

Substitua `app/static/chat-icon.svg` por seu próprio ícone SVG.

#### Adicionar Funcionalidades

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