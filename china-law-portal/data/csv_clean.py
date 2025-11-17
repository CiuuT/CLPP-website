import pandas as pd
import re
import chardet
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT = os.path.join(SCRIPT_DIR, "articles_test1.csv")
OUTPUT = os.path.join(SCRIPT_DIR, "articles_clean_test1.csv")


# ---------------------------
# 1) detect file encoding
# ---------------------------
def detect_encoding(path):
    with open(path, "rb") as f:
        result = chardet.detect(f.read())
    print(f"[Encoding detected] {result['encoding']}")
    return result["encoding"]


# ---------------------------
# 2) clean text function
# ---------------------------
def clean_text(val):
    if pd.isna(val):
        return val
    v = str(val)

    # common mojibake fixes
    replacements = {
        "\u00a0": " ",  # NBSP
        "\u0092": "’",
        "??": "’",
        "�": "",
    }
    for k, w in replacements.items():
        v = v.replace(k, w)

    # normalize weird apostrophes
    v = v.replace("’", "'")

    # collapse whitespace
    v = re.sub(r"\s+", " ", v)

    return v.strip()


# ---------------------------
# 3) clean column names
# ---------------------------
def clean_column_name(col):
    col = clean_text(col)  # run text cleaning
    col = col.replace("’", "'")
    col = col.strip()

    # Optional: replace spaces with underscores
    col = col.replace(" ", "_")

    return col

# ---------------------------
# Main
# ---------------------------
if __name__ == "__main__":
    # detect encoding
    enc = detect_encoding(INPUT)

    print("[Reading CSV...]")
    df = pd.read_csv(INPUT, encoding=enc, on_bad_lines="warn")

    print("[Cleaning data...]")
    df = df.map(clean_text)

    print("[Cleaning column names...]")
    df.columns = [clean_column_name(c) for c in df.columns]

    print(f"[Saving clean CSV → {OUTPUT}]")
    df.to_csv(OUTPUT, index=False, encoding="utf-8")

    print("✔ Done! Clean file saved.")
