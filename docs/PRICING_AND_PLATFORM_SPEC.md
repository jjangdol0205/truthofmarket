# RightSideAlpha (truthofmarket.com)
## Seeking Alpha Elevation, 5-Factor Institutional Scorecard & 3-Tier Pricing Specification

**Document Code**: RSA-SPEC-2026-M3  
**Target Platform**: 1사업부 (`truthofmarket.com`)  
**Operating Entity**: Yoonju Lee · KIDS-FIT Global Studio & TruthOfMarket Analytics  
**Lemon Squeezy Store ID**: `#296100`  
**Effective Date**: November 8, 2026  

---

## 1. Executive Vision: The Elevation to Institutional Intelligence

While conventional retail screeners display superficial price changes and lagging technical indicators (e.g., standard 14-day RSI), institutional hedge funds and top research desks (such as Seeking Alpha Quant, Goldman Sachs GIR, and Renaissance Technologies) evaluate securities through multi-dimensional factor models and rigorous downside asymmetric mechanics.

`truthofmarket.com` is elevated from a standalone quantitative screening table to an **institutional-grade investment research platform**. This architecture bridges two fundamental quantitative engines:
1. **RightSideAlpha (PW-RSI Terminal)**: 72 large-cap US equities evaluated through Post-Washout Right-Side Ignition mechanics and SEC primary-filing forensic briefs.
2. **SemiFearGreed & $SMH:$XLV Contrarian Barbell**: A 26.8-year empirical asset allocation model combining high-beta semiconductor compounding ($SMH) with resilient healthcare cash flows ($XLV).

---

## 2. Why Retail Investors Fail vs RightSideAlpha Mechanical Edge

Academic financial literature (Odean & Barber, 2000; Kahneman & Tversky Prospect Theory) confirms that retail investors underperform index benchmarks not from a lack of information, but from psychological and structural behavioral traps. RightSideAlpha systematically neutralizes these traps through mechanical execution rules.

| Retail Vulnerability | The Left-Side Retail Trap | RightSideAlpha Mechanical Edge |
| :--- | :--- | :--- |
| **1. Falling Knife Addiction (Left-Side Trap)** | "It dropped -70% from its ATH, so it must be cheap." Retail traders average down into structural insolvency, catching falling knives while the price remains trapped beneath declining moving averages. | **Rule 1: Zero Left-Side Buying.** No purchase is permitted until the asset forms a confirmed washout base and prints a **PW-RSI Right-Side Ignition** crossing above MA60 on >=1.8x institutional volume. |
| **2. The Disposition Effect** | Selling +5% winners quickly to lock in emotional gratification while refusing to cut a -40% loser ("It's not a loss until I sell"). Capital is permanently tied up in decaying assets. | **Rule 2: Asymmetric -9.0% Hard Stop.** Every single position has a non-negotiable -9.0% hard stop-loss from entry. If hit, the position is eliminated automatically. Concurrently, winning trends are trailed to capture multi-bagger +80% to +150% upside targets. |
| **3. High-Beta Blowups (SOXL / TQQQ Overconcentration)** | Allocating 80–100% of capital into 3x levered cyclical instruments. During semiconductor down-cycles, accounts suffer -75% to -90% catastrophic drawdowns from which recovery takes decades. | **Rule 3: 26.8-Year $SMH:$XLV Contrarian Barbell.** Rather than naked tech exposure, capital is paired with recession-proof healthcare dividend flows. Based on 2000–2026 empirical data, this barbell reduces maximum portfolio drawdown (MDD) from **-58.2% to -21.4%**, while generating a **17.8% compound annual growth rate (CAGR)**. |

---

## 3. The 5-Factor Institutional Scorecard

Modeled after institutional factor cards (Seeking Alpha Factor Grades & Barra Risk Factors), every security across our 72-stock coverage universe receives a composite Institutional Grade (A+ to F) generated across 5 weighted dimensions:

