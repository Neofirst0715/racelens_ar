import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

df_telemetry = pd.read_csv("data/merged_halifax.csv")
df_events = pd.read_csv("data/event_log.csv")

df_merged = pd.merge(df_telemetry,df_events, on=['DATETIME', 'TEAM'], how='left')
df_merged['event_type'] = df_merged['event_type'].fillna('Normal sailing')

FEATURES_BASE = [
    'BOAT_SPEED_km_h_1', 'VMG_km_h_1', 'TWS_SGP_km_h_1', 'TWA_SGP_deg',
    'HEEL_deg', 'PC_DTL_m', 'TRK_LEG_NUM_unk', 'LEEWAY_deg'
]

for feat in FEATURES_BASE:
    df_merged[feat] = pd.to_numeric(df_merged[feat], errors='coerce')
    df_merged[feat] = df_merged[feat].ffill().fillna(0)
    df_merged = df_merged.sort_values(['race_label', 'TEAM', 'DATETIME']).reset_index(drop=True)

for col, new_col in [
    ('BOAT_SPEED_km_h_1', 'speed_change_15s'),
    ('TWS_SGP_km_h_1',    'tws_change_15s'),
    ('PC_DTL_m',          'dtl_change_15s'),
    ('VMG_km_h_1',        'vmg_change_15s'),
]:
    df_merged[new_col] = (
        df_merged.groupby(['race_label','TEAM'])[col]
        .transform(lambda x: x.diff(15))
    )

df_merged[['speed_change_15s','tws_change_15s',
           'dtl_change_15s','vmg_change_15s']] = (
    df_merged[['speed_change_15s','tws_change_15s',
               'dtl_change_15s','vmg_change_15s']].fillna(0)
)

FEATURES = FEATURES_BASE + [
    'speed_change_15s', 'tws_change_15s',
    'dtl_change_15s',   'vmg_change_15s'
]

train_mask = df_merged['race_label'].isin(['Race_1', 'Race_2', 'Race_3', 'Race_4'])
val_mask = df_merged['race_label'].isin(['Race_5', 'Race_6'])

X_train = df_merged.loc[train_mask, FEATURES]
y_train = df_merged.loc[train_mask, 'event_type']
X_val = df_merged.loc[val_mask,FEATURES]
y_val = df_merged.loc[val_mask, 'event_type']
print(f"Matrix built successfully! Training rows: {len(X_train)}, Validation rows: {len(X_val)}")

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
predictions = model.predict(X_val)
accuracy = np.mean(predictions == y_val)
print(f"🥇 Model accuracy on unseen races (Race 5-6): {accuracy:.2%}")
joblib.dump(model, 'models/classification_model.pkl')
print("🎉 Done! 'models/classification_model.pkl' has been saved to disk.")