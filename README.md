# File Share Server

A simple yet powerful file sharing web application built with Node.js and Express. Upload files through a modern web interface and share them instantly with others.

![File Share Demo](https://img.shields.io/badge/status-active-brightgreen.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)


<img width="1214" height="619" alt="image" src="https://github.com/user-attachments/assets/a11c374d-cf31-4a96-819b-ee540e0ade83" />


## 🚀 Features

- **Drag & Drop File Upload**: Modern, intuitive file upload interface
- **Instant File Sharing**: Upload and share files immediately
- **File Management**: View and download all uploaded files
- **Database Logging**: Optional MySQL/MariaDB integration for upload tracking
- **CORS Enabled**: Cross-origin requests supported
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: File list refreshes automatically after uploads

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL/MariaDB (optional)
- **File Handling**: Multer middleware
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local filesystem

## 📦 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- MySQL/MariaDB (optional, for database logging)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ZayanMuhammed/fileshare.git
   cd fileshare
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create uploads directory**:
   ```bash
   mkdir uploads
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000/fileshare.htm
   ```

## 🗄️ Database Setup (Optional)

If you want to enable database logging of file uploads:

### Install MariaDB/MySQL

**For Debian/Ubuntu**:
```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
```

**For Arch Linux**:
```bash
sudo pacman -Syu
sudo pacman -S mariadb
```

### Start and Configure Database

1. **Start MariaDB service**:
   ```bash
   sudo systemctl start mariadb
   sudo systemctl enable mariadb
   ```

2. **Secure installation**:
   ```bash
   sudo mysql_secure_installation
   ```

3. **Create database and table**:
   ```bash
   mariadb -u root -p
   ```

   ```sql
   CREATE DATABASE fileshare;
   USE fileshare;
   
   CREATE TABLE files (
       id INT AUTO_INCREMENT PRIMARY KEY,
       filePath VARCHAR(255) NOT NULL,
       originalname VARCHAR(255) NOT NULL,
       mimetype VARCHAR(100) NOT NULL,
       size BIGINT NOT NULL,
       uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Create a user for the application
   CREATE USER 'fileshare_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON fileshare.* TO 'fileshare_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Update database configuration** in `uploadedFile.js`:
   ```javascript
   const db = mysql.createPool({
       host: 'localhost',
       user: 'fileshare_user',     // your mariadb user
       password: 'your_password',   // your mariadb password
       database: 'fileshare',       // your mariadb database
       acquireTimeout: 60000,
       timeout: 60000,
       reconnect: true
   });
   ```

## 🚀 Usage

If you want a login splash that can also start the server, use the login module described below.

### Uploading Files

1. Open the web interface at `http://localhost:3000/fileshare.htm`
2. Click on the upload area or drag and drop files
3. Select your file(s)
4. Click the "Upload" button
5. Files will be uploaded to the `uploads/` directory

### Downloading Files

- All uploaded files are automatically listed on the main page
- Click on any filename to download the file
- Files are served statically from the `/uploads` endpoint

### API Endpoints

The server provides the following REST API endpoints:

#### Upload File
```http
POST /upload
Content-Type: multipart/form-data

Form field: uploadedFile (file)
```

#### List Files
```http
GET /files
```

Response:
```json
["file1.txt", "file2.jpg", "document.pdf"]
```

#### Download File
```http
GET /uploads/{filename}
```

## 📁 Project Structure

```
fileshare/
├── uploadedFile.js          # Main server file
├── fileshare.htm           # Main web interface
├── fileshare.css           # Styles for the interface
├── sql-data.js             # Frontend JavaScript
├── install-mariadb.sh      # Database installation script
├── package.json            # Node.js dependencies
├── uploads/                # Directory for uploaded files
├── assets/                 # Static assets (favicon, etc.)
├── login/                  # Login gateway (separate express server)
│   ├── startweb.js         # Serves login UI and exposes /run-script
│   ├── login.htm           # Login page
│   ├── login.css           # Login styles
│   ├── login.js            # Login client logic
│   ├── your_script.sh      # Starts main server (edit path inside)
│   └── README.md           # This module's docs
└── README.md              # Root documentation
```

## 🔐 Login Module

<img width="706" height="380" alt="image" src="https://github.com/user-attachments/assets/57f63cfd-cd13-462f-b40b-8b8fbace9d4e" />



A minimal login gateway is available under login/ and runs on port 8080 by default.

- Install and run:
  ```bash
  cd login
  npm install
  node startweb.js
  ```
- Open http://localhost:8080/login.htm
- Default demo credentials: admin / Password123 (change in login/login.js)
- On success it calls GET /run-script, which executes login/your_script.sh
- your_script.sh should cd to your project root and start node uploadedFile.js

Important: /run-script executes a shell script. Keep it for local/dev. For production, use a proper auth flow and a process manager (pm2/systemd) instead of executing shell from HTTP.

## ⚙️ Configuration

### Server Configuration

Edit `uploadedFile.js` to modify:

- **Port**: Change `const port = 3000;` to your preferred port
- **Upload Directory**: Modify the `destination` in multer configuration
- **File Size Limits**: Add size limits to multer configuration
- **CORS Settings**: Modify CORS headers as needed

### Frontend Customization

- **Styling**: Edit `fileshare.css` for visual customization
- **Behavior**: Modify `sql-data.js` for frontend functionality
- **Interface**: Update `fileshare.htm` for layout changes

## 🔧 Advanced Configuration

### Adding File Size Limits

```javascript
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});
```

### Adding File Type Restrictions

```javascript
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});
```

### Environment Variables

Create a `.env` file for configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=fileshare_user
DB_PASSWORD=your_password
DB_NAME=fileshare
UPLOAD_DIR=uploads
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## 👤 Author

**Zayan Muhammed**

- GitHub: [@ZayanMuhammed](https://github.com/ZayanMuhammed)
- Email: zayan.shameermv@gmail.com

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- Multer developers for file upload handling
- The Node.js community for continuous support

## 📊 Project Status

This project is actively maintained. Feel free to report issues or suggest improvements!

---

### 🚨 Security Note

This application is intended for development and testing purposes and local use. For production use, please consider:

- Adding authentication and authorization
- Implementing file type validation
- Adding virus scanning for uploads
- Setting up proper HTTPS
- Configuring proper file storage and backup
- Adding rate limiting and other security measures
