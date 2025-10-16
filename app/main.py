from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Montar arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Chat Widget API está funcionando!"}

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