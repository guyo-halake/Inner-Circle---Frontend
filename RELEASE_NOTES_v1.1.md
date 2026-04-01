# InnerCircle v1.1

Release date: 2026-04-01

## Highlights
- Major UX refresh across core product pages with a more professional, minimalist design style.
- Transactions experience reworked for clearer Deposit/Withdraw/History flows.
- Admin and Developer control surfaces expanded for operational use.
- Dashboard streamlined with cleaner actions and less visual clutter.

## Frontend updates
- Transactions page improvements:
  - Better method-specific flows for M-Pesa, Bank, PayPal, and Binance.
  - Bank selection and paybill/account presentation improved.
  - Improved request payload structure and auth/session handling.
- Dashboard updates:
  - Cleaner welcome and summary presentation.
  - Quick action buttons updated and wired to working routes.
  - Removed noisy/undesired wallet-heavy sections.
- Reports and Settings pages:
  - Converted from jargon-heavy copy to clear, plain-language UX.
  - Improved spacing, hierarchy, and readability.
- Admin + Developer Settings:
  - Sidebar links added.
  - New operational structure and controls introduced.

## Backend updates
- Admin route capabilities expanded for live management workflows.
- Payment and portfolio route integrations aligned with frontend transaction workflows.
- Realtime/socket and auth-related integrations updated.

## Data and account setup
- Admin and Developer accounts provisioned for role-based access testing.
- Financial channel/bank records updated to support live UI flows.

## Notes
- This release is tagged from branch `update-2`.
- Follow-up hardening recommended for production rollout: CI gates, e2e tests, and environment validation.
