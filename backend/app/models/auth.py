"""
backend/app/models/auth.py - Authentication and Pro Access Control Pydantic schemas
"""
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class LicenseValidateRequest(BaseModel):
    license_key: str = Field(..., description="Lemon Squeezy or Demo license key")
    instance_name: Optional[str] = Field(None, description="Optional client instance identifier")


class LicenseValidateResponse(BaseModel):
    valid: bool = Field(..., description="Whether license is valid and active")
    tier: str = Field("free", description="Subscription tier: 'pro', 'pro_lifetime', or 'free'")
    license_key: str = Field(..., description="Validated license key")
    expires_at: Optional[str] = Field(None, description="ISO timestamp for license expiration")
    message: str = Field(..., description="Human-readable validation message")


class AdminLoginRequest(BaseModel):
    username: str = Field(..., description="Admin username")
    password: str = Field(..., description="Admin password")


class AdminLoginResponse(BaseModel):
    authenticated: bool = Field(..., description="Whether admin credentials are valid")
    role: str = Field("guest", description="'admin' when authenticated")
    license_key: Optional[str] = Field(None, description="Auto-granted Pro license key for admin")
    message: str = Field(..., description="Authentication status message")


class ProVaultResponse(BaseModel):
    unlocked: bool = Field(..., description="Pro vault unlock status")
    tier: str = Field("pro", description="Access tier")
    pine_script_available: bool = Field(True, description="Indicator code access flag")
    tools: List[str] = Field(default_factory=list, description="Enabled pro quantitative tools")


class PineScriptResponse(BaseModel):
    version: str = Field("v5", description="TradingView Pine Script syntax version")
    name: str = Field("RightSideAlpha PW-RSI", description="Script title")
    code: str = Field(..., description="TradingView Pine Script v5 source code")


