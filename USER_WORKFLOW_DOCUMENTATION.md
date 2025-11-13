# investogold User Sign-In to Payment Workflow Documentation

## Overview
Complete analysis of the user journey from sign-in through plan selection to payment completion in the investogold application.

## 🔐 Step 1: User Sign-In Workflow

### Login Page Location
- **File**: `src/app/(auth)/login/page.tsx`
- **URL**: `/login`

### Authentication Process
1. **Form Submission**: User enters email and password
2. **API Call**: `POST /api/user/auth/login`
3. **Authentication**: Server validates credentials
4. **Token Storage**: Client stores tokens in localStorage:
   ```javascript
   localStorage.setItem('authToken', token);
   localStorage.setItem('refreshToken', refreshToken);
   localStorage.setItem('userData', JSON.stringify(user));
   ```
5. **Redirection**: 
   - Admin users → `/adminpanel/dashboard`
   - Regular users → `/dashboard`

### Key Features
- Auto-redirect if already logged in
- Email verification modal for unverified accounts
- Error handling with user-friendly messages
- Password visibility toggle
- Form validation

---

## 📊 Step 2: Dashboard Access & Plan Button

### Dashboard Location
- **File**: `src/app/(dashboard)/dashboard/page.tsx`
- **URL**: `/dashboard`

### Plan Access Methods
Users can access plans through two ways:

#### Method 1: Inline Plans Section
- **Button**: "Trading Plans" 
- **Action**: `setActiveTab('plans')`
- **Result**: Shows `<DashboardPlans>` component inline within dashboard

#### Method 2: Dedicated Plans Page
- **Button**: "View Available Plans →"
- **Action**: `router.push('/plans')`
- **Result**: Navigates to `/plans` page (separate route)

### Plans Page
- **File**: `src/app/(dashboard)/plans/page.tsx`
- **Component**: Uses same `DashboardPlans` component
- **URL**: `/plans`

---

## 🎯 Step 3: Plan Selection Workflow

### Component Location
- **File**: `src/components/dashboard/DashboardPlans.tsx`

### Plan Selection Process

#### 3.1 Available Plans Display
- Fetches portfolios from `/api/portfolio/available`
- Displays plan cards with:
  - Plan name and description
  - Daily ROI percentage
  - Investment range (min/max)
  - Duration and features
  - Elite status indicators

#### 3.2 Plan Selection (`handleSelectPlan`)
```javascript
const handleSelectPlan = (portfolio: Portfolio) => {
  setSelectedPortfolio(portfolio);
  setInvestmentAmount(portfolio.minInvestment.toString());
  setShowInvestmentModal(true);
};
```
**Triggers**: Investment amount modal opens

#### 3.3 Investment Amount Validation
- User enters investment amount
- Validates against plan's min/max limits
- Shows investment details and fee breakdown

#### 3.4 Proceed to Payment (`handleProceedToPayment`)
```javascript
const handleProceedToPayment = async () => {
  // Validate investment amount
  const amount = parseFloat(investmentAmount);
  if (amount < selectedPortfolio.minInvestment || amount > selectedPortfolio.maxInvestment) {
    alert(`Investment amount must be between $${selectedPortfolio.minInvestment.toLocaleString()} and $${selectedPortfolio.maxInvestment.toLocaleString()}`);
    return;
  }

  // Fetch admin wallets and show payment modal
  await fetchAdminWallets();
  setShowInvestmentModal(false);
  setShowPaymentModal(true);
};
```

---

## 💳 Step 4: Payment Screen & Screenshot Upload

### Payment Modal UI Components

#### 4.1 Payment Method Selection
- **API**: `GET /api/deposit/payment-methods`
- **Function**: `fetchAdminWallets()`
- **Display**: Shows available crypto wallets (BTC, ETH, USDT, etc.)
- **Features**: 
  - Wallet selection
  - QR code display
  - Copy address functionality

#### 4.2 Screenshot Upload Interface
```tsx
<input
  type="file"
  accept="image/*"
  onChange={handleFileUpload}
  className="file input styling..."
/>
```

**Upload Validation**:
- **File Types**: JPEG, PNG, JPG only
- **File Size**: Maximum 5MB
- **Error Handling**: Shows user-friendly alerts

**File Processing**:
```javascript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setPaymentScreenshot(file);
  }
};
```

