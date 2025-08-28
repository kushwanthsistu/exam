# Quick Test – Student Test Platform

**Quick Test** is a simple and efficient platform designed for **students** and **teaching organizations** to conduct, manage, and analyze tests seamlessly.

---

## 🚀 Features

### 👨‍🏫 For Teachers
- Create and manage tests
- Make tests visible to students
- View scores and performance analytics

### 👩‍🎓 For Students
- Take tests online
- View scores instantly
- Access detailed test analysis

---

## 🛠️ Tech Stack

**Frontend:** HTML, Bootstrap, JavaScript  
**Backend:** Node.js, Express.js, Mongoose, JavaScript  
**Database:** MongoDB  
**Hosting:**  
- Backend → [Vercel](https://vercel.com)  
- Frontend → [Netlify](https://netlify.com)

---

## ⚡ Setup & Installation (Localhost)

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   ```

2. **Update configuration**
   - In `./frontend/config.js` and `./backend/.env`, replace:  
     ```
     https://quick-test-platform.vercel.app → http://localhost:3000
     https://quick-test-platform.netlify.app → http://localhost:4000
     ```

3. **Run the backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Run the frontend**
   ```bash
   cd frontend
   npm install
   nodemon index.js
   ```

5. **Access the application**
   ```
   http://localhost:4000
   ```

---

## 👥 Contributors
- **Kushwanth** → Backend Developer  
- **Syam** → Frontend Developer

---

## 📌 Future Improvements
- Add user authentication & role-based access
- Enhance analytics with graphical insights
- Enable exporting results as PDF/Excel

---

## 📄 License
This project is for educational purposes. You are free to fork and modify it.
