# Model Card — Theramind SLM

## Model Description

Theramind uses a Small Language Model (SLM) fine-tuned with the **ARCHER** (Advantage-weighted Reward from Contrast of Human Evaluations and Rewards) method for mental health support conversations.

## Intended Use

- **Primary use**: On-device mental health support companion
- **Users**: Individuals seeking emotional support and mental health guidance
- **Deployment**: Mobile device, fully offline

## ARCHER Training Method

```
Base SLM (≤1B params)
    │
    ▼
Generate conversation pairs
    │
    ▼
Human preference ranking
(chosen vs rejected responses)
    │
    ▼
Advantage-weighted reward signal
    │
    ▼
Policy optimization (PPO-like)
    │
    ▼
Theramind SLM (empathetic, safe, private)
```

## Privacy & Safety

- ✅ Runs 100% on-device — no data leaves the phone
- ✅ No cloud API calls
- ✅ No conversation storage
- ⚠️ **Not a substitute for professional mental health care**
- ⚠️ Crisis detection: app will surface emergency resources if crisis language detected

## Limitations

- Limited to English
- Knowledge cutoff of base model training data
- Not validated for clinical use
