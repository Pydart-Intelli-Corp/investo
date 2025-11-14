# 🚀 InvestoGold Plans Deployment Guide

## Quick Start - Update Investment Plans

### Step 1: Run the Update Script

Execute the InvestoGold plans update script to replace old cryptocurrency plans with new gold & commodity investment offerings:

```bash
npm run update-plans
```

This script will:
- ✅ Deactivate all existing cryptocurrency/arbitrage plans
- ✅ Create 3 new InvestoGold investment plans:
  1. **AI-Driven Trade Portfolio** ($1K-$100K, 24 months, 7-10% monthly)
  2. **Gold Vault Investment** ($5K-$500K, 12 months, 12-15% annual)
  3. **Weekly Arbitrage Strategy** ($10K-$1M, 24 months, 3-5% weekly)

### Step 2: Rebuild Frontend

After updating the database plans, rebuild the Next.js frontend to reflect all UI changes:

```bash
npm run build
```

### Step 3: Restart Application

#### Using PM2 (Recommended for Production):
```bash
pm2 restart investogold
# or
npm run pm2:restart
```

#### Using Standard Node:
```bash
# Stop the current process (Ctrl+C) then:
npm start
```

### Step 4: Verify Changes

Visit your application and verify:

1. **Dashboard Plans Page** (`/plans` or `/dashboard`)
   - Should display 3 new InvestoGold plans
   - Gold-themed color scheme applied
   - Correct investment ranges and terms

2. **Homepage**
   - Hero section: "InvestoGold — Intelligent Wealth Solutions"
   - Features section updated with gold & commodity focus
   - Affiliate section shows 10% commission structure

3. **Admin Panel** (`/adminpanel`)
   - Old plans marked as inactive
   - New plans visible in portfolio management

---

## Alternative: Manual Database Update

If the script fails, you can manually update via SQL:

```sql
-- Connect to your database
mysql -u btc_remote -p investogold_db

-- Deactivate old plans
UPDATE portfolios SET is_active = 0, is_visible = 0 WHERE 1=1;

-- Then run the update script
```

---

## Rollback (If Needed)

If you need to revert changes:

```bash
# Restore database from backup
mysql -u btc_remote -p investogold_db < backup.sql

# Revert code changes
git checkout main
git pull origin main

# Rebuild and restart
npm run build
pm2 restart investogold
```

---

## Troubleshooting

### Plans Not Showing Up

**Check database connection:**
```bash
node -e "const {sequelize} = require('./config/database'); sequelize.authenticate().then(() => console.log('Connected')).catch(err => console.error(err));"
```

**Verify plans in database:**
```sql
SELECT name, is_active, is_visible, type, category 
FROM portfolios 
ORDER BY display_order;
```

### Frontend Not Updated

**Clear build cache:**
```bash
rm -rf .next
npm run build
pm2 restart investogold
```

**Hard refresh browser:**
- Windows/Linux: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Script Errors

**Check admin user exists:**
```sql
SELECT id, email, role FROM users WHERE role = 'admin';
```

**Run with verbose logging:**
```bash
NODE_ENV=development node scripts/update-investogold-plans.js
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Backup current database
- [ ] Test on staging environment first
- [ ] Verify all 3 plans created correctly
- [ ] Check commission rates updated
- [ ] Test investment flow end-to-end
- [ ] Verify referral program working
- [ ] Update admin wallets if needed
- [ ] Monitor error logs after deployment
- [ ] Verify email templates updated
- [ ] Test payment screenshot upload

---

## Database Schema Verification

Confirm the portfolios table structure includes:

```sql
DESCRIBE portfolios;
```

Required fields:
- `id`, `name`, `slug`, `description`
- `min_investment`, `max_investment`
- `duration_value`, `duration_unit`
- `daily_roi`, `total_return_limit`
- `type`, `category`
- `is_active`, `is_visible`
- `gradient_color_from`, `gradient_color_to`
- `features` (JSON)
- `bot_settings` (JSON)

---

## Support

For issues during deployment:

**Email**: support@investogold.com  
**Documentation**: See `INVESTOGOLD_REBRAND_2024.md`  
**Technical Support**: Check application logs in `logs/` directory

---

## Post-Deployment Monitoring

Monitor these metrics for 24-48 hours after deployment:

1. **Application Health**
   ```bash
   curl http://localhost:5000/health
   pm2 logs investogold
   ```

2. **Database Performance**
   ```sql
   SELECT COUNT(*) as total_plans FROM portfolios WHERE is_active = 1;
   SELECT name, total_subscribers FROM portfolios WHERE is_active = 1;
   ```

3. **User Activity**
   - New registrations
   - Plan selections
   - Investment submissions
   - Error rates

---

**✨ InvestoGold - Where Intelligence Meets Gold**

Ready to deploy? Run `npm run update-plans` to begin! 🚀
