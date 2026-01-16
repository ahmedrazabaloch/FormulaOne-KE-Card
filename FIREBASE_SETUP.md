# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name: `office-duty-card` (or any name)
4. Enable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Create Firestore Database

1. In Firebase Console, click **Build** → **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select your region and click **Create**

## Step 3: Create Storage Bucket

1. In Firebase Console, click **Build** → **Storage**
2. Click **Get Started**
3. Accept security rules and **Create**

## Step 4: Get Your Firebase Config

1. In Firebase Console, click the **⚙️ Settings** icon → **Project Settings**
2. Scroll to **Your Apps** and click **Web** icon
3. Copy the config object

## Step 5: Create `.env.local` File

In the root of your project (`office-duty-card/`), create a file named `.env.local`:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace each value with your actual Firebase config.

## Step 6: Set Firestore Security Rules

In **Firestore Database** → **Rules**, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads and writes for now (change in production)
    match /cards/{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **For production**, implement proper authentication and authorization.

## Step 7: Set Storage Security Rules

In **Storage** → **Rules**, replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## How It Works

1. **Fill the form** → Data automatically saves to **localStorage**
2. **Refresh the page** → Data loads from localStorage
3. **Click "Save to Database"** → Data + photo uploads to Firestore
4. **After save** → localStorage clears, form resets, ready for new card

---

**Need help?** Check [Firebase Docs](https://firebase.google.com/docs)
