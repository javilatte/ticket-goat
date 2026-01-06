from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
import io
import re
from typing import Optional

app = FastAPI(title="TicketGOAT OCR Service", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_total_amount(text: str) -> Optional[float]:
    """Extrae el total de un ticket usando patrones comunes"""
    patterns = [
        r'total[\s:]*€?\$?\s*(\d+[.,]\d{2})',
        r'total[\s:]*(\d+[.,]\d{2})\s*€?\$?',
        r'total[\s:]*€?\$?\s*(\d+[.,]\d+)',
        r'importe[\s:]*€?\$?\s*(\d+[.,]\d{2})',
        r'suma[\s:]*€?\$?\s*(\d+[.,]\d{2})',
        r'pagar[\s:]*€?\$?\s*(\d+[.,]\d{2})',
        r'€\s*(\d+[.,]\d{2})',
        r'\$\s*(\d+[.,]\d{2})',
        r'total.*?(\d+[.,]\d{2})',
    ]

    text_lower = text.lower()
    
    for pattern in patterns:
        match = re.search(pattern, text_lower, re.IGNORECASE)
        if match:
            amount_str = match.group(1).replace(',', '.')
            try:
                return float(amount_str)
            except ValueError:
                continue
    
    # Si no encuentra "total", buscar el número más grande
    all_numbers = re.findall(r'\d+[.,]\d{2}', text)
    if all_numbers:
        numbers = [float(n.replace(',', '.')) for n in all_numbers]
        return max(numbers)
    
    return None

@app.get("/")
async def root():
    return {
        "service": "TicketGOAT OCR Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/ocr")
async def process_ocr(file: UploadFile = File(...)):
    """Procesa una imagen y extrae texto usando OCR"""
    try:
        # Leer imagen
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convertir a RGB si es necesario
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Realizar OCR
        text = pytesseract.image_to_string(image, lang='spa+eng')
        
        # Extraer total
        total = extract_total_amount(text)
        
        return {
            "success": True,
            "text": text,
            "total": total,
            "currency": "EUR"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/ocr/total")
async def extract_total(file: UploadFile = File(...)):
    """Procesa una imagen y solo devuelve el total detectado"""
    try:
        # Leer imagen
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convertir a RGB si es necesario
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Realizar OCR
        text = pytesseract.image_to_string(image, lang='spa+eng')
        
        # Extraer total
        total = extract_total_amount(text)
        
        if total is None:
            return {
                "success": False,
                "message": "No se pudo detectar el total",
                "text": text
            }
        
        return {
            "success": True,
            "total": total,
            "currency": "EUR"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
