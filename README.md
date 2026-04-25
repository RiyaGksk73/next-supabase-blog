# 📝 Next.js + Supabase Blogging Platform

A full-stack blogging platform built using **Next.js** and **Supabase**, featuring role-based access control and AI-powered content summarization.

---

## 🚀 Features

### 🔐 Authentication
- Secure login/signup using Supabase Auth
- Session-based authentication

### 🛡️ Role-Based Access
- **Viewer** → Can read posts and comment  
- **Author** → Can create and edit their own posts  
- **Admin** → Can view and edit all posts  

---

### 📝 Blog System
- Create, edit, and view blog posts
- Each post includes:
  - Title  
  - Featured Image  
  - Body Content  
  - Comments Section  

---

### 🤖 AI Integration
- Automatically generates a ~200-word summary using **Google Gemini API** when a post is created
- Summary is:
  - Stored in database  
  - Displayed on post listing page  

---

### ⚡ Cost Optimization
- Summary is generated **only once** during post creation  
- Stored in database to avoid repeated API calls  
- Includes a fallback mechanism if API fails  

---

### 💬 Comments
- Users can comment on posts  
- Comments are linked to users and posts  

---

### 🎨 UI/UX
- Clean and modern interface  
- Fully responsive design  
- 🌙 Dark Mode support  

---

## 🛠️ Tech Stack

- **Frontend + Backend:** Next.js (App Router)  
- **Database & Auth:** Supabase  
- **AI Integration:** Google Gemini API  
- **Styling:** Tailwind CSS  
- **Deployment:** Vercel  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/RiyaGksk73/next-supabase-blog.git
cd next-supabase-blog
