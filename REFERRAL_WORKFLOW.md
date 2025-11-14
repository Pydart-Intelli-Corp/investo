# InvestoGold - 5-Level Referral System Guide

## Overview
InvestoGold operates a 5-level referral commission system. When users invest, their upline (the people who referred them) earn commissions automatically.

## Commission Structure
- **Level 1** (Direct Referral): 10%
- **Level 2**: 5%
- **Level 3**: 3%
- **Level 4**: 2%
- **Level 5**: 1%

**Total Commission Paid**: 21% of each investment

---

## How It Works - Simple Example

### The Referral Chain
```
Alice invests $1,000
  ↑ invited by Bob
    ↑ invited by Carol
      ↑ invited by David
        ↑ invited by Emma
          ↑ invited by Frank
```

### Commission Distribution
When Alice invests $1,000 and admin approves her payment:

| Person | Relationship to Alice | Commission Rate | Earns    |
|--------|----------------------|-----------------|----------|
| Bob    | Direct referrer      | 10%             | $100.00  |
| Carol  | 2nd level up         | 5%              | $50.00   |
| David  | 3rd level up         | 3%              | $30.00   |
| Emma   | 4th level up         | 2%              | $20.00   |
| Frank  | 5th level up         | 1%              | $10.00   |

**Total paid out**: $210.00

---

## User Workflow

### Step 1: New User Registers
1. User clicks on someone's referral link
2. User fills registration form
3. System automatically connects them to their referrer
4. User gets their own referral link to share

### Step 2: User Makes Investment
1. User logs into dashboard
2. Goes to **"Make Investment"** section
3. Selects a plan:
   - Gold Plan: $1,000 - $4,999
   - Platinum Plan: $5,000 - $9,999
   - Diamond Plan: $10,000+
4. Uploads payment screenshot (bank transfer proof)
5. Submits payment - Status shows **"Pending"**

### Step 3: User Checks Dashboard
**User Dashboard shows:**
- Total Investments
- Active Plan
- Referral Link (to share with others)
- Referral Statistics:
  - Level 1: X referrals - $XXX earned
  - Level 2: X referrals - $XXX earned
  - Level 3: X referrals - $XXX earned
  - Level 4: X referrals - $XXX earned
  - Level 5: X referrals - $XXX earned
- Total Commissions Earned
- Available Balance (can withdraw)

---

## Admin Workflow

### Where Admin Works
**Admin Panel Location**: Admin Panel section

### Admin Dashboard Overview
Admin sees:
- Total Users
- Total Investments
- Pending Payments (needs review)
- Total Commissions Paid
- Recent Activity

### Payment Management - Main Admin Task

**Location**: Admin Panel → **Payment Management**

#### Admin Sees Payment List:

Each payment shows:
- User name
- Plan type (Gold/Platinum/Diamond)
- Investment amount
- Payment screenshot (view button)
- Date submitted
- Current status (Pending/Approved/Rejected)
- Action buttons (Approve/Reject)

#### What Admin Does:

**1. Review Payment**
- View payment screenshot
- Verify bank transfer is legitimate
- Check amount matches the plan

**2. Approve Payment**
- Click **Approve** button
- System automatically:
  - Activates user's investment plan
  - Calculates commissions for 5 levels
  - Credits commission to each referrer's account
  - Sends notification to user
- Payment status changes to **Approved**

**3. Reject Payment** (if fraudulent)
- Click **Reject** button
- Write reason (optional)
- User gets notified to resubmit

### What Happens After Approval

**Automatic Commission Distribution:**

If Alice's $1,000 payment is approved:
1. System finds Bob (who invited Alice) → Credits $100
2. System finds Carol (who invited Bob) → Credits $50
3. System finds David (who invited Carol) → Credits $30
4. System finds Emma (who invited David) → Credits $20
5. System finds Frank (who invited Emma) → Credits $10

**Each person sees updated balance in their dashboard immediately!**

---

## Admin Views Available Data

### 1. Payment Management Screen
**Shows:**
- All payment submissions
- User information
- Investment amounts
- Payment proof images
- Current status (Pending/Approved/Rejected)
- Date submitted
- Filter by status
- Search by username
- Export to CSV

### 2. User Management Screen
**Shows:**
- All registered users
- Email, username, referral code
- Who referred them
- Total investments made
- Commission earned
- Account status

### 3. Referral Network View
**Shows:**
- Complete referral tree
- Who referred whom
- Network depth
- Total commissions per user
- Breakdown by levels

### 4. Commission Reports
**Shows:**
- Total commissions paid (all time)
- Commissions paid today/week/month
- Breakdown by level (L1: $X, L2: $X, etc.)
- Top earners
- Export functionality

---

## User Dashboard - What Users See

### Main Dashboard Sections:

**1. Investment Summary Card**
- Current Active Plan (Gold/Platinum/Diamond)
- Investment Amount
- Start Date
- Status

**2. Referral Program Section**
Shows **5-Level Breakdown**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Referral Program - 5-Level System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level 1  [10%]  •  5 referrals  •  $500.00
Level 2  [5%]   •  3 referrals  •  $150.00
Level 3  [3%]   •  2 referrals  •  $60.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Earned: $710.00
Network Size: 10 people
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**3. Quick Stats Cards**
- Total Earned (all commissions)
- Available Balance (can withdraw)
- Network Size (total referrals across 5 levels)

**4. Referral Link Box**
- Your unique link to share
- Copy button
- Social media share buttons

**5. Recent Activity**
- Latest commission earned
- New referrals joined
- Payment approvals

---

## Commission Examples

### Example 1: One Direct Referral
```
You invite John → John invests $2,000
You earn: $2,000 × 10% = $200
```

### Example 2: Three Level Chain
```
You invite Sarah → Sarah invites Mike → Mike invites Tom
Tom invests $5,000

Results:
- Sarah earns: $5,000 × 10% = $500 (she's Mike's direct referrer)
- You earn: $5,000 × 5% = $250 (you're Sarah's referrer, Mike is Level 2 for you)
- Mike earns: $5,000 × 10% = $500 (he's Tom's direct referrer)
```

### Example 3: Building a Network
```
You build this network:
- 10 direct referrals (Level 1)
- 20 people they bring (Level 2)  
- 30 people at Level 3
- 15 people at Level 4
- 5 people at Level 5

If everyone invests $1,000:
- Level 1: 10 × $100 = $1,000
- Level 2: 20 × $50 = $1,000
- Level 3: 30 × $30 = $900
- Level 4: 15 × $20 = $300
- Level 5: 5 × $10 = $50
Total: $3,250
```

---

## Key Points to Remember

✅ **Commissions are automatic** - No manual calculation needed
✅ **Paid instantly** - When admin approves payment, commissions credit immediately
✅ **Transparent** - Users see exact breakdown by level
✅ **Fair system** - Everyone earns from their network
✅ **No limits** - Build network as large as you want

⚠️ **Important**: 
- Commissions only paid when admin **approves** the payment
- If someone doesn't have 5 levels above them, commission stops at last referrer
- Users must be registered through a referral link to be connected

---

## Admin's Daily Tasks

1. **Morning**: Check pending payments
2. **Review**: Look at payment screenshots
3. **Verify**: Confirm transfers are real
4. **Approve**: Click approve for legitimate payments
5. **Monitor**: Check for suspicious activity
6. **Export**: Download reports for accounting

**That's it!** The system handles all commission calculations automatically.
