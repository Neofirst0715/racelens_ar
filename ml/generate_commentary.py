import pandas as pd
import numpy as np
import joblib

df_telemetry = pd.read_csv("data/merged_halifax.csv")
df_events = pd.read_csv("data/event_log.csv")
model = joblib.load("models/classification_model.pkl")

FEATURES_BASE = [
    'BOAT_SPEED_km_h_1', 'VMG_km_h_1', 'TWS_SGP_km_h_1', 'TWA_SGP_deg',
    'HEEL_deg', 'PC_DTL_m', 'TRK_LEG_NUM_unk', 'LEEWAY_deg'
]

for feat in FEATURES_BASE:
    df_telemetry[feat] = pd.to_numeric(df_telemetry[feat], errors='coerce')
    df_telemetry[feat] = df_telemetry[feat].ffill().fillna(0)

df_telemetry = df_telemetry.sort_values(by=['race_label', 'TEAM', 'DATETIME']).reset_index(drop=True)

for col, new_col in [
    ('BOAT_SPEED_km_h_1', 'speed_change_15s'),
    ('TWS_SGP_km_h_1',    'tws_change_15s'),
    ('PC_DTL_m',          'dtl_change_15s'),
    ('VMG_km_h_1',        'vmg_change_15s'),
]:
    df_telemetry[new_col] = (
        df_telemetry.groupby(['race_label', 'TEAM'])[col]
        .transform(lambda x: x.diff(15))
    )

df_telemetry[['speed_change_15s', 'tws_change_15s',
              'dtl_change_15s',   'vmg_change_15s']] = (
    df_telemetry[['speed_change_15s', 'tws_change_15s',
                  'dtl_change_15s',   'vmg_change_15s']].fillna(0)
)

FEATURES = FEATURES_BASE + [
    'speed_change_15s', 'tws_change_15s',
    'dtl_change_15s',   'vmg_change_15s'
]

print("event_log事件类型样本:", df_events['event_type'].unique())
df_events_indexed = df_events.set_index(['DATETIME', 'TEAM']).sort_index()

commentary_rows = []

print("解说引擎已就位，开始逐秒为观众生成高清弹幕解说...")

for idx, row in df_telemetry.iterrows():
    dt = row['DATETIME']
    team = row['TEAM']
    speed = row['BOAT_SPEED_km_h_1']

    current_features = pd.DataFrame([row[FEATURES].values], columns=FEATURES)

    commentary_text = ""
    conf_tier = ""
    pred_class = "Normal sailing"

    if (dt, team) in df_events_indexed.index:
        event = df_events_indexed.loc[(dt, team)]
        if isinstance(event, pd.DataFrame):
            event = event.iloc[0]

        evt_type = event['event_type']
        val = event['trigger_value']

        conf_tier = "regression"
        pred_class = evt_type

        if evt_type == 'wind_shadow':
            commentary_text = f"📊 风影预警：{team} 进入前船风影区，风速下降 {abs(val):.1f}%，速度正在受阻。"
        elif evt_type == 'speed_anomaly':
            commentary_text = f"⚠️ 速度异常：{team} 在过去15秒内速度变化了 {val:.1f}%！"
        elif evt_type == 'rank_change':
            commentary_text = f"🏁 排名变动：{team} 与前后船距离在15秒内变化了 {val:.1f} 米，赛位出现波动！"
        else:
            commentary_text = f"📌 赛况更新：{team} 当前状态发生变化。"

    else:
        pred_class = model.predict(current_features)[0]

        if pred_class == 'Normal sailing':
            conf_tier = "hard_data"
            commentary_text = f"⛵️ 正常航行：{team} 正在以 {speed:.1f} km/h 的速度平稳推进。"
        else:
            conf_tier = "ml_prediction"
            commentary_text = f"🔮 智能态势感知：AI 预测模型显示，{team} 此时正处于【{pred_class}】竞技状态中。"

    commentary_rows.append({
        'DATETIME': dt,
        'TEAM': team,
        'commentary_text': commentary_text,
        'confidence_tier': conf_tier,
        'event_type': pred_class
    })

df_commentary = pd.DataFrame(commentary_rows)
df_commentary.to_csv("data/commentary_log.csv", index=False)

print(f"🎉 完美输出 'commentary_log.csv'，共计 {len(df_commentary)} 秒的实时解说字幕！")