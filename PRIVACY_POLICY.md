# Privacy Policy for LeetCode Buddy

**Last Updated:** January 19, 2026

## Introduction

LeetCode Buddy ("we", "our", or "the extension") is a Chrome extension that allows users to compare LeetCode profiles side-by-side. This privacy policy explains how we collect, use, and protect your information.

## Information We Collect

### 1. Authentication Information
- **Google Account Data**: When you choose to sign in with Google, we collect:
  - Your email address
  - Your name
  - Your Google profile picture
- **JWT Tokens**: We store authentication tokens to maintain your login session

### 2. LeetCode Profile Data
- **Public LeetCode Statistics**: We fetch publicly available information from LeetCode profiles you choose to compare, including:
  - Username
  - Total problems solved
  - Difficulty breakdown (Easy/Medium/Hard)
  - Ranking information
  - Acceptance rates

### 3. Usage Data
- **Comparison History**: Usernames you've compared (stored locally in your browser)
- **Search History**: Profile searches you've performed

### 4. Local Storage
- Authentication tokens
- User preferences
- Cached profile data

## How We Use Your Information

We use the collected information to:
- Authenticate your identity via Google OAuth 2.0
- Fetch and display LeetCode profile statistics
- Compare multiple LeetCode profiles side-by-side
- Maintain your session across browsing sessions
- Improve the extension's functionality and user experience

## Data Storage and Security

### Local Storage
- Authentication tokens are stored securely in Chrome's local storage
- Profile comparison history is stored locally on your device
- No sensitive data is transmitted without encryption

### Backend Storage
- We use JWT (JSON Web Tokens) for secure authentication
- User sessions are managed through secure, HTTP-only cookies
- All API communications use HTTPS encryption

## Third-Party Services

### Google OAuth 2.0
- We use Google's authentication service for secure login
- Google's privacy policy applies: https://policies.google.com/privacy
- We only request necessary permissions (email, profile)

### LeetCode
- We fetch publicly available data from LeetCode profiles
- No private LeetCode data is accessed
- We do not store your LeetCode credentials

### Hosting
- Backend API is hosted on Vercel
- Vercel's privacy policy applies: https://vercel.com/legal/privacy-policy

## Permissions Explained

The extension requires the following Chrome permissions:

- **storage**: To save your authentication token and preferences locally
- **sidePanel**: To display the comparison interface in Chrome's side panel
- **tabs**: To interact with the current tab when needed
- **scripting**: To inject content scripts for enhanced functionality
- **host_permissions** (`*.google.com/*`): For Google OAuth authentication
- **host_permissions** (`localhost/*`): For local development (removed in production builds)

## Data Sharing

We do NOT:
- Sell your personal information to third parties
- Share your data with advertisers
- Use your data for marketing purposes
- Track your browsing activity outside the extension

We may share data only in these circumstances:
- With your explicit consent
- To comply with legal obligations
- To protect our rights and prevent fraud

## Your Rights

You have the right to:
- **Access**: View what data we have about you
- **Delete**: Request deletion of your account and associated data
- **Opt-out**: Use the extension without authentication (guest mode)
- **Export**: Request a copy of your data

To exercise these rights, contact us at the email provided below.

## Guest Mode

You can use LeetCode Buddy without signing in:
- Click "Skip" on the login page
- All functionality works without authentication
- Data is stored only locally on your device
- No data is sent to our servers (except public LeetCode profile fetches)

## Data Retention

- **Authentication Data**: Retained until you log out or delete the extension
- **Local Storage**: Cleared when you uninstall the extension or clear browser data
- **Session Tokens**: Expire after inactivity or manual logout

## Children's Privacy

LeetCode Buddy is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If you believe we have collected data from a child, please contact us immediately.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Open Source

LeetCode Buddy is open source. You can review our code at:
- GitHub Repository: [Your Repository URL]

## Contact Us

If you have questions or concerns about this privacy policy or our data practices, please contact us at:

- **Email**: [Your Contact Email]
- **GitHub Issues**: [Your Repository Issues URL]

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

## User Consent

By installing and using LeetCode Buddy, you consent to the collection and use of information as described in this privacy policy.