#### 4.3 Additional Form Fields
- **Transaction Reference**: Optional text field
- **Notes**: Optional textarea for additional information

---

## ✅ Step 5: Complete Payment Button Workflow

### Button Location & Trigger
```tsx
<button
  onClick={handleSubmitPayment}
  disabled={!paymentScreenshot || submittingPayment}
  className="payment-button-styles..."
>
  Complete Payment - ${parseFloat(investmentAmount).toLocaleString()}
</button>
```

### Payment Submission Process (`handleSubmitPayment`)

#### 5.1 Pre-submission Validation
```javascript
if (!selectedPortfolio || !investmentAmount || !selectedWallet || !paymentScreenshot) {
  alert('Please fill in all required fields and upload payment screenshot');
  return;
}
```

#### 5.2 Step 1: Initialize Deposit Transaction
- **API Call**: `POST /api/deposit/initialize`
- **Payload**:
  ```json
  {
    "portfolioId": selectedPortfolio.id,
    "investmentAmount": parseFloat(investmentAmount)
  }
  ```
- **Purpose**: Creates initial transaction record
- **Response**: Returns `transactionId` for next step

#### 5.3 Step 2: Convert Image to Base64
```javascript
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
```

#### 5.4 Step 3: Submit Payment Proof
- **API Call**: `POST /api/deposit/proof`
- **Payload**:
  ```json
  {
    "transactionId": initData.data.transactionId,
    "paymentMethod": selectedWallet.currency,
    "proofImage": proofImageBase64,
    "notes": paymentNote
  }
  ```

#### 5.5 Success Handling
```javascript
if (proofData.success) {
  // Store success data and show success modal
  setSuccessData({
    transactionId: proofData.data.transactionId,
    message: proofData.data.message
  });
  
  // Reset all form states
  setShowPaymentModal(false);
  setPaymentScreenshot(null);
  setPaymentNote('');
  setInvestmentAmount('');
  setSelectedPortfolio(null);
  setSelectedWallet(null);
  
  // Show success modal
  setShowSuccessModal(true);
}
```

---

## 🎉 Step 6: Success Confirmation

### Success Modal Display
- **Transaction ID**: Shows unique transaction identifier
- **Status Message**: Confirms submission success
- **Next Steps**: Informs user about review process
- **Timeline**: "Your investment will be reviewed and activated within 24 hours"

### Actions Available
- **Return to Dashboard**: Button to go back to main dashboard
- **View Transactions**: Link to transaction history

---

## 🔧 Technical Implementation Details

### API Endpoints Used
1. `POST /api/user/auth/login` - User authentication
2. `GET /api/portfolio/available` - Fetch available plans
3. `GET /api/deposit/payment-methods` - Get payment wallets
4. `POST /api/deposit/initialize` - Create transaction
5. `POST /api/deposit/proof` - Submit payment proof

### Security Features
- **Authentication**: Bearer token validation
- **File Validation**: Type and size restrictions
- **Timeout Handling**: 30-second request timeouts
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client-side and server-side validation

### User Experience Features
- **Loading States**: Shows progress during submission
- **Success Feedback**: Clear confirmation messages
- **Error Recovery**: Helpful error messages with retry options
- **Form Persistence**: Maintains form state during process
- **Responsive Design**: Works on all device sizes

---

## 📱 Complete User Journey Summary

```
1. User logs in at /login
   ↓
2. Redirected to /dashboard
   ↓
3. Clicks "Trading Plans" or "View Available Plans"
   ↓
4. Selects a plan → handleSelectPlan()
   ↓
5. Enters investment amount → handleProceedToPayment()
   ↓
6. Selects payment method (crypto wallet)
   ↓
7. Uploads payment screenshot
   ↓
8. Clicks "Complete Payment" → handleSubmitPayment()
   ↓
9. API calls: initialize → convert image → submit proof
   ↓
10. Success modal with transaction confirmation
```

## 🎯 Key Success Factors

1. **Seamless Flow**: No page reloads, all handled via modals
2. **Clear Validation**: Real-time feedback on form inputs  
3. **Secure Processing**: Multi-step API validation
4. **User Feedback**: Loading states and success confirmations
5. **Error Recovery**: Comprehensive error handling with user guidance

This workflow provides a complete, secure, and user-friendly investment process from authentication through payment completion.