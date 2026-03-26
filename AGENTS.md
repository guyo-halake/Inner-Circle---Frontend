<!-- BEGIN:nextjs-agent-rules -->
# InnerCircle Investor Platform - Developer Guide

This project uses a custom real-time simulation layer for investor dashboards. 

## Key Conventions:
- **Currency**: All amounts must be formatted using `formatKSh` from `@/lib/utils`.
- **Real-time**: Use hooks in `@/hooks/` for live updates (Portfolio, Notifications).
- **Production**: Always include `Loading` skeletons and `Error` boundaries for new routes.
- **UI**: Follow the minimalist design (Inter for UI, Roboto for Numbers).

## Kenyan Localization:
- Primary Currency: Kenyan Shilling (KSh)
- Primary Payment: M-Pesa (STK Push integration ready)
- Bank Transfers: KCB, Equity Bank support.
<!-- END:nextjs-agent-rules -->
