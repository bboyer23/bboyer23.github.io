# BBoyer23.github.io

This repository contains the static files for Benjamin Boyer's personal site.

## Configuration

The AI chatbot on the **Fun Zone** page is password protected.  The password is
loaded from `js/config.js`.  Edit that file before deploying to set your own
secret:

```javascript
window.APP_CONFIG = {
    CHATBOT_PASSWORD: "YourSecretPassword"
};
```

Make sure `config.js` is included on every page (it is already referenced by the
HTML files in this repo).  The scripts will read `window.APP_CONFIG.CHATBOT_PASSWORD`
when checking the password.

### Fun Zone Enhancements

The chatbot now keeps a chat history in your browser. Use the new **Clear** button
to wipe the conversation or refresh the page to continue where you left off.
