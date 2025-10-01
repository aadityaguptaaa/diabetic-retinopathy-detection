import lightning as L
import torch
from torch import nn
from torchmetrics.functional import accuracy, cohen_kappa
from src.models.factory import ModelFactory


class DRModel(L.LightningModule):
    def __init__(
        self,
        num_classes: int = 5,  # <- default to 5 labels (0,1,2,3,4)
        model_name: str = "densenet121",
        learning_rate: float = 3e-4,
        class_weights=None,     # should be a tensor of length 5 if used
        use_scheduler: bool = True,
    ):
        super().__init__()
        self.save_hyperparameters()
        self.num_classes = num_classes
        self.learning_rate = learning_rate
        self.use_scheduler = use_scheduler

        # Define the model
        # Ensure output layer has 'num_classes' neurons
        self.model = ModelFactory(name=model_name, num_classes=num_classes)()

        # Define the loss function
        # Ensure class_weights has length 5 (or None)
        if class_weights is not None:
            assert len(class_weights) == num_classes, "class_weights must have length equal to num_classes"
        self.criterion = nn.CrossEntropyLoss(weight=class_weights)

    def forward(self, x):
        return self.model(x)

    def training_step(self, batch, batch_idx=None):
        x, y = batch
        logits = self.model(x)
        loss = self.criterion(logits, y)
        self.log("train_loss", loss, on_step=True, on_epoch=True, prog_bar=True)
        return loss

    def validation_step(self, batch, batch_idx):
        x, y = batch
        logits = self.model(x)
        loss = self.criterion(logits, y)
        preds = torch.argmax(logits, dim=1)

        # Multiclass accuracy & kappa with num_classes=5
        acc = accuracy(preds, y, task="multiclass", num_classes=self.num_classes)
        kappa = cohen_kappa(
            preds,
            y,
            task="multiclass",
            num_classes=self.num_classes,
            weights="quadratic",
        )

        self.log("val_loss", loss, on_step=True, on_epoch=True, prog_bar=True)
        self.log("val_acc", acc, on_step=True, on_epoch=True, prog_bar=True)
        self.log("val_kappa", kappa, on_step=True, on_epoch=True, prog_bar=True)

    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(
            self.parameters(), lr=self.learning_rate, weight_decay=0.05
        )

        if self.use_scheduler:
            scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
                optimizer,
                mode="min",         # minimize val_loss
                factor=0.1,         # reduce LR by 10x
                patience=5,         # wait 5 epochs before reducing
                threshold=0.001     # min improvement threshold
            )

            return {
                "optimizer": optimizer,
                "lr_scheduler": {
                    "scheduler": scheduler,
                    "monitor": "val_loss",   # Lightning needs this
                    "interval": "epoch",
                    "frequency": 1
                }
            }

        return optimizer
