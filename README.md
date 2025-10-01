# Diabetic Retinopathy Detection: Utilizing Multiprocessing for Processing Large Datasets and Transfer Learning to Fine-Tune Deep Learning Models



Efficiently process large datasets & develop advanced model pipelines for diabetic retinopathy detection. Streamlining diagnosis.



### TL;DR
This project efficiently handles large datasets to develop a robust deep learning model for diabetic retinopathy (DR) detection. Using **PyTorch Lightning**, retinal images are categorized into distinct disease stages. Multiple pretrained backbone models are integrated, with training progress monitored via **TensorBoard**. Additionally, a **Vite-based frontend web application** is provided to showcase the model’s capabilities.

The pipeline streamlines data preprocessing, model training, and deployment, making DR diagnosis more accessible and accurate.




## Introduction
Diabetic retinopathy is a leading cause of vision loss worldwide. Early detection is critical for preventing severe complications. This project provides a ready-to-use platform for researchers and enthusiasts to experiment with DR detection using deep learning.




### Key features:
- Efficient handling of large datasets using multiprocessing  
- Image preprocessing pipelines (cropping, resizing, and splitting)  
- Training deep learning models with transfer learning  
- Monitoring experiments with TensorBoard  
- Interactive Vite frontend for model demonstration  



## Getting Started

### Prerequisites
- Python **3.8+**  
- **Node.js & npm** (for frontend)  
- **Kaggle API key** ([Get here](https://www.kaggle.com/docs/api))  

Install required Python libraries:
```bash
pip install -r requirements.txt
```

Activate your Python virtual environment (example):
```bash
.venv311\Scripts\activate
```




## Dataset Preparation

### Step 1: Download the Dataset

**Option 1: Complete Zip Download**
```bash
kaggle competitions download -c diabetic-retinopathy-detection

# Extract
unzip diabetic-retinopathy-detection.zip -d data/diabetic-retinopathy-detection
rm diabetic-retinopathy-detection.zip
```

**Option 2: Download in Parts**
```bash
./scripts/download-dr-dataset.sh
./scripts/merge_and_extract.sh
```

### Step 2: Preprocess Images
Preprocess images to crop and resize:
```bash
python scripts/crop_and_resize.py --src data/diabetic-retinopathy-dataset/train data/diabetic-retinopathy-dataset/resized/train
python scripts/crop_and_resize.py --src data/diabetic-retinopathy-dataset/test data/diabetic-retinopathy-dataset/resized/test
```

### Step 3: Split Data and Save to CSV
```bash
python scripts/split_dataset.py
```

✅ *Note: You can skip dataset preparation if already completed in this studio.*



## Model Training & Monitoring

### Training the Model
Navigate to the project root directory:
```bash
cd D:\Project\diabetic-retinopathy-detection
```

Run the training script:
```bash
python train.py
```

Training parameters are configurable via the **Config** class, including model architecture, learning rate, batch size, and data paths.

### Data Transformations & Augmentations
Explore **notebook.ipynb** for preprocessing and augmentation examples:
- Cropping, resizing, rotation  
- Color normalization  
- Advanced augmentation techniques for robust training  

### Monitoring with TensorBoard
TensorBoard tracks metrics like loss, accuracy, learning rate, and visualizes model graphs:
```bash
pip install tensorboard
tensorboard --logdir=logs/
```
Open the URL provided in the terminal (usually [http://localhost:6006](http://localhost:6006)) to monitor training progress in real time.



## Running the Application

### Backend
Navigate to the project root:
```bash
cd D:\Project\diabetic-retinopathy-detection
```

Ensure your Python environment is activated.  
Run the backend server:
```bash
python backend.py
```

The backend will start an API to process retinal images and provide DR predictions.

### Frontend (Vite)
Navigate to the frontend directory:
```bash
cd D:\Project\diabetic-retinopathy-detection\retina-bright-insight\retina-bright-insight
```

Install frontend dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open the URL shown in the terminal (usually [http://localhost:5173/](http://localhost:5173/)) to access the frontend interface.

✅ *Ensure the backend server is running before using the frontend for predictions.*



## Key Features
- Multiprocessing for efficient large dataset handling  
- Transfer learning with multiple pretrained backbone models  
- Configurable training pipeline with logging and visualization  
- Interactive Vite frontend for user-friendly predictions  



## Tech Stack
- **Languages:** Python, JavaScript  
- **Frameworks/Libraries:** PyTorch, PyTorch Lightning, TensorBoard, Vite  
- **Tools:** Kaggle API, Multiprocessing, NumPy, Pandas  



## Future Work
- Expand model ensemble for improved accuracy  
- Integrate additional datasets for robustness  
- Optimize web app for cloud deployment  




## References
- [Kaggle Diabetic Retinopathy Detection Competition](https://www.kaggle.com/c/diabetic-retinopathy-detection)  
- [PyTorch Lightning Documentation](https://lightning.ai/docs/pytorch/stable/)  
- [Vite Documentation](https://vitejs.dev/)  
