# Cloudinary Setup for Image Upload

**Why Cloudinary?** Free tier with unlimited bandwidth, no CORS issues, and images are CDN-optimized.

## Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Sign up with email
3. Verify email
4. You'll get a **Cloud Name** (e.g., `duhvygj8p`)

## Step 2: Create Upload Preset (Unsigned)

This allows uploading without authentication—perfect for frontend.

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Fill in:
   - **Name:** `office_duty_card`
   - **Signing Mode:** `Unsigned` ⚠️ Important!
5. Click **Save**

## Step 3: Get Your Cloud Name

1. Go to **Settings** → **Account**
2. Copy your **Cloud Name** (e.g., `duhvygj8p`)

## Step 4: Update the Code

The upload endpoint in `firestoreService.js` is already configured:

```javascript
https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
```

**If using a different Cloud Name**, replace `duhvygj8p` with your actual Cloud Name in:
```
src/services/firestoreService.js line 16
```

And update the upload preset name if you named it differently:
```
formData.append("upload_preset", "office_duty_card");
```

## Step 5: Test Save

1. Fill the form
2. Click "Save to Database"
3. Image uploads to Cloudinary → URL saved to Firestore
4. Done! ✅

---

## How It Works

1. User uploads image in form (stored in memory as base64)
2. Click "Save to Database"
3. Image is sent to Cloudinary (unsigned upload)
4. Cloudinary returns image URL
5. URL + employee/vehicle data saved to Firestore
6. localStorage is cleared, form resets

---

## Free Tier Limits

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** Unlimited
- Sufficient for most admin apps!

---

## Security Note

- This uses **unsigned uploads** (no API key needed)
- In production, add folder restrictions in the upload preset to prevent abuse
- Set upload preset to accept only images
