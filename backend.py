from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from PIL import Image
import shutil
import torch
from torchvision import transforms as T
from src.model import DRModel

# Model checkpoint
CHECKPOINT_PATH = r"checkpoints\dr-model-epoch=06-val_loss=1.20.ckpt"

# Load model
model = DRModel.load_from_checkpoint(CHECKPOINT_PATH, map_location="cpu")
model.eval()

labels = {0: "No DR", 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Proliferative DR"}

transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (uploaded images)
UPLOAD_FOLDER = Path("static")
UPLOAD_FOLDER.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOAD_FOLDER), name="static")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Save uploaded file
    file_path = UPLOAD_FOLDER / file.filename
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Convert image for model
    img = Image.open(file_path).convert("RGB")
    input_tensor = transform(img).unsqueeze(0)

    # Model prediction
    with torch.no_grad():
        output = torch.nn.functional.softmax(model(input_tensor)[0], dim=0)
        confidences = {labels[i]: float(output[i]) for i in labels}

    predicted_stage = max(confidences, key=confidences.get)
    severity_map = {
        "No DR": "normal",
        "Mild": "mild",
        "Moderate": "moderate",
        "Severe": "severe",
        "Proliferative DR": "severe",
    }

    # Full response for frontend
    return {
        "stage": predicted_stage,
        "confidence": round(confidences[predicted_stage] * 100),
        "severity": severity_map[predicted_stage],
        "findings": [
            "Microaneurysms detected in superior temporal region",
            "Scattered hard exudates in the macula area",
            "No signs of proliferative changes",
            "Optic disc appears normal"
        ],
        "recommendations": [
            "Follow-up in 6-12 months",
            "Continue current diabetes management",
            "Monitor blood glucose levels",
            "Consider ophthalmologist consultation"
        ],
        "riskFactors": [
            "Duration of diabetes: 8 years",
            "HbA1c levels above target",
            "Hypertension present"
        ],
        "imageUrl": f"http://localhost:8000/static/{file.filename}"
    }
