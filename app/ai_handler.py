import google.generativeai as genai
import os
from pathlib import Path

# Configure a chave da API (em produção, use variável de ambiente)
API_KEY = os.getenv("GOOGLE_AI_API_KEY", "AIzaSyBTvQNSV_XWyNCKIk6Ai5MIekedbrgxpYc")  # Fallback para desenvolvimento
genai.configure(api_key=API_KEY)

# Modelo padrão
DEFAULT_MODEL = "models/gemini-2.0-flash"

# Diretório base dos clientes
CLIENTS_DIR = Path("/clients")

def load_client_config(client_id: str) -> dict:
    """Carrega configuração do cliente da pasta específica."""
    client_dir = CLIENTS_DIR / client_id

    # Configuração padrão
    config = {
        "system_prompt": "Você é um assistente de suporte ao cliente. Seja útil e educado.",
        "model": DEFAULT_MODEL,
        "styles": ""
    }

    # Carrega instructions.md se existir
    instructions_file = client_dir / "instructions.md"
    if instructions_file.exists():
        try:
            with open(instructions_file, 'r', encoding='utf-8') as f:
                config["system_prompt"] = f.read().strip()
        except Exception as e:
            print(f"Erro ao carregar instructions.md para {client_id}: {e}")

    # Carrega styles.css se existir
    styles_file = client_dir / "styles.css"
    if styles_file.exists():
        try:
            with open(styles_file, 'r', encoding='utf-8') as f:
                config["styles"] = f.read().strip()
        except Exception as e:
            print(f"Erro ao carregar styles.css para {client_id}: {e}")

    return config

def generate_ai_response(user_message: str, context: dict = None, client_id: str = "default") -> str:
    """
    Gera uma resposta da IA baseada na mensagem do usuário e cliente.
    Carrega configuração dinâmica da pasta do cliente.
    """
    try:
        # Carrega configuração do cliente
        config = load_client_config(client_id)

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