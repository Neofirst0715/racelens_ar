from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

df = pd.read_csv("data/merged_halifax.csv")
df['BOAT_SPEED_km_h_1'] = pd.to_numeric(df['BOAT_SPEED_km_h_1'], errors='coerce')
df['PC_DTL_m'] = pd.to_numeric(df['PC_DTL_m'], errors='coerce')
df['TWS_SGP_km_h_1'] = pd.to_numeric(df['TWS_SGP_km_h_1'], errors='coerce')
df['TWA_SGP_deg'] = pd.to_numeric(df['TWA_SGP_deg'], errors='coerce')
df = df.sort_values(by=['race_label', 'TEAM', 'DATETIME']).reset_index(drop=True)
detected_eventes = []
for (race, team), group_df in df.groupby(['race_label', 'TEAM']):
    dtl_current = group_df['PC_DTL_m']
    dtl_15s_ago = dtl_current.shift(15)
    dtl_change_pct = dtl_current - dtl_15s_ago
    valid_dtl_change = dtl_change_pct.dropna()
    ranking_change_indices = valid_dtl_change[np.abs(valid_dtl_change) >= 50].index

    speed_current = group_df['BOAT_SPEED_km_h_1']
    speed_15s_ago = speed_current.shift(15)
    speed_change_pct = (speed_current - speed_15s_ago) / speed_15s_ago
    valid_speed_change = speed_change_pct.dropna()
    speed_anomaly_indices = valid_speed_change[np.abs(valid_speed_change) >= 0.15].index

    tws_current = group_df['TWS_SGP_km_h_1']
    tws_15s_ago = tws_current.shift(15)
    tws_change_pct = (tws_current - tws_15s_ago)/tws_15s_ago

    twa_current = group_df['TWA_SGP_deg']
    twa_15s_ago = twa_current.shift(15)
    twa_change = twa_current - twa_15s_ago
    wind_shadow_condition = (tws_change_pct <= -0.10) & (np.abs(twa_change) >= 5)
    wind_shadow_indices = group_df[wind_shadow_condition].index

    for idx in ranking_change_indices:
        detected_eventes.append({
            'DATETIME': group_df.loc[idx, 'DATETIME'],
            'TEAM': group_df.loc[idx, 'TEAM'],
            'event_type': 'rank_change',
            'severity' : 'mid',
            'trigger_value': float(dtl_change_pct[idx])
        })
    for idx in speed_anomaly_indices:
        detected_eventes.append({
            'DATETIME': group_df.loc[idx, 'DATETIME'],
            'TEAM': group_df.loc[idx, 'TEAM'],
            'event_type': 'speed_anomaly',
            'severity': 'mid',
            'trigger_value': float(speed_change_pct[idx])
        })
    for idx in wind_shadow_indices:
        detected_eventes.append({
            'DATETIME': group_df.loc[idx, 'DATETIME'],
            'TEAM': group_df.loc[idx, 'TEAM'],
            'event_type': 'wind_shadow',
            'severity': 'mid',
            'trigger_value': float(tws_change_pct[idx])
        })
    event_df = pd.DataFrame(detected_eventes)
    event_df.to_csv("data/event_log.csv", index=False)
    print(f"恭喜！底层规则引擎跑通了！总共抓到 {len(event_df)} 个精彩戏剧性时刻！")


