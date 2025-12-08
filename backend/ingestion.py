import pandas as pd
import sqlite3
import os

USER_CSV_PATH = os.getenv("USER_CSV_PATH")
ITEM_CSV_PATH = os.getenv("ITEM_CSV_PATH")
REVIEW_CSV_PATH = os.getenv("REVIEW_CSV_PATH")
DB_PATH = os.getenv("DB_PATH")

df_users = pd.read_csv(USER_CSV_PATH)
df_items = pd.read_csv(ITEM_CSV_PATH) 
df_reviews = pd.read_csv(REVIEW_CSV_PATH)
    
conn = sqlite3.connect(DB_PATH)

df_users.to_sql("users", conn, if_exists="replace", index=False)
df_items.to_sql("items", conn, if_exists="replace", index=False)
df_reviews.to_sql("reviews", conn, if_exists="replace", index=False)

cursor = conn.cursor()
cursor.execute("CREATE INDEX idx_item_id ON items(itemId);")
cursor.execute("CREATE INDEX idx_review_item_id ON reviews(itemId);")
cursor.execute("CREATE INDEX idx_user_id ON reviews(userId);")

conn.close()
print("Database created successfully!")