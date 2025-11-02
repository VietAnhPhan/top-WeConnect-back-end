# 🧩 **WeConnect Backend**

![WeConnect Banner](https://gsxytqtnlgirrrxhwjvr.supabase.co/storage/v1/object/public/media_materials/WeConnect_banner.png)  
*A powerful backend service for the WeConnect social platform — enabling authentication, posts, follows, likes, and comments.*

---

### 🏷️ **Badges**

![Node.js](https://img.shields.io/badge/Runtime-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Passport.js](https://img.shields.io/badge/Auth-Passport.js-334155?logo=passport)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## ⚙️ **Overview**

The **WeConnect Backend** powers all RESTful API endpoints for the **WeConnect frontend**.  
It handles authentication, user management, post creation, comments, likes, and following relationships.

---

## ✨ **Key Features**

* 🔐 **Authentication** – Supports **GitHub** and **Google OAuth** via **Passport.js**.  
* 🧑‍💼 **User Management** – Create, update, and retrieve user profiles.  
* 📝 **Posts API** – Create, edit, delete, and fetch posts.  
* 💬 **Comments API** – Add and retrieve comments on posts.  
* ❤️ **Likes API** – Like or unlike posts.  
* 🤝 **Follow System** – Send, accept, or reject follow requests.  
* 🧭 **Feed API** – Retrieve posts from users you follow.  
* 🗄️ **Database Integration** – Managed using **Prisma ORM** with **PostgreSQL**.  
* 🔒 **JWT Tokens** – For secure API access after login.

---

## 💻 **Tech Stack**

The backend uses a **scalable, modular architecture** for maintainability and performance.

| Layer | Technology |
|-------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | Passport.js (GitHub + Google) |
| **Token Management** | JWT |
| **Environment Management** | dotenv |

---

## 🚀 **Getting Started**

Follow these instructions to set up and run the backend server locally.

### **Prerequisites**

You must have installed:
* **Node.js**
* **npm** or **yarn**
* **PostgreSQL**

---

### **Installation**

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/VietAnhPhan/weconnect-back-end.git