```
┌────────────────────────────────────────────────────────────────────────┐
│ RIGHTSIDEALPHA 5-FACTOR INSTITUTIONAL SCORECARD (EXAMPLE: NVDA)        │
├──────────────────────────┬───────┬───────┬─────────────────────────────┤
│ Dimension                │ Weight│ Grade │ Core Metric & Signal       │
├──────────────────────────┼───────┼───────┼─────────────────────────────┤
│ 1. Valuation Decouple    │  20%  │   C   │ Fwd PEG 1.8x vs Sector 2.3x │
│ 2. PW-RSI Momentum       │  25%  │  A+   │ MA60 Ignition · RSI 58 Right│
│ 3. EPS & FCF Growth      │  25%  │  A+   │ TTM EPS +62% · FCF Mgn 48%  │
│ 4. Balance Sheet Health  │  15%  │   A   │ Net Debt/EBITDA 0.2x · Z=4.2│
│ 5. Smart Money Flow      │  15%  │  A-   │ Dark Pool Accum Ratio 1.42x │
├──────────────────────────┴───────┴───────┴─────────────────────────────┤
│ OVERALL INSTITUTIONAL RATING: STRONG BUY · CONVICTION SCORE: 91/100    │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Factor Formulations:

1. **Valuation Decouple (Weight: 20%)**:
   - Compares Forward Price-to-Earnings-Growth (PEG), EV/EBITDA, and Free Cash Flow Yield against the company's 5-year median and broader industry decile.
   - *Scoring*: A+ (<1.0x PEG), A (1.0–1.4x), B (1.5–1.9x), C (2.0–2.8x), D (2.9–3.5x), F (>3.5x).

2. **PW-RSI Momentum & Ignition (Weight: 25%)**:
   - Identifies the exact transition from distribution to institutional markup. Requires RSI(14) recovery from sub-35 oversold washout to 52–62 right-side territory, accompanied by price reclaiming the 60-day moving average (MA60) on above-average trading volume.
   - *Scoring*: A+ (Confirmed Ignition + Volume Spike >= 2.0x), A (Right-Side Uptrend above MA60), B (Consolidation above MA60), C (Testing MA60), D/F (Sub-MA60 Left-Side Downtrend).

3. **EPS & Free Cash Flow Acceleration (Weight: 25%)**:
   - Assesses quarterly revenue beat rates, operating margin expansion, and Free Cash Flow conversion efficiency (FCF / Net Income > 80%).
   - *Scoring*: Evaluates consecutive quarters of positive EPS surprises and FY2 guidance upward revisions.

4. **Balance Sheet Health & Solvency (Weight: 15%)**:
   - Analyzes Altman Z-Score, Net Debt to EBITDA ratio, interest coverage (>8.0x), and debt maturity profiles to ensure zero bankruptcy or predatory refinancing risk.

5. **Smart Money & Dark Pool Accumulation (Weight: 15%)**:
   - Tracks off-exchange volume ratios, block trade prints, and 13F institutional ownership changes. Bullish institutional absorption creates an A+ score even during sideways market consolidation.

---

## 4. SEC Primary-Filing Automated Forensic Research Briefs

Unlike news aggregators that recycle wire press releases, RightSideAlpha runs an automated forensic pipeline directly against the SEC EDGAR API:
- **10-Q & 10-K Footnote Extraction**: Uncovering off-balance sheet liabilities, sudden inventory buildups, and legal contingent risks.
- **Insider & Executive Alignment**: Real-time Form 4 tracking separating programmatic Rule 10b5-1 stock sales from opportunistic open-market executive insider buys.
- **Share Dilution & Buyback Efficacy**: Calculating true net share count changes to verify whether buybacks offset stock-based compensation (SBC) dilution.

---

## 5. 3-Tier Pricing Model Specification (Lemon Squeezy Store #296100)

To serve retail enthusiasts, active swing traders, and sophisticated family offices, RightSideAlpha establishes a 3-tier value ladder:

| Plan Tier | Name & Positioning | Price (USD) | Lemon Squeezy Live UUID | Target Audience | Key Feature Deliverables |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **7-Day VIP Research Pass** *(Trial)* | **$4.99** *(7-Day Full Access)* | Configured on checkout | Curious retail investors, test evaluators | • Full access to all 72 US Equity target prices & -9.0% stop-loss levels<br>• Unlimited Position Doctor diagnostic runs<br>• Real-time Semiconductor Fear & Greed gauge<br>• Converts automatically to Monthly Pro unless canceled |
| **Tier 2** | **Pro Terminal Monthly** *(Core)* | **$29.00 / mo** *(Billed monthly)* | `bad98d00-7175-41f6-9d58-eeb2471d0da4` | Active swing traders, momentum investors | • Everything in Tier 1<br>• **Private VIP Telegram Alert Channel** (`@RigjtsideAlphabot`) with instant PW-RSI ignition & stop-loss notifications<br>• Daily SEC 10-K/10-Q Forensic Research Briefs<br>• $SMH:$XLV Barbell monthly rebalancing alerts<br>• Cancel anytime in 1 click |
| **Tier 3** | **Institutional Annual Pass** *(VIP)* | **$199.00 / yr** *(Equivalent to $16.58/mo, 43% savings)* | `00c9f6e1-c8be-42a4-b5a5-e05af1a41ed9` | Serious wealth builders, quants, family offices | • Everything in Pro Terminal<br>• **Full 26.8-Year Empirical Backtest Raw CSV Dataset** (2000–2026 daily OHLCV & allocation matrix)<br>• **Proprietary TradingView Pine Script v5 Indicator Source Code**<br>• Quarterly Macro Institutional PDF Reports<br>• Priority email support from chief quantitative analyst |

---

## 6. Checkout & Compliance Guardrails (Store #296100)

- **Merchant of Record**: Lemon Squeezy, LLC (Store #296100 · KIDS-FIT Global Studio & TruthOfMarket Analytics).
- **Checkout URL Standard**:
  - Monthly Pro: `https://truthofmarket.lemonsqueezy.com/checkout/buy/bad98d00-7175-41f6-9d58-eeb2471d0da4?embed=1`
  - Institutional Annual: `https://truthofmarket.lemonsqueezy.com/checkout/buy/00c9f6e1-c8be-42a4-b5a5-e05af1a41ed9?embed=1`
