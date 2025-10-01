import torch
import gradio as gr
from src.model import DRModel
from torchvision import transforms as T
import time

CHECKPOINT_PATH = "artifacts/dr-model.ckpt"
model = DRModel.load_from_checkpoint(CHECKPOINT_PATH, map_location="cpu")
model.eval()

labels = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR",
}

transform = T.Compose(
    [
        T.Resize((224, 224)),
        T.ToTensor(),
        T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)


# Prediction function
def predict(input_img):
    # Simulate loading time
    time.sleep(2)

    # Run model prediction
    input_img = transform(input_img).unsqueeze(0)
    with torch.no_grad():
        prediction = torch.nn.functional.softmax(model(input_img)[0], dim=0)
        confidences = {labels[i]: float(prediction[i]) for i in labels}

    return confidences


# Custom CSS to show "Processing..." text
css = """
#component-2 { 
    font-size: 18px; 
    font-weight: normal; 
}
"""

# Gradio app
dr_app = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil"),
    outputs=gr.Label(),
    title="Diabetic Retinopathy Detection App",
    description="Upload a retinal image and wait a few seconds while the model processes it.",
    examples=[
        "data/sample/10_left.jpeg",
        "data/sample/13_right.jpeg",
        "data/sample/17_left.jpeg",
        "data/sample/6096_right.jpeg",
    ],
    css=css
)

if __name__ == "__main__":
    dr_app.launch(share=True)
