import os
import argparse
import pandas as pd
from sklearn.model_selection import train_test_split

def load_data(train_dir, test_dir, csv_path):
    # Read CSV with header
    df = pd.read_csv(csv_path)

    # Check header
    if 'image' not in df.columns or 'level' not in df.columns:
        raise ValueError("CSV must have columns: image, level")

    # Convert image names to full paths in train + test folders
    image_paths = []
    labels = []

    for _, row in df.iterrows():
        img_name = row['image']
        label = row['level']

        # Search in train folder first, then test folder
        found_path = None
        for folder in [train_dir, test_dir]:
            path = os.path.join(folder, f"{img_name}.jpeg")
            if os.path.exists(path):
                found_path = path
                break

        if found_path:
            image_paths.append(found_path)
            labels.append(label)
        else:
            print(f"⚠️ Image not found: {img_name}")

    df_all = pd.DataFrame({'image_path': image_paths, 'label': labels})

    # Print label distribution
    print("Label distribution:\n", df_all['label'].value_counts())
    print("Labels present:", sorted(df_all['label'].unique()))

    return df_all

def main(train_dir, test_dir, csv_path, out_train_csv, out_val_csv, test_size=0.2, random_state=42):
    df_all = load_data(train_dir, test_dir, csv_path)

    # Split into train/val sets, preserving label distribution
    df_train, df_val = train_test_split(
        df_all,
        test_size=test_size,
        stratify=df_all['label'],
        random_state=random_state
    )

    df_train.to_csv(out_train_csv, index=False)
    df_val.to_csv(out_val_csv, index=False)
    print(f"✅ Train CSV saved: {out_train_csv}")
    print(f"✅ Validation CSV saved: {out_val_csv}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split dataset into train and validation sets using two folders.")
    parser.add_argument("--train_dir", required=True, help="Path to train images folder")
    parser.add_argument("--test_dir", required=True, help="Path to test images folder")
    parser.add_argument("--csv_path", required=True, help="Path to trainLabels.csv")
    parser.add_argument("--out_train_csv", required=True, help="Path to save train CSV")
    parser.add_argument("--out_val_csv", required=True, help="Path to save validation CSV")
    parser.add_argument("--test_size", type=float, default=0.2, help="Proportion for validation split")
    parser.add_argument("--random_state", type=int, default=42, help="Random seed for reproducibility")

    args = parser.parse_args()
    main(args.train_dir, args.test_dir, args.csv_path, args.out_train_csv, args.out_val_csv, args.test_size, args.random_state)
