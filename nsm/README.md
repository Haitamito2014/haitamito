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
4. Two-factor login needs **Firebase Authentication with Identity Platform**. In **Authentication › Settings**, look for the **Upgrade** offer and accept it. *(I couldn't check the current Firebase pages from my environment: if the console asks you to switch to the Blaze plan with a payment card, that's Google's requirement. Authenticator codes themselves don't send SMS.)*

### 2b. Turn on authenticator codes
The console may not have a switch for this. If it doesn't, use a command:
1. Open <https://console.cloud.google.com>, select your Firebase project, and click the **Cloud Shell** icon `>_` at the top right.
2. Paste this command, replacing `nsm-messenger` (twice) with your project ID, and press Enter:

```bash
curl -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/nsm-messenger/config?updateMask=mfa" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "X-Goog-User-Project: nsm-messenger" \
  -H "Content-Type: application/json" \
  -d '{"mfa":{"providerConfigs":[{"state":"ENABLED","totpProviderConfig":{"adjacentIntervals":5}}]}}'
```

3. The answer should contain `"totpProviderConfig"`. If it shows an error mentioning Identity Platform, step 2.4 isn't done yet.

`adjacentIntervals: 5` also accepts codes from slightly before or after the current one (up to 2½ minutes), in case a phone's clock is a little off.

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
- **E-mail confirmation:** right after signing up, Firebase sends a confirmation link. NSM waits until it's opened (it checks every 5 seconds, so the page moves on by itself).
- **Two-factor login (required):** next, everyone sets up an authenticator app (Google Authenticator, Microsoft Authenticator…) by scanning a QR code. From then on, signing in asks for the password **and** the 6-digit code from the app. NSM keeps people signed in on their device, so in practice the code is asked on each new device, or after signing out.
- **Enforced by the database:** the security rules refuse anyone whose e-mail isn't confirmed or whose session wasn't opened with the authenticator code. Changing the page's code doesn't get around it.
- **Contacts:** you add someone by their e-mail address. They get a "X added you to their contact list" notice and can add you back or ignore it.
- **Presence:** the app records each signed-in person's activity every minute. If nothing arrives for about 2½ minutes, that person shows as offline.
- **Privacy:** only you can see your contact list. Only the members of a conversation can read it. Profiles (name, e-mail, status, picture) are visible to any signed-in user, so people can find each other by e-mail.
- **Blocking:** a blocked person can't send you messages in a one-to-one conversation (the database refuses it). Blocking doesn't hide your profile from them.

## Lost phone
People can set their codes up again on a new phone with the key shown during setup, which is why NSM tells them to keep it. Without that key, they can't sign in. The site owner can then delete their account in **Authentication › Users**, and they sign up again. Their contacts and conversations aren't recovered.

## Limits
- **Photos only:** photos are shrunk and stored inside the message. Other file types would need Firebase Storage, which requires a paid plan.
- **No webcam or voice clips.**
- **Free plan limits:** Firestore's free tier allows 50,000 reads and 20,000 writes per day, which is plenty for a group of friends. A very busy service would need the paid plan.
- **No spam protection:** anyone can create an account, and nothing limits sign-ups or messages beyond Firebase's own protections. For a public launch, consider turning on Firebase App Check.

## Testing locally
With the [Firebase emulators](https://firebase.google.com/docs/emulator-suite) running (Auth on port 9099, Firestore on 8080), serve the repository folder and open `http://127.0.0.1:8000/nsm/?emulator`. The emulator can't produce authenticator codes: add `&skip2fa` to skip that step locally, and use rules without the `sign_in_second_factor` line. These switches only work with the emulator, never on the real site.
