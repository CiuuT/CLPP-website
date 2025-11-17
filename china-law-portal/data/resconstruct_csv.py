import csv
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

input_path = os.path.join(SCRIPT_DIR, "articles_test1.csv")
output_path = os.path.join(SCRIPT_DIR, "articles_test1_fix.csv")

fixed_rows = []

with open(input_path, "r", encoding="utf-8", errors="replace") as f:
    reader = csv.reader(f)
    rows = list(reader)

header = rows[0]
fixed_rows.append(header)

current_row = []

for row in rows[1:]:
    # 如果这一行的列数 < header 列数，说明是“被拆开的段落”
    if len(row) < len(header):
        # 合并到当前行（用空格拼）
        if current_row:
            current_row[-1] += " " + " ".join(row)
        else:
            # CSV 第一个数据可能就在第二行，特殊处理
            current_row = row
    else:
        # 完整行，先把之前的 current_row 推进去
        if current_row:
            fixed_rows.append(current_row)
        current_row = row

# 最后一行写入
if current_row:
    fixed_rows.append(current_row)

# 写出修复好的 CSV
with open(output_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(fixed_rows)

print("✔ 修复完成，文件写入:", output_path)
