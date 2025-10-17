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


@app.post("/send-message")
async def send_message(request: Request):
    """Recebe mensagens do widget e retorna uma resposta gerada por IA."""
    try:
        data = await request.json()
        message = data.get("message", "").strip()
        page = data.get("page")
        user_agent = data.get("userAgent")
        client_id = data.get("clientId", "default")  # ID do cliente para personalização
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
        print(f"Erro ao processar mensagem: {e}")
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


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)