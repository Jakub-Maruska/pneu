# Tire Manager Pro - Database Integration

This project has been updated to use Firebase Firestore as a real-time database, allowing multiple users to see the same data simultaneously.

## 🚀 Quick Start

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Get your Firebase configuration

### 2. Configure Firebase

1. Open `firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

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

### 3. Set Up Security Rules

In Firebase Console → Firestore Database → Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Populate Sample Data

1. Open `migrate.html` in your browser
2. Click "📥 Migrate Sample Data" to populate the database
3. Check the Firebase Console to verify data was added

### 5. Test the Application

1. Open your app in multiple browser windows
2. Add/edit/delete tires in one window
3. Verify changes appear in real-time in other windows

## 📁 File Structure

```
pneu/
├── firebase-config.js          # Firebase configuration and database service
├── storage.html                # Storage page (updated for Firebase)
├── storage.js                  # Storage logic (updated for Firebase)
├── trailer.html                # Trailer list page (updated for Firebase)
├── trailer.js                  # Trailer list logic (updated for Firebase)
├── trailer-detail.html         # Trailer detail page (updated for Firebase)
├── trailer-detail.js           # Trailer detail logic (updated for Firebase)
├── truck.html                  # Truck list page (updated for Firebase)
├── truck.js                    # Truck list logic (updated for Firebase)
├── truck-detail.html           # Truck detail page (updated for Firebase)
├── truck-detail.js             # Truck detail logic (updated for Firebase)
├── migrate-data.js             # Data migration script
├── migrate.html                # Migration tool UI
└── FIREBASE_SETUP.md           # Detailed Firebase setup guide
```

## 🔄 Real-Time Features

- **Live Updates**: Changes made by any user appear instantly for all users
- **Tire Management**: Add, edit, delete tires with real-time synchronization
- **Vehicle Assignment**: Assign/remove tires from trucks and trailers
- **Status Tracking**: Real-time status updates across all devices

## 🛠️ Database Operations

The `DatabaseService` provides these operations:

### Tires
- `getTires()` - Get all tires
- `addTire(tire)` - Add new tire
- `updateTire(id, updates)` - Update tire
- `deleteTire(id)` - Delete tire

### Trucks
- `getTrucks()` - Get all trucks
- `addTruck(truck)` - Add new truck
- `updateTruck(id, updates)` - Update truck
- `deleteTruck(id)` - Delete truck

### Trailers
- `getTrailers()` - Get all trailers
- `addTrailer(trailer)` - Add new trailer
- `updateTrailer(id, updates)` - Update trailer
- `deleteTrailer(id)` - Delete trailer

### Real-Time Listeners
- `onTiresUpdate(callback)` - Listen for tire changes
- `onTrucksUpdate(callback)` - Listen for truck changes
- `onTrailersUpdate(callback)` - Listen for trailer changes

## 🔧 Migration from localStorage

The app has been migrated from localStorage to Firebase:

### Before (localStorage)
```javascript
// Save data
localStorage.setItem("tires", JSON.stringify(tires))

// Load data
const tires = JSON.parse(localStorage.getItem("tires") || "[]")
```

### After (Firebase)
```javascript
// Save data
await DatabaseService.addTire(tire)

// Load data
const tires = await DatabaseService.getTires()

// Real-time updates
DatabaseService.onTiresUpdate((updatedTires) => {
  tires = updatedTires
  renderTires()
})
```

## 🌐 Deployment

### Local Development
1. Serve files using a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```
2. Open `http://localhost:8000`

### Production Deployment
1. Host files on GitHub Pages, Netlify, Vercel, or any web server
2. Update Firebase security rules for production
3. Consider adding user authentication

## 🔒 Security Considerations

For production use:

1. **Authentication**: Add user login system
2. **Authorization**: Restrict data access based on user roles
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Prevent abuse
5. **Backup**: Set up regular data backups

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase is not loaded"**
   - Check internet connection
   - Verify Firebase SDK URLs are correct
   - Check browser console for errors

2. **"Permission denied"**
   - Check Firestore security rules
   - Verify Firebase configuration

3. **"Real-time updates not working"**
   - Check if onSnapshot listeners are properly set up
   - Verify database connection

4. **"Data not saving"**
   - Check Firebase configuration
   - Verify security rules allow write access
   - Check browser console for errors

### Debug Tips

1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Use Firebase Console to monitor database activity
4. Test with simple data first

## 📊 Alternative Database Options

If Firebase doesn't meet your needs:

### Supabase (PostgreSQL)
- Free tier available
- Real-time subscriptions
- SQL database with REST API

### MongoDB Atlas
- Free tier available
- Document-based database
- REST API available

### AWS DynamoDB
- Pay-per-use pricing
- Highly scalable
- Part of AWS ecosystem

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Firebase documentation
3. Check browser console for errors
4. Verify your Firebase configuration

For additional help, refer to `FIREBASE_SETUP.md` for detailed setup instructions. 