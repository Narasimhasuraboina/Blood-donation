 # 🩸 Blood Donation Management System

A full-stack **Blood Donation Management System** that connects blood donors and requesters.  
This application allows donors to register, users to create blood requests, and tracks donation history securely.

This project is developed as an **academic / final-year full-stack project** using modern web technologies.

---

## ✨ Features
- Donor registration and login
- Secure authentication using JWT
- Create and view blood requests
- View donors based on blood group
- Track donation history
- Clean separation of frontend and backend

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MySQL

---

## 📁 Project Structure
Blood-donation/
├── backend/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
└── README.md

## 🚀 How to Run This Project Locally

### 📌 Prerequisites
Make sure you have installed:
- **Node.js** (v16 or above)
- **npm**
- **MySQL Server**
- **Git**

Check versions:
```bash
node -v
npm -v
mysql --version
⚙️ Backend Setup (Node + Express)
1️⃣ Go to backend folder
cd backend

2️⃣ Install dependencies
npm install
3️⃣ Create .env file

Create a file named .env inside backend/ and add:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blood
JWT_SECRET=your_secret_key
PORT=4000
4️⃣ Database Setup

Open MySQL Workbench and run:

CREATE DATABASE blood;


Create required tables (donors, requests, donations) using the project SQL scripts.
5️⃣ Start Backend Server
npm run dev


or

node server.js


Backend will run at:

http://localhost:4000
Frontend Setup (React)
1️⃣ Open a new terminal and go to frontend folder
cd frontend

2️⃣ Install dependencies
npm install 
3️⃣ Start the React application
npm start


Frontend will run at:

http://localhost:3000
 