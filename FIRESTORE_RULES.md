# Firestore Security Rules for Enkushot

Please update your Firestore security rules in Firebase Console to allow notifications to work:

## Go to Firebase Console → Firestore Database → Rules

Replace your current rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Images collection - public read, authenticated write
    match /images/{imageId} {
      allow read: if true;  // Anyone can view images
      allow write: if request.auth != null;  // Only authenticated users can upload
      allow delete: if request.auth != null && request.auth.token.email == resource.data.userEmail;
    }
    
    // Likes collection - authenticated users only
    match /likes/{likeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.resource.data.likedBy == request.auth.token.email;
      allow delete: if request.auth != null 
        && resource.data.likedBy == request.auth.token.email;
    }
    
    // Notifications collection - users can read their own and create for others
    match /notifications/{notificationId} {
      allow read: if request.auth != null 
        && request.auth.token.email == resource.data.imageOwnerEmail;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.token.email == resource.data.imageOwnerEmail;
    }
    
    // Favorites collection (legacy - can be removed if not used)
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Important Notes:

1. **Notifications must be allowed to be created** - The rule `allow create: if request.auth != null;` allows any authenticated user to create notifications

2. **Users can only read their own notifications** - The rule checks if `imageOwnerEmail` matches the authenticated user's email

3. **Indexes might be needed** - If you see index errors in console, Firebase will provide a link to create them automatically

## Testing:

After updating the rules:

1. Open browser console (F12)
2. Like someone else's picture (not your own)
3. Check console logs for:
   - `[useLikes] Creating notification for: [email]`
   - `[useLikes] Notification created successfully`
4. The other user should see a notification badge on their profile picture
5. Check for any error messages in console

## Common Issues:

- **Permission denied**: Rules are too restrictive
- **Index required**: Click the link in error to create index
- **Not receiving notifications**: Make sure you're liking someone else's picture, not your own
- **userEmail is null**: Images need to have userEmail field set when uploaded
