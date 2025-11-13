# investogold App Directory Organization

## Current Structure

```
src/app/
├── (auth)/                  # Authentication routes
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── verify-email/
│   └── verify-otp/
├── (dashboard)/             # User dashboard routes
│   ├── dashboard/
│   ├── profile/
│   ├── deposit/
│   └── plans/
├── (legal)/                 # Legal pages
│   ├── privacy-policy/
│   └── terms-and-conditions/
├── adminpanel/              # Admin routes
│   ├── dashboard/
│   ├── deposits/
│   └── deposit-details/
├── globals.css
├── layout.tsx
├── page.tsx
└── favicon.ico
```

## Benefits

- **Route Groups**: Using Next.js route groups to organize routes logically without affecting URLs
- **Clear Separation**: Authentication, dashboard, legal, and admin routes are clearly separated
- **Maintainable**: Easy to find and manage related pages
- **Scalable**: Easy to add new routes to appropriate groups

## URL Structure Unchanged

The URLs remain the same because route groups (directories in parentheses) don't affect the URL structure:

- `/login` → `/(auth)/login/page.tsx`
- `/dashboard` → `/(dashboard)/dashboard/page.tsx`
- `/privacy-policy` → `/(legal)/privacy-policy/page.tsx`
- `/adminpanel/dashboard` → `/adminpanel/dashboard/page.tsx`

All existing links and routing continue to work without modification.