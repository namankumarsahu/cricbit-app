# 🏏 CricBit – Real-Time Cricket Scorecard App

A full-stack real-time cricket scoring platform built using the MERN stack.  
Designed to deliver live match updates with sub-second latency and handle concurrent users efficiently.

---

## 🚀 Features

- ⚡ Real-time score updates (<1 sec latency) using WebSockets (Socket.IO)
- 🔐 Secure authentication with JWT & bcrypt
- 👥 Role-based access (Admin/User)
- 📊 Live, Recent, and Upcoming match filters
- 🛠️ Admin panel to create and manage matches dynamically
- 📱 Responsive UI built with React + Tailwind CSS

---

## 🧠 System Design Highlights

- Designed a **real-time data flow system** to push match updates instantly to all connected clients
- Managed **state consistency across multiple users** during live matches
- Built scalable backend APIs using **Node.js & Express**
- Optimized performance to support **1000+ concurrent users**
- Used WebSockets to reduce latency compared to traditional polling

---

## 🏗️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Query

**Backend**
- Node.js
- Express.js
- Socket.IO (WebSockets)

**Database**
- MongoDB

**Authentication**
- JWT (JSON Web Tokens)
- bcrypt

---

## 📂 Project Structure