class ProPositionDoctorRequest(BaseModel):
    ticker: str = Field(..., description="Stock symbol")
    entry_price: float = Field(..., description="Entry execution price (must be positive)")
    days_held: int = Field(..., description="Trading days held (must be non-negative)")
    current_price: Optional[float] = Field(None, description="Optional current stock price")

    @field_validator("entry_price")
    @classmethod
    def validate_entry_price(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Entry price must be positive")
        return v

    @field_validator("days_held")
    @classmethod
    def validate_days_held(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Days held cannot be negative")
        return v


class ProPositionDoctorResponse(BaseModel):
    ticker: str
    status_code: str
    status_label: str
    return_pct: float
    rule_triggered: str
    action_plan: str
    is_critical: bool
    entry_price: float = 0.0
    current_price: float = 0.0
    stop_price: Optional[float] = None
    tp1_price: Optional[float] = None
    as_of_date: str = "2026-10-13"


# --- VIP Portfolio Doctor 2.0 & Quantitative Terminal Schemas ---

class PortfolioPositionItem(BaseModel):
    ticker: str = Field(..., description="Stock symbol (e.g. CELH, NVDA)")
    entry_price: float = Field(..., description="Purchase price per share")
    shares: float = Field(default=1.0, description="Quantity of shares held")
    days_held: int = Field(default=0, description="Number of trading days held")
    current_price: Optional[float] = Field(None, description="Optional current market price override")

    @field_validator("entry_price")
    @classmethod
    def validate_entry_price(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Entry price must be positive")
        return v

    @field_validator("shares")
    @classmethod
    def validate_shares(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Shares must be positive")
        return v

    @field_validator("days_held")
    @classmethod
    def validate_days_held(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Days held cannot be negative")
        return v


class PortfolioDoctorRequest(BaseModel):
    positions: List[PortfolioPositionItem] = Field(..., description="List of positions to diagnose")
    total_capital: Optional[float] = Field(10000.0, description="Total portfolio capital in USD")


class PortfolioPositionDiagnostic(BaseModel):
    ticker: str = Field(..., description="Stock symbol")
    status_code: str = Field(..., description="Status code: HARD_STOP | TIME_STOP | TP1_HARVEST | HOLD")
    action: str = Field(..., description="Action: CRITICAL_STOP_EXIT | DEAD_MONEY_ROTATE | TP1_TAKE_PROFIT | ACTIVE_HOLD")
    current_return_pct: float = Field(..., description="Return percentage")
    hard_stop_price: float = Field(..., description="Rule 1 -9% hard stop price")
    is_critical: bool = Field(..., description="True if immediate risk liquidation required")
    directive: str = Field(..., description="Tactical directive")
    entry_price: Optional[float] = Field(0.0, description="Entry purchase price")
    current_price: Optional[float] = Field(0.0, description="Current price")
    shares: Optional[float] = Field(1.0, description="Shares held")
    days_held: Optional[int] = Field(0, description="Days held")
    invested_value: Optional[float] = Field(0.0, description="Market value in USD")
    unrealized_pnl: Optional[float] = Field(0.0, description="Unrealized dollar profit/loss")


class StressScenarioResult(BaseModel):
    name: str = Field(..., description="Macro stress scenario title")
    projected_pnl_pct: float = Field(..., description="Projected portfolio return percentage")
    impact_usd: float = Field(..., description="Projected dollar impact on invested capital")
    verdict: str = Field(..., description="Assessment: Vulnerable | Resilient | High Upside | Moderate Risk")


class RebalanceRecommendation(BaseModel):
    action: str = Field(..., description="Action: HARVEST | REALLOCATE | MAINTAIN")
    ticker: Optional[str] = Field(None, description="Source ticker to harvest capital from")
    target_ticker: Optional[str] = Field(None, description="Target ignition ticker for reallocation")
    amount_usd: float = Field(..., description="Capital amount in USD")
    allocation_pct: Optional[float] = Field(None, description="Suggested portfolio allocation percentage")
    reason: str = Field(..., description="Quantitative justification")
    setup_type: Optional[str] = Field(None, description="Setup regime classification")


class PortfolioDoctorResponse(BaseModel):
    health_score: int = Field(..., description="Portfolio Health Score (0-100)")
    total_invested: float = Field(..., description="Total capital currently invested in positions")
    total_unrealized_pnl: float = Field(..., description="Total unrealized profit/loss in USD")
    total_unrealized_pnl_pct: float = Field(..., description="Total unrealized profit/loss percentage")
    capital_at_risk: float = Field(..., description="Aggregate capital at risk against Rule 1 -9% stop loss")
    items: List[PortfolioPositionDiagnostic] = Field(default_factory=list, description="Position diagnostics")
    stress_scenarios: List[StressScenarioResult] = Field(default_factory=list, description="Macro stress scenarios")
    rebalance_recommendations: List[RebalanceRecommendation] = Field(default_factory=list, description="Rebalance actions")


class SectorMatrixItem(BaseModel):
    name: str = Field(..., description="Sector name")
    count: int = Field(..., description="Number of equities in sector")
    avg_score: float = Field(..., description="Average PW-RSI composite score")
    momentum_trend: str = Field(..., description="Regime trend: BULLISH | NEUTRAL | BEARISH")
    ignition_count: int = Field(..., description="Number of stocks meeting ignition criteria")
    tickers: List[str] = Field(default_factory=list, description="Equities belonging to sector")


class SectorMatrixResponse(BaseModel):
    sectors: List[SectorMatrixItem] = Field(default_factory=list, description="List of sector regime metrics")


class WatchlistRequest(BaseModel):
    tickers: List[str] = Field(default_factory=list, description="List of stock tickers to update")
    action: Optional[str] = Field("set", description="Action: 'set', 'add', 'remove', or 'clear'")


class WatchlistResponse(BaseModel):
    watchlist: List[str] = Field(default_factory=list, description="Current synchronized watchlist tickers")
    count: int = Field(0, description="Total number of tickers in watchlist")
    message: str = Field("Watchlist updated successfully", description="Status message")

