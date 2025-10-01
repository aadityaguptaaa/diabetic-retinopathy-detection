import lightning as L
import torch
import numpy as np
from torch.utils.data import DataLoader, WeightedRandomSampler
from sklearn.utils.class_weight import compute_class_weight
from torchvision import transforms as T
from src.dataset import DRDataset


class DRDataModule(L.LightningDataModule):
    CLASS_NAMES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]

    def __init__(
        self,
        train_csv_path,
        val_csv_path,
        image_size: int = 224,
        batch_size: int = 8,
        num_workers: int = 4,
        persistent_workers: bool = False,
        use_class_weighting: bool = False,
        use_weighted_sampler: bool = False,
    ):
        super().__init__()
        self.train_csv_path = train_csv_path
        self.val_csv_path = val_csv_path
        self.image_size = image_size
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.persistent_workers = persistent_workers
        self.use_class_weighting = use_class_weighting
        self.use_weighted_sampler = use_weighted_sampler
        self.num_classes = 5

        if use_class_weighting and use_weighted_sampler:
            raise ValueError("Cannot use class weighting and weighted sampler together.")

        self.train_transform = T.Compose([
            T.Resize((image_size, image_size)),
            T.RandomAffine(degrees=10, translate=(0.01, 0.01), scale=(0.99, 1.01)),
            T.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.2, hue=0.01),
            T.RandomHorizontalFlip(p=0.5),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        self.val_transform = T.Compose([
            T.Resize((image_size, image_size)),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def setup(self, stage=None):
        self.train_dataset = DRDataset(self.train_csv_path, transform=self.train_transform)
        self.val_dataset = DRDataset(self.val_csv_path, transform=self.val_transform)

        self.train_dataset.labels = torch.tensor(self.train_dataset.labels, dtype=torch.long)
        self.val_dataset.labels = torch.tensor(self.val_dataset.labels, dtype=torch.long)

        self.class_weights = (
            self._compute_class_weights(self.train_dataset.labels.numpy())
            if self.use_class_weighting else None
        )

        print(f"Labels in training set: {torch.unique(self.train_dataset.labels)}")
        print(f"Number of classes: {self.num_classes}")

    def train_dataloader(self):
        sampler = None
        shuffle = True
        if self.use_weighted_sampler:
            sampler = self._get_weighted_sampler(self.train_dataset.labels.numpy())
            shuffle = False

        return DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            shuffle=shuffle,
            sampler=sampler,
            num_workers=self.num_workers,
            persistent_workers=self.persistent_workers,
        )

    def val_dataloader(self):
        return DataLoader(
            self.val_dataset,
            batch_size=self.batch_size,
            num_workers=self.num_workers,
            persistent_workers=self.persistent_workers,
        )

    def _compute_class_weights(self, labels):
        weights = compute_class_weight("balanced", classes=np.arange(self.num_classes), y=labels)
        return torch.tensor(weights, dtype=torch.float32)

    def _get_weighted_sampler(self, labels):
        labels = np.array(labels)
        counts = np.array([sum(labels == i) for i in range(self.num_classes)])
        weights = 1.0 / counts
        samples_weight = torch.tensor([weights[i] for i in labels], dtype=torch.float32)
        return WeightedRandomSampler(samples_weight, num_samples=len(labels), replacement=True)
