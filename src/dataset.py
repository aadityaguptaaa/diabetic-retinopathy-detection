import os
import pandas as pd
import torch
from torch.utils.data import Dataset
from PIL import Image


class DRDataset(Dataset):
    def __init__(self, csv_path: str, transform=None):
        """
        Args:
            csv_path (str): CSV with 'image_path' and 'label' columns.
            transform (callable, optional): Transformations to apply to images.
        """
        self.csv_path = csv_path
        self.transform = transform
        self.image_paths, self.labels = self._load_csv_data()

    def _load_csv_data(self):
        if not os.path.isfile(self.csv_path):
            raise FileNotFoundError(f"CSV file '{self.csv_path}' not found.")

        data = pd.read_csv(self.csv_path)

        if "image_path" not in data.columns or "label" not in data.columns:
            raise ValueError("CSV must contain 'image_path' and 'label' columns.")

        image_paths = data["image_path"].tolist()
        labels = data["label"].tolist()

        invalid_paths = [p for p in image_paths if not os.path.isfile(p)]
        if invalid_paths:
            print(f"⚠️ Warning: {len(invalid_paths)} invalid image paths detected")

        labels = torch.LongTensor(labels)
        return image_paths, labels

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]

        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label
