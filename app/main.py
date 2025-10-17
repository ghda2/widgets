from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Adicionar middleware CORS para permitir conexões de qualquer domínio
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    """Serve a página de demonstração do widget"""
    file_path = "index.html"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/html")
    return {"message": "Chat Widget API está funcionando!"}

@app.post("/send-message")
async def send_message(request: Request):
    """Endpoint para receber mensagens do chat"""
    try:
        data = await request.json()
        message = data.get("message", "")
        if message:
            # Aqui você pode processar a mensagem (salvar em banco, enviar email, etc.)
            print(f"Mensagem recebida: {message}")
            return JSONResponse({"status": "success", "message": "Mensagem enviada com sucesso!"})
        else:
            return JSONResponse({"status": "error", "message": "Mensagem vazia"}, status_code=400)
    except Exception as e:
        print(f"Erro ao processar mensagem: {e}")
        return JSONResponse({"status": "error", "message": "Erro interno"}, status_code=500)

@app.get("/widget.js")
async def get_widget_js():
    """Serve o arquivo widget.js com o Content-Type correto"""
    file_path = os.path.join("static", "widget.js")
    if os.path.exists(file_path):
        return FileResponse(
            file_path, 
            media_type="application/javascript",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    return Response("Widget não encontrado", status_code=404)

@app.get("/chat-icon.svg")
async def get_chat_icon():
    """Serve o arquivo chat-icon.svg"""
    file_path = os.path.join("static", "chat-icon.svg")
    if os.path.exists(file_path):
        return FileResponse(
            file_path, 
            media_type="image/svg+xml",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    return Response("Ícone não encontrado", status_code=404)

@app.get("/health")
async def health_check():
    """Endpoint para verificação de saúde"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)