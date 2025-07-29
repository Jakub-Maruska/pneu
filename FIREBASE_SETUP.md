# Firebase Setup Guide for Tire Manager Pro

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "tire-manager-pro")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "tire-manager-web")
6. Copy the firebaseConfig object

## Step 4: Update Configuration

Replace the placeholder values in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 5: Set Up Security Rules

In Firestore Database → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for now
    // In production, you should add proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Test the Integration

1. Open your app in a browser
2. Try adding a new tire
3. Check the Firestore Database to see if the data appears
4. Open the app in another browser/device to verify real-time updates

## Step 7: Deploy to Web Server

For production, you'll need to:

1. Host your files on a web server (GitHub Pages, Netlify, Vercel, etc.)
2. Update Firebase security rules to restrict access
3. Consider adding user authentication

## Alternative Database Options

### Option 2: Supabase (PostgreSQL-based)
- Free tier available
- Real-time subscriptions
- SQL database with REST API

### Option 3: MongoDB Atlas
- Free tier available
- Document-based database
- REST API available

### Option 4: AWS DynamoDB
- Pay-per-use pricing
- Highly scalable
- Part of AWS ecosystem

## Security Considerations

1. **Authentication**: Add user login system
2. **Authorization**: Restrict data access based on user roles
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Prevent abuse
5. **Backup**: Set up regular data backups

## Performance Tips

1. **Indexing**: Create indexes for frequently queried fields
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Cache frequently accessed data
4. **Offline Support**: Consider offline-first architecture

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is allowed in Firebase settings
2. **Permission Denied**: Check Firestore security rules
3. **Network Errors**: Verify internet connection and Firebase configuration
4. **Real-time Updates Not Working**: Check if onSnapshot listeners are properly set up

### Debug Tips:

1. Open browser developer tools
2. Check the Console tab for errors
3. Use Firebase console to monitor database activity
4. Test with simple data first 