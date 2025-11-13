# investogold Screenshot Storage Analysis

## 📸 **Where Payment Screenshots Are Saved**

### **Storage Method: Database Storage (Base64)**

The payment screenshots in investogold are **stored directly in the MySQL database** as Base64-encoded strings, not as physical files on the server.

## 🔄 **Complete Storage Flow**

### **1. Frontend Upload Process**
**File**: `src/components/dashboard/DashboardPlans.tsx`

```javascript
// User selects image file
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validation: JPEG/PNG only, max 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setPaymentScreenshot(file); // Store File object
  }
};
```

### **2. Base64 Conversion**
**During Payment Submission**:

```javascript
// Convert file to Base64 string
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Creates data:image/jpeg;base64,/9j/4AAQ...
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const proofImageBase64 = await convertFileToBase64(paymentScreenshot);
```

### **3. API Submission**
**Endpoint**: `POST /api/deposit/proof`
**File**: `api/deposit.js`

```javascript
const uploadPaymentProof = asyncHandler(async (req, res) => {
  const { transactionId, paymentMethod, proofImage, notes } = req.body;
  
  // proofImage contains the full Base64 string
  // Example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  
  await transaction.update({
    proofImage: proofImage || null, // Stored directly in database
    // ... other fields
  });
});
```

## 💾 **Database Storage Details**

### **Table**: `transactions`
**Field**: `proofImage`
**Type**: `TEXT` (MySQL)
**File**: `models/Transaction.js`

```javascript
proofImage: {
  type: DataTypes.TEXT,    // Can store up to 65,535 characters
  allowNull: true
}
```

### **Storage Format**
- **Format**: Base64 encoded string
- **Example**: `"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."`
- **Size**: Original file size × 1.37 (Base64 overhead)
- **Max Size**: ~48KB per image (due to TEXT field limit)

## 📂 **Physical File Storage**

### **Uploads Directory Status**
```
/uploads/
└── .gitkeep  (empty directory)
```

**❌ No Physical Files**: The system does NOT save image files to the filesystem. The `/uploads` directory exists but is unused for screenshot storage.

## 👨‍💼 **Admin Viewing Process**

### **How Admins See Screenshots**
**File**: `src/components/admin/DepositManagement.tsx`

```tsx
{selectedDeposit.proofImage && (
  <div>
    <h4>Payment Proof</h4>
    <img
      src={selectedDeposit.proofImage}  // Direct Base64 data URL
      alt="Payment Proof"
      className="w-full h-32 object-cover rounded"
    />
  </div>
)}
```

### **Display Method**
- Browser renders Base64 data URL directly
- No additional server requests needed
- Immediate image display

## ⚡ **Pros & Cons of This Approach**

### **✅ Advantages**
- **Simplicity**: No file system management
- **Atomic Transactions**: Image and data stored together
- **No File Paths**: No broken links or missing files
- **Backup Friendly**: Images included in database backups

### **❌ Disadvantages**
- **Database Size**: Images increase database size significantly
- **Memory Usage**: Loading transactions loads image data
- **Size Limitations**: TEXT field limits image size (~48KB)
- **Performance**: Large Base64 strings slow queries

## 🔍 **Data Flow Summary**

```
1. User uploads image file (JPEG/PNG, max 5MB)
   ↓
2. JavaScript FileReader converts to Base64
   ↓  
3. Base64 string sent via POST /api/deposit/proof
   ↓
4. Stored in transactions.proofImage (TEXT field)
   ↓
5. Admin views image via Base64 data URL in browser
```

## 🛠️ **Technical Recommendations**

### **Current Limitations**
- TEXT field limits images to ~48KB
- Large images may be truncated or rejected

### **Potential Improvements**
1. **Upgrade to LONGTEXT**: Support larger images
2. **File System Storage**: Save files, store paths in database
3. **Cloud Storage**: Use AWS S3, Cloudinary, etc.
4. **Image Compression**: Reduce file sizes before storage

## 📊 **Storage Statistics**

- **Current Storage**: MySQL database
- **Field Type**: TEXT (max ~65KB)
- **Format**: Base64 data URLs
- **Compression**: None (raw Base64)
- **File System Usage**: 0 bytes (no physical files)

---

**Answer**: Payment screenshots are stored as **Base64-encoded strings directly in the MySQL database** in the `transactions.proofImage` field, not as physical files on the server.