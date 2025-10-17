import google.generativeai as genai
import os

# Configure a chave da API (em produção, use variável de ambiente)
API_KEY = "AIzaSyBTvQNSV_XWyNCKIk6Ai5MIekedbrgxpYc"  # Substitua por env var em produção
genai.configure(api_key=API_KEY)

# Modelo a usar (Gemini 2.0 Flash é rápido e gratuito)
model = genai.GenerativeModel('models/gemini-2.0-flash')

# Prompt de sistema para contextualizar o chatbot
SYSTEM_PROMPT = """
Você é um assistente de suporte ao cliente amigável e útil para um widget de chat embutido em sites.
Sua função é ajudar visitantes com dúvidas gerais, fornecer informações e orientar sobre produtos/serviços.
Sempre responda de forma educada, concisa e em português brasileiro.
Se não souber algo, admita e sugira contato humano.
Mantenha conversas leves e positivas.
"""

def generate_ai_response(user_message: str, context: dict = None) -> str:
    """
    Gera uma resposta da IA baseada na mensagem do usuário.
    Context pode incluir page, userAgent, etc. para personalização futura.
    """
    try:
        # Combina o prompt de sistema com a mensagem do usuário
        prompt = f"{SYSTEM_PROMPT}\n\nMensagem do usuário: {user_message}"

        # Adiciona contexto opcional
        if context:
            prompt += f"\n\nContexto: Página={context.get('page', 'desconhecida')}, Navegador={context.get('userAgent', 'desconhecido')}"

        # Gera a resposta
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Erro na geração de resposta IA: {e}")
        return "Desculpe, houve um erro ao processar sua mensagem. Tente novamente mais tarde."