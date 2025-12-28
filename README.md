# Imria App – ReactJS

## Objective
- 
features like:

# Tech Stack & Dependencies
- Node : 20.17.0
- React: 19.1.0
- Stripe for payments
- Video Calling - 
- Chat - Socket.io
- AWS S3 SDK for media storage

# How to Start Project locally
- git clone Repo URL
- cd imria-web/api
- npm install
- npm start
- npm run build

# How to Start Project Staging
- npm run start:staging
- npm run build:staging

# Credentials (Local/Staging)
  # Local: 
  - Provider: http://localhost:3000/
  - Admin: http://localhost:3000/admin-login

# Project Structure
Web/
├── build/                   # build output (auto-generated)
├── node_modules/            # Node dependencies
├── public/                  # Static assets (index.html, favicon, etc.)
├── src/                     # Main source code directory
│   ├── Features/            # Core feature modules (components, pages)
│   ├── Interceptors/        # Axios or API request interceptors
│   ├── Redux/               # Redux slices, store setup
│   ├── Utils/               # Reusable utility functions
│   ├── App.css              # App-specific CSS
│   ├── App.js               # Main App component
│   ├── App.test.js          # Unit test for App
│   ├── index.css            # Global styles
│   ├── index.js             # App entry point
│   ├── logo.svg             # Default React logo
│   ├── reportWebVitals.js   # Performance tracking (optional)
│   └── setupTests.js        # Test setup file (Jest)
├── .env                     # Environment variables
├── .eslintignore            # ESLint ignore rules
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore rules
├── package.json             # Project metadata and scripts
├── package-lock.json        # Dependency lock file
└── README.md                # Project overview and documentation



https://quilljs.com/docs/installation