# 📌 UVCE Noticeboard – Centralized Student Portal
A minimal and responsive **centralized noticeboard web app** for students and staff to manage academic notices, placement updates, and event schedules — all in one place.

## ✅ Problem Statement
> Students often lose track of assignment deadlines, event announcements, and placement updates due to scattered communication across emails, WhatsApp groups, and physical notice boards. 

## ✅ Proposed Solution

This project provides a centralized platform where:

* 👨‍🎓 **Students** can:

  * View categorized notices
  * Check placement updates
  * Track upcoming events via a calendar

* 👨‍🏫 **Admins/Staff** can:

  * Log in securely
  * Post/edit/delete announcements
  * Upload attachments (e.g., PDFs, images)
  * Send email notifications to users

---

## 🚀 Features

* 🔒 Admin authentication (session/JWT based)
* 📬 Email notifications using Nodemailer
* 📎 File uploads using Multer + Cloudinary/local storage
* 📅 Interactive event calendar using FullCalendar
* 📂 Notices categorized by **Academic**, **Cultural**, **Placement**
* 🖥️ Clean dashboard-style UI (Tailwind CSS)
* 🔍 Filter/sort notices by date and category
* ☁️ Deployed frontend + backend (optional)

---

## 🛠️ Tech Stack

### Frontend

* HTML, CSS, JavaScript
* [Tailwind CSS]
* [React.js]
* [FullCalendar] for events

### Backend

* Node.js + Express.js
* [Nodemailer] for email
* [Multer] for file uploads

### Database

* MongoDB (via [MongoDB Atlas] 

### Hosting (Free Tier Friendly)

* Frontend: Vercel / Netlify
* Backend: Render / Railway

---

## 📂 Folder Structure (Simplified)

```bash
.
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   └── index.html
├── README.md
└── .env
```

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/uvce-noticeboard.git
cd uvce-noticeboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Run the server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 💡 Future Improvements Possible

* Add student login with roles
* Push notifications (PWA)
* File versioning
* Mobile app integration

---

## 🤝 Contributing

Contributions, suggestions, and issues are welcome! 

---

