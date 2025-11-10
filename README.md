# Brokk AI Trading Platform - Phase 1 PoC

AI-powered cryptocurrency trading platform with intelligent risk management and goal-based trading plans.

## Features (Phase 1)

### ✅ Implemented

- **Dashboard**: Portfolio overview with real-time stats, goals tracking, and recent signals
- **AI Signals**: View and analyze trading signals for BTC and ETH with confidence scores and explanations
- **Goal Planning**: Create and manage trading goals with custom risk parameters
- **Exchange Integration**: View balances and market data for BTC/USDT and ETH/USDT pairs
- **Trading History**: Track balance changes, orders, and trades with filtering options
- **Risk Settings**: Configure risk controls including VaR, drawdown limits, and position caps
- **User Profile**: View account information and verification status

### 🎨 Design Features

- Modern, professional dark mode UI
- Fully responsive design (mobile, tablet, desktop)
- Real-time data visualization with charts
- Smooth animations and transitions
- Custom scrollbars and professional typography

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Project Structure

```
/app
  /dashboard       # Main dashboard page
  /profile         # User profile
  /signals         # AI signals display
  /goals           # Goal planning & management
  /exchange        # Exchange integration
  /history         # Trading history
  /settings        # Risk control settings

/components
  /ui              # Shadcn UI components
  /layout          # Layout components (Sidebar, Header)
  /dashboard       # Dashboard-specific components
  /charts          # Chart components (Recharts)
  /forms           # Form components

/lib
  /api             # API service layer
  /stores          # Zustand stores
  /types           # TypeScript type definitions
  /utils           # Utility functions

/hooks             # Custom React hooks
```

## Key Features Detail

### Risk Management (Phase 1)

- **Per-Asset Cap**: Maximum 20% of capital per asset (default)
- **Max Daily VaR**: 2% Value at Risk per day
- **Max Drawdown**: 3% maximum portfolio drawdown
- **Max Slippage**: 0.25% per order
- **Stablecoin Buffer**: Minimum 10-15% buffer

### Trading Signals

- **Strong Buy Threshold**: Probability > 62%, Confidence > 60%
- **Horizons**: 1 Day, 1 Week, 1 Month
- **Explanations**: Top 3 reasons with source links
- **Risk Flags**: Warnings about potential risks

### Goal Planning

- Set initial capital, target return %, and time horizon
- Choose risk profile: Conservative, Moderate, or Aggressive
- Configure custom constraints (VaR, drawdown, asset caps)
- Track progress with probability calculations
- Circuit breakers for automatic risk protection

## API Integration

The frontend expects a backend API with the following endpoints:

```
GET    /api/user/profile
GET    /api/signals?horizon=1w
POST   /api/goals
GET    /api/goals
GET    /api/exchange/balance
GET    /api/market/pairs
GET    /api/history/trades
GET    /api/history/orders
GET    /api/history/balance
GET    /api/risk/config
POST   /api/risk/config
```

## Development

### Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

### Adding New Components

Use Shadcn CLI to add components:

```bash
npx shadcn@latest add [component-name]
```

## Important Notes

### Phase 1 Limitations

- **Paper Trading Only**: No real money trading
- **Limited Assets**: BTC and ETH only
- **Single Exchange**: TCX staging server only
- **Spot Trading Only**: No leverage or futures
- **No Authentication**: Auth will be added in Phase 2

### Compliance & Disclaimers

The platform prominently displays:
- "No guaranteed profits"
- "Results are probabilistic, not certain"
- "May lose money"
- "Not financial advice"

All risk controls are enforced and circuit breakers activate automatically at configured thresholds.

## Future Phases

### Phase 2
- Real money trading on TCX production
- Advanced risk controls (blacklist/whitelist, event pausing)
- More social media sentiment sources
- Advanced execution (VWAP, smart routing)
- Post-trade surveillance

### Phase 3
- Multiple exchanges support
- Mobile application
- Advanced optimization
- More trading pairs and assets
- Admin control panel

## License

Proprietary - SotaTek Technology Joint Stock Company

## Support

For issues and questions, contact the development team.
