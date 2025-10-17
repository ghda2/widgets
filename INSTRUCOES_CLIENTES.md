# 📋 Instruções de Integração do Widget - Bot Nexr

## 🚀 Como Integrar o Widget no Seu Site

### Para a **Serinox**

Adicione o seguinte código ao final do `<body>` do seu site, antes da tag de fechamento `</body>`:

```html
<!-- Widget de Chat da Nexr - Serinox -->
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="serinox"
    data-title="Fale com a Serinox"
    data-primary-color="#2c3e50"
    data-position="bottom-right"
></script>
```

#### Opções de Configuração:

| Atributo | Descrição | Padrão | Exemplo |
|----------|-----------|--------|---------|
| `data-client-id` | **Obrigatório** - ID único do cliente | `default` | `serinox` |
| `data-title` | Título que aparece no cabeçalho do chat | `Fale Conosco` | `Fale com a Serinox` |
| `data-primary-color` | Cor principal do widget | `#dc3545` | `#2c3e50` |
| `data-position` | Posição do botão flutuante | `bottom-right` | `bottom-left` |

---

### Para a **Nexr**

```html
<!-- Widget de Chat da Nexr -->
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="nexr"
    data-title="Fale com a Nexr"
    data-primary-color="#ff6b6b"
    data-position="bottom-right"
></script>
```

---

### Para o **Cliente Padrão (Default)**

```html
<!-- Widget de Chat -->
<script 
    src="https://bot.nexr.me/widget.js" 
    data-client-id="default"
></script>
```

---

## 🎨 Personalização

Cada cliente tem sua própria personalização através de arquivos na pasta `clients/<client-id>/`:

### Estrutura de Arquivos por Cliente:

```
clients/
├── serinox/
│   ├── instructions.md    # Instruções/Prompt para a IA
│   └── styles.css         # Estilos CSS personalizados
├── nexr/
│   ├── instructions.md
│   └── styles.css
└── default/
    ├── instructions.md
    └── styles.css
```

### Como Personalizar:

1. **Instruções da IA** (`instructions.md`):
   - Define o comportamento do assistente
   - Informações sobre produtos/serviços
   - Tom de voz e estilo de resposta

2. **Estilos** (`styles.css`):
   - Cores personalizadas
   - Tipografia
   - Layout do chat
   - Animações

---

## 🧪 Testes

### Páginas de Teste Locais:

- **Serinox**: http://localhost:8001/test/serinox
- **Nexr**: http://localhost:8001/test/nexr
- **Default**: http://localhost:8001/test

### Páginas de Teste em Produção:

- **Serinox**: https://bot.nexr.me/test/serinox
- **Nexr**: https://bot.nexr.me/test/nexr
- **Default**: https://bot.nexr.me/test

---

## 📊 Endpoints da API

### Enviar Mensagem
```
POST https://bot.nexr.me/send-message
Content-Type: application/json

{
    "message": "Olá, preciso de ajuda",
    "clientId": "serinox",
    "page": "https://exemplo.com/produtos",
    "userAgent": "Mozilla/5.0..."
}
```

### Health Check
```
GET https://bot.nexr.me/health
```

### Carregar Estilos do Cliente
```
GET https://bot.nexr.me/client/{clientId}/styles.css
```

---

## 🔧 Suporte

Para adicionar um novo cliente ou modificar configurações:

1. Criar pasta em `clients/<novo-cliente>/`
2. Adicionar `instructions.md` e `styles.css`
3. Reiniciar o container Docker
4. Testar com `data-client-id="novo-cliente"`

---

## 📝 Notas Importantes

- ✅ O widget usa **Shadow DOM** para isolamento total de CSS
- ✅ **Responsivo** e funciona em mobile
- ✅ **Acessível** com suporte a teclado e screen readers
- ✅ **CORS configurado** para aceitar requisições de qualquer origem
- ✅ Cada cliente tem sua **própria IA personalizada**

---

## 🚢 Deploy

O widget está rodando em produção em:
- **URL Principal**: https://bot.nexr.me
- **Container**: Docker Compose (FastAPI + Caddy)
- **Servidor**: Hetzner (95.216.142.4)

