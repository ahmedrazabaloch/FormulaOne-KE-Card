# Firebase Security Rules Fix

The CORS errors indicate that Firebase Storage is rejecting writes. You need to update your security rules.

## Step 1: Update Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Build** → **Firestore Database**
3. Click **Rules** tab
4. Replace ALL content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{document=**} {
      allow read, write: if request.auth != null || true;
    }
  }
}
```

Click **Publish**

## Step 2: Update Storage Rules

1. Go to **Build** → **Storage**
2. Click **Rules** tab
3. Replace ALL content with this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read, write: if request.auth != null || true;
    }
  }
}
```

Click **Publish**

## Step 3: Verify API Key Restrictions

1. Go to **Build** → **Authentication** (or APIs & Services)
2. Check that your web app's API key is **unrestricted** for development

## Step 4: Clear Browser Cache & Reload

```bash
# In browser DevTools (F12)
1. Application → Storage → Clear All
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
```

## Step 5: Test Save Again

Fill the form and click "Save to Database" - it should work now!

---

⚠️ **IMPORTANT FOR PRODUCTION**: These rules (`|| true`) allow unauthenticated access. For production, implement proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

And set up Firebase Authentication (Email/Password or Google Sign-In).
