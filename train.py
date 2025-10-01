import lightning as L
import torch
from lightning.pytorch.callbacks import ModelCheckpoint, EarlyStopping
from src.data_module import DRDataModule
from src.model import DRModel

if __name__ == "__main__":
    # Paths
    train_csv = "data/diabetic-retinopathy-dataset/train_split.csv"
    val_csv = "data/diabetic-retinopathy-dataset/val_split.csv"

    # DataModule
    dm = DRDataModule(
        train_csv_path=train_csv,
        val_csv_path=val_csv,
        image_size=224,
        batch_size=8,
        num_workers=0,  # set 0 for Windows
        use_class_weighting=True,
    )
    dm.setup()

    # Model
    model = DRModel(num_classes=5, class_weights=dm.class_weights)

    # Callbacks
    checkpoint_callback = ModelCheckpoint(
        dirpath="checkpoints",
        filename="dr-model-{epoch:02d}-{val_loss:.2f}",
        save_top_k=1,       # keep only best
        monitor="val_loss", # watch validation loss
        mode="min",
    )

    early_stopping_callback = EarlyStopping(
        monitor="val_loss",
        patience=3,   # stop if no improvement for 3 epochs
        mode="min"
    )

    # Trainer
    trainer = L.Trainer(
        max_epochs=20,
        accelerator="cuda" if torch.cuda.is_available() else "cpu",
        devices=1,
        log_every_n_steps=10,
        callbacks=[checkpoint_callback, early_stopping_callback],
    )

    # Train
    trainer.fit(model, dm)

    # Save final model
    trainer.save_checkpoint("checkpoints/last-model.ckpt")
