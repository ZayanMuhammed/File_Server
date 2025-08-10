# Login Module

This directory contains a minimal login gateway and a helper endpoint to start your main file-sharing server via a shell script.

Components:
- login.htm: Login UI (HTML)
- login.css: Styles for the login UI
- login.js: Frontend logic (submits credentials, triggers backend)
- startweb.js: Express server that serves this UI and exposes /run-script
- your_script.sh: Shell script executed by /run-script to launch the main server

Important security note:
- The sample credentials in login.js are hard-coded (admin / Password123) for demo purposes only. Change them immediately before any real use.
- /run-script executes a shell script on the host. Treat this only as a development example. Do not expose publicly without proper authentication and hardening.

Requirements
- Node.js 14+
- bash (for your_script.sh)

Install dependencies
```bash
cd login
npm install
```

Configure your_script.sh
- Edit the path used to cd into your project (line with cd /path/to/the/fileshare/). Set it to the absolute path of your project root that contains uploadedFile.js.

Example:
```bash
cd /home/zayan/Documents/fileshare/
```

Start the login server
```bash
node startweb.js
```

Open the login page
```text
http://localhost:8080/login.htm
```

Default credentials (change these!)
- Username: admin
- Password: Password123

What happens on login
- On successful credentials, the frontend calls:
  ```http
  GET /run-script
  ```
- The backend (startweb.js) runs your_script.sh with a 5-second timeout and responds with the script output.
- The frontend then redirects to your main app (default http://localhost:3000/data.htm).

Adjusting the redirect
- To change the redirect URL after login, edit login/login.js:
```javascript
window.location.replace("http://localhost:3000/data.htm");
```

Running the main server manually (alternative)
If you prefer to start the main server yourself rather than via your_script.sh:
```bash
# From project root
mkdir -p uploads
npm install
npm start
# Then just use the login UI for UX flow without triggering /run-script
```

Hardening tips
- Replace hard-coded credentials with a real authentication flow (sessions/JWT, hashed passwords, rate limiting).
- Restrict /run-script to authenticated users only and validate inputs.
- Consider removing the script execution step in production; manage processes with a proper process manager (pm2/systemd).
- Serve over HTTPS in production.

