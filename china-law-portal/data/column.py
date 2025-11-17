import pandas as pd
import numpy as np
import os

pd.set_option("mode.copy_on_write", True)

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

articles_columns = pd.read_csv(
    os.path.join(SCRIPT_DIR, "articles_test1_fix.csv")
).columns.tolist()
print(articles_columns)
