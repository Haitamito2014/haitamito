# NSM Messenger

An instant messenger where people create their own account, add friends by e-mail and chat live. It includes Wizz, winks, emoticons, display pictures, fonts and colours, photos, handwriting, group conversations and tic-tac-toe between two players.

| File | Role |
|---|---|
| `index.html` | The real app (accounts and live chat) |
| `app.js` | App logic, connected to Firebase |
| `style.css` | Styles shared by the app and the demo |
| `firebase-config.js` | **Your Firebase project settings go here** |
| `firestore.rules` | Security rules to paste into Firebase |
| `demo.html` | Offline demo with simulated contacts (no account needed) |

GitHub Pages only serves files, so accounts and messages are stored in **Firebase**, a free Google service. Until it's connected, `index.html` shows setup instructions instead of the app.

## Setup (about 10 minutes, free)

### 1. Create the Firebase project
1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Create a project**, name it (e.g. `nsm-messenger`), and finish the steps. Google Analytics isn't needed.

### 2. Turn on accounts
1. In the left menu: **Build › Authentication › Get started**.
2. In **Sign-in method**, choose **Email/Password**, switch on the first toggle, and click **Save**.
3. In **Settings › Authorized domains**, click **Add domain** and add `haitamito2014.github.io`.

### 3. Create the database
1. **Build › Firestore Database › Create database**.
2. Pick a location near your users (e.g. `europe-west`), then start in **production mode**.
3. Open the **Rules** tab, delete what's there, paste the whole content of `firestore.rules`, and click **Publish**.

### 4. Connect the website
1. Click the gear icon › **Project settings**. Under **Your apps**, click the web icon `</>`.
2. Name the app `nsm`. Don't tick Firebase Hosting. Click **Register app**.
3. Firebase shows a `firebaseConfig = { ... }` block. Copy those values into `firebase-config.js`, replacing `null`:

```js
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nsm-messenger.firebaseapp.com",
  projectId: "nsm-messenger",
  storageBucket: "nsm-messenger.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

These values aren't secret: every website using Firebase shows them. The security rules from step 3 protect the data.

### 5. Publish with GitHub Pages
1. Commit `firebase-config.js` and push.
2. On GitHub: **Settings › Pages › Build and deployment**, set **Source** to **Deploy from a branch**, then pick the branch and the `/ (root)` folder, and click **Save**.
3. After 1–2 minutes the app is at **https://haitamito2014.github.io/haitamito/nsm/**

## How it works
- **Accounts:** people sign up with a display name, e-mail and password (at least 6 characters). "Forgot your password?" sends a reset e-mail.
- **Contacts:** you add someone by their e-mail address. They get a "X added you to their contact list" notice and can add you back or ignore it.
- **Presence:** the app records each signed-in person's activity every minute. If nothing arrives for about 2½ minutes, that person shows as offline.
- **Privacy:** only you can see your contact list. Only the members of a conversation can read it. Profiles (name, e-mail, status, picture) are visible to any signed-in user, so people can find each other by e-mail.
- **Blocking:** a blocked person can't send you messages in a one-to-one conversation (the database refuses it). Blocking doesn't hide your profile from them.

## Limits
- **Photos only:** photos are shrunk and stored inside the message. Other file types would need Firebase Storage, which requires a paid plan.
- **No webcam or voice clips.**
- **Free plan limits:** Firestore's free tier allows 50,000 reads and 20,000 writes per day, which is plenty for a group of friends. A very busy service would need the paid plan.
- **No spam protection:** anyone can create an account, and nothing limits sign-ups or messages beyond Firebase's own protections. For a public launch, consider turning on Firebase App Check.

## Testing locally
With the [Firebase emulators](https://firebase.google.com/docs/emulator-suite) running (Auth on port 9099, Firestore on 8080), serve the repository folder and open `http://127.0.0.1:8000/nsm/?emulator`.