- **Customer Support Desk**: Unified official email `beable9489@gmail.com`.
- **Standalone Compliance Pages**:
  - Terms of Service: `https://truthofmarket.com/terms.html`
  - Privacy Policy: `https://truthofmarket.com/privacy.html`
  - Refund Policy: `https://truthofmarket.com/refund.html`
  - Contact Us: `https://truthofmarket.com/contact.html`
- **Refund Policy Enforcement**:
  - Monthly Subscriptions: One-click instant cancellation at any time with access retained through period end.
  - Digital Datasets & Pine Script licenses: Non-refundable once downloaded/accessed due to immediate intellectual property transfer, except in cases of technical failure or duplicate billing.

---

## 7. Tone, Copywriting & Human Empathy Rubric

All client-facing communications, marketing copy, and analytical briefs strictly adhere to the Dream Company **Zero-AI Copywriting Rubric**:
1. **Zero Cliché Buzzwords**: Strictly forbidden: *game-changer, revolutionizing, seamless, powerhouse, embark, delve, unlock potential*.
2. **Empathetic Market Realism**: Acknowledge the painful reality of retail drawdowns—the isolation of watching high-beta tech collapse while averaging down, the sleepless nights of undisciplined portfolio losses.
3. **Clinical Mathematical Authority**: Communicate through objective numbers—percentages, empirical win rates, max drawdowns, and verifiable dates.
