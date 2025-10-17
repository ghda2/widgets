from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from ai_handler import generate_ai_response

app = FastAPI()

# CORS aberto para facilitar embed em qualquer site (ajuste em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Arquivos estáticos (opcional, útil para futuros assets)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    """Página mínima de demonstração carregando o widget."""
    # Serve um HTML simples que inclui o widget via <script src="/widget.js">
    html = (
        "<!DOCTYPE html><html lang='pt-BR'><head>"
        "<meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'>"
        "<title>Demo do Widget</title>"
        "<style>body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:32px;background:#f6f7f9}"
        ".card{max-width:800px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08)}"
        "h1{margin-top:0}</style></head><body>"
        "<div class='card'><h1>Demo do Widget</h1><p>Esta página carrega o widget abaixo. Abra o botão flutuante no canto.</p>"
        "<p>Para usar em outro site, adicione:</p>"
        "<pre><code>&lt;script src='http://localhost:8000/widget.js' data-title='Fale Conosco'&gt;&lt;/script&gt;</code></pre>"
        "</div>"
        "<script src='/widget.js' data-title='Fale Conosco'></script>"
        "</body></html>"
    )
    return Response(html, media_type="text/html")


@app.get("/test")
async def test_page():
    """Serve a página de teste do widget (se existir)."""
    file_path = "test.html"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/html")
    return Response("Página de teste não encontrada", status_code=404)


@app.get("/test/{client_id}")
async def test_client_page(client_id: str):
    """Serve a página de teste específica do cliente."""
    file_path = f"test_{client_id}.html"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/html")
    return Response(f"Página de teste para {client_id} não encontrada", status_code=404)


@app.post("/send-message")
async def send_message(request: Request):
    """Recebe mensagens do widget e retorna uma resposta gerada por IA."""
    try:
        # Debug: Verifica o body e headers
        body = await request.body()
        content_type = request.headers.get("content-type", "")
        
        print(f"[DEBUG] Raw body: {body}")
        print(f"[DEBUG] Content-Type: {content_type}")
        
        # Verifica se o body está vazio
        if not body:
            return JSONResponse({
                "status": "error", 
                "message": "Corpo da requisição está vazio. Certifique-se de enviar JSON com Content-Type: application/json"
            }, status_code=400)
        
        # Parse do JSON com tratamento de erro
        try:
            import json
            data = json.loads(body.decode('utf-8'))
        except json.JSONDecodeError as je:
            print(f"[ERROR] JSON decode error: {je}")
            print(f"[ERROR] Traceback: ", exc_info=True)
            return JSONResponse({
                "status": "error",
                "message": f"JSON inválido: {str(je)}"
            }, status_code=400)
        except UnicodeDecodeError as ue:
            print(f"[ERROR] Unicode decode error: {ue}")
            return JSONResponse({
                "status": "error",
                "message": f"Erro de codificação: {str(ue)}"
            }, status_code=400)
        
        message = data.get("message", "").strip()
        page = data.get("page")
        user_agent = data.get("userAgent")
        client_id = data.get("clientId", "default")
        
        if not message:
            return JSONResponse({"status": "error", "message": "Mensagem vazia"}, status_code=400)

        # Aqui você pode integrar com seu backend (DB, email, webhook, etc.)
        print(f"[widget] Cliente: {client_id} | Mensagem: {message} | page={page}")

        # Gera resposta com IA personalizada por cliente
        context = {"page": page, "userAgent": user_agent}
        ai_reply = generate_ai_response(message, context, client_id)

        return JSONResponse({
            "status": "success",
            "reply": ai_reply,
        })
    except Exception as e:
        import traceback
        print(f"Erro ao processar mensagem: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return JSONResponse({"status": "error", "message": "Erro interno"}, status_code=500)


@app.get("/widget.js")
async def get_widget_js():
    """Serve o arquivo widget.js com o Content-Type correto."""
    file_path = os.path.join("static", "widget.js")
    if os.path.exists(file_path):
        # Headers úteis em dev; em prod, considere cache-control forte com versão no nome
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
        }
        return FileResponse(file_path, media_type="application/javascript", headers=headers)
    return Response("Widget não encontrado", status_code=404)


@app.get("/client/{client_id}/styles.css")
async def get_client_styles(client_id: str):
    """Serve os estilos CSS personalizados do cliente."""
    from pathlib import Path
    clients_dir = Path("/clients")
    styles_file = clients_dir / client_id / "styles.css"

    if styles_file.exists():
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Content-Type": "text/css",
        }
        return FileResponse(str(styles_file), headers=headers)

    # Retorna estilos padrão se não encontrar
    default_styles = clients_dir / "default" / "styles.css"
    if default_styles.exists():
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Content-Type": "text/css",
        }
        return FileResponse(str(default_styles), headers=headers)

    # Fallback para estilos inline básicos
    fallback_css = """
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 8px;
}
.chat-widget { /* estilos básicos */ }
"""
    return Response(fallback_css, media_type="text/css", headers={"Access-Control-Allow-Origin": "*"})


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)