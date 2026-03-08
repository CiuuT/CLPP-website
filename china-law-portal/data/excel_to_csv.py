# A: transcribe excel to csv
import pandas as pd

df = pd.read_excel("articles_spring_2026.xlsx", header=None) 
print("行列数：", df.shape)

# 删掉第一行因为是写的instructions,不需要了，而且我觉得以后写excel不需要instructions
df = df.drop(index=0)
# set the new row as the header
df.columns = df.iloc[0]
df = df.drop(index=df.index[0]).reset_index(drop=True)  # 删除第二行，因为它现在是header了，不需要了
# 删掉第一到第三列以及最后两列。这个需求可以以后根据以后的excel来调整
df = df.drop(columns=[df.columns[0], df.columns[1], df.columns[2], df.columns[-1], df.columns[-2]])

df.to_csv("articles_spring_2026.csv", index=False, encoding="utf-8-sig")

print(df.head())
print(df.columns)

# B: clean the csv file and create a new one
df_clean = pd.read_csv("articles_spring_2026.csv")

# please manually select the columns need to keep
# make sure to remove all spaces in the header names
df_clean = df[["Article ID", 
               "Title", 
               "Author", 
               "Citation", 
               "Journal Title ", 
               "URL", 
               "Article DOI if available", 
               "Abstract", 
               "Conclusion", 
               "Keywords if provided by the article", 
               "Research Question(s)", 
               "Answers ", 
               "Research Methods", 
               "Sub-research method types ",
               "Historical Research? Enter Y, N or unsure and explain why", 
               "Is it comparative research (Y, N or unsure)", 
               "Is it interdisciplinary research (Y, N or unsure)",
               "Research Theories (relied on, expanded from)", 
               "Research Theories (critiqued or disagreed with or tried to refute)", 
               "Type of Legal Sources", 
               "Legal Sources Citations", 
               " Policy documents ", 
               "Data Source Identification ", 
               "Author's Data Description", 
               "Accessibility (Y or N)", 
               "Data Accessibility Link ", 
               "Source Dataset", 
               "Article License Type ", 
               "AI Summaries ", 
               "AI Data Description "]].rename(columns={"Article ID": "Article ID", 
               "Title": "Title", 
               "Author": "Authors", 
               "Citation": "Citation", 
               "Journal Title ": "Journal Title", 
               "URL": "URL", 
               "Article DOI if available": "DOI", 
               "Abstract": "Abstract", 
               "Conclusion": "Conclusion", 
               "Keywords if provided by the article": "Keywords", 
               "Research Question(s)": "Research Questions", 
               "Answers ": "Answers", 
               "Research Methods": "Research Methods", 
               "Sub-research method types ": "Sub-research method types",
               "Historical Research? Enter Y, N or unsure and explain why": "Historical Research", 
               "Is it comparative research (Y, N or unsure)": "Comparative Research", 
               "Is it interdisciplinary research (Y, N or unsure)": "Interdisciplinary Research",
               "Research Theories (relied on, expanded from)": "Research Theories (relied on)", 
               "Research Theories (critiqued or disagreed with or tried to refute)": "Research Theories (critiqued)", 
               "Type of Legal Sources": "Type of Legal Sources", 
               "Legal Sources Citations": "Legal Sources Citations", 
               " Policy documents ": "Policy documents", 
               "Data Source Identification ": "Data Source Identification", 
               "Author's Data Description": "Author's Data Description", 
               "Accessibility (Y or N)": "Accessibility", 
               "Data Accessibility Link ": "Data Accessibility Link", 
               "Source Dataset": "Source Dataset", 
               "Article License Type ": "Article License Type", 
               "AI Summaries ": "AI Summaries", 
               "AI Data Description ": "AI Data Description" 
               }) 
print(df_clean.dtypes)

# clean the text in each cell
import re

# standardize the title to title case
df_clean["Title"] = df_clean["Title"].str.title()
# nomralize 
for col in df_clean.columns:
    def clean_text(text):
        if pd.isna(text):
            return text
        text = str(text)
        text = text.replace("’|‘", "'")
        text = re.sub(r"\n|\r|\t", " ", text)   
        text = re.sub(r"\s+", " ", text)  # collapse whitespace
        return text.strip()
    df_clean[col] = df_clean[col].apply(clean_text)

# notice in this version, there is no column called "year", so I have to write to extract the year
# in Bluebook citation, the year is inside parentheses
def extract_year(citation):
    if pd.isna(citation):
        return None
    match = re.search(r"[\(（]((?:19|20)\d{2})[\)）]", str(citation))
    return match.group(1) if match else None

df_clean["Year"] = df_clean["Citation"].apply(extract_year)

df_clean.to_csv("articles_spring_2026_clean.csv", index=False, encoding="utf-8-sig")