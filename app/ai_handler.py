import google.generativeai as genai
import os

# Configure a chave da API (em produção, use variável de ambiente)
API_KEY = os.getenv("GOOGLE_AI_API_KEY", "AIzaSyBTvQNSV_XWyNCKIk6Ai5MIekedbrgxpYc")  # Fallback para desenvolvimento
genai.configure(api_key=API_KEY)

# Modelo a usar (Gemini 2.0 Flash é rápido e gratuito)
model = genai.GenerativeModel('models/gemini-2.0-flash')

# Configurações por cliente (exemplo)
CLIENT_CONFIGS = {
    "default": {
        "system_prompt": """
Você é um assistente de suporte ao cliente amigável e útil para um widget de chat embutido em sites.
Sua função é ajudar visitantes com dúvidas gerais, fornecer informações e orientar sobre produtos/serviços.
Sempre responda de forma educada, concisa e em português brasileiro.
Se não souber algo, admita e sugira contato humano.
Mantenha conversas leves e positivas.
""",
        "model": "models/gemini-2.0-flash"
    },
    "serinox": {
        "system_prompt": """
Você é um assistente especializado da Serinox, empresa líder em soluções de aço inox.
Sua função é ajudar clientes com dúvidas sobre produtos de aço inox, especificações técnicas,
orçamentos, prazos de entrega e informações sobre qualidade e certificações.
Sempre seja profissional, técnico quando necessário, e em português brasileiro.
Ofereça informações precisas sobre produtos e direcione para contato comercial quando apropriado.
""",
        "model": "models/gemini-2.0-flash"
    },
    "nexr": {
        "system_prompt": """
Você é o assistente da NexR, especializada em desenvolvimento de soluções tecnológicas e chat widgets.
Ajude visitantes com dúvidas sobre nossos serviços de desenvolvimento web, APIs, integração de IA,
consultoria técnica e soluções personalizadas. Seja técnico mas acessível, em português brasileiro.
""",
        "model": "models/gemini-2.0-flash"
    }
}

def generate_ai_response(user_message: str, context: dict = None, client_id: str = "default") -> str:
    """
    Gera uma resposta da IA baseada na mensagem do usuário e cliente.
    """
    try:
        # Pega configuração do cliente ou usa default
        config = CLIENT_CONFIGS.get(client_id, CLIENT_CONFIGS["default"])

        # Combina o prompt de sistema com a mensagem do usuário
        prompt = f"{config['system_prompt']}\n\nMensagem do usuário: {user_message}"

        # Adiciona contexto opcional
        if context:
            prompt += f"\n\nContexto: Página={context.get('page', 'desconhecida')}, Navegador={context.get('userAgent', 'desconhecido')}"

        # Gera a resposta usando o modelo do cliente
        model = genai.GenerativeModel(config['model'])
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Erro na geração de resposta IA para cliente {client_id}: {e}")
        return "Desculpe, houve um erro ao processar sua mensagem. Tente novamente mais tarde."