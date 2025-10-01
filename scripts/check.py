import os
import pandas as pd
from collections import Counter

# paths
csv_path = "data/diabetic-retinopathy-dataset/trainLabels.csv"
folders = {
    "train": "data/diabetic-retinopathy-dataset/train",
    "test": "data/diabetic-retinopathy-dataset/test"
}

# load csv
df = pd.read_csv(csv_path)

if not {"image", "level"}.issubset(df.columns):
    raise ValueError("CSV must contain 'image' and 'level' columns")

# global totals
total_counts = Counter()
total_missing = 0

# check each folder
for folder_name, folder_path in folders.items():
    print(f"\n📂 Checking folder: {folder_name} ({folder_path})")

    label_counts = Counter()
    missing = 0

    for _, row in df.iterrows():
        image_id = row["image"]
        label = row["level"]

        # look for file in this folder
        found = False
        for ext in [".jpeg", ".jpg", ".png", ".tif", ".tiff"]:
            if os.path.exists(os.path.join(folder_path, f"{image_id}{ext}")):
                found = True
                break

        if found:
            label_counts[label] += 1
            total_counts[label] += 1
        else:
            missing += 1
            total_missing += 1

    # print results
    if label_counts:
        print("📊 Images per label:")
        for label in sorted(label_counts.keys()):
            print(f"  Label {label}: {label_counts[label]} images")
    else:
        print("⚠️ No matching images found in this folder.")

    print(f"⚠️ Missing images in this folder: {missing}")

# final summary
print("\n============================")
print("✅ TOTAL SUMMARY (Train + Test)")
print("============================")
for label in sorted(total_counts.keys()):
    print(f"  Label {label}: {total_counts[label]} images")
print(f"⚠️ Total missing images across all folders: {total_missing}")
