# 🌱 KisanKart — Next-Gen Direct Farmer-to-Consumer Agri Marketplace

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://kisan-kart-rosy.vercel.app)
**Live Demo:** [https://kisan-kart-rosy.vercel.app](https://kisan-kart-rosy.vercel.app)

> **Eliminating intermediaries in the agricultural supply chain.**  
> Connect verified local Indian growers directly with urban households for fresh organic produce, orchard fruits, raw A2 dairy, and heritage grains.

---

## ⚡ Quick Start Options

### Option 1: 1-Click Launch (Recommended)
- **Windows:** Double-click [`start.bat`](file:///e:/Farmer-to-Consumer%20Agri%20Marketplace/start.bat)
- **macOS / Linux:** Run `chmod +x start.sh && ./start.sh`

*(The script automatically installs dependencies, configures environment settings, spins up the database, and launches your browser at `http://localhost:3000`.)*

---

### Option 2: Standard Terminal Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kisankart.git
   cd kisankart
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**  
   👉 [http://localhost:3000](http://localhost:3000)

> [!TIP]
> **No database installation needed!** KisanKart includes an embedded in-memory MongoDB fallback. The database automatically seeds itself on the first run with all 20 products, verified farmer profiles, and demo orders.

---

## 📱 How to Open on Other Devices (Phone, Tablet, Laptop on Same Wi-Fi)

To view the app on your mobile phone or another device connected to your home/office Wi-Fi:

1. **Find your computer's local IP address:**
   - **Windows:** Open Command Prompt and type `ipconfig` (Look for `IPv4 Address`, e.g., `192.168.1.7`).
   - **macOS / Linux:** Open Terminal and type `ifconfig` or `ip a`.

2. **Open browser on your phone/tablet:**
   - Type `http://<YOUR-COMPUTER-IP>:3000` (e.g., `http://192.168.1.7:3000`).
   - The marketplace will open immediately with full responsive design and touch support!

---

## ☁️ Deploy to Cloud for Free (Instant Public Link for Anyone)

If you want anyone in the world to open your site directly via a link (without downloading or running code):

### 1-Click Deploy on Vercel (Free)
1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of KisanKart"
   git remote add origin https://github.com/YOUR_USERNAME/kisankart.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `kisankart` repository.
4. Set the environment variable:
   - `JWT_SECRET`: `kisankart_super_secure_jwt_secret_key_2026`
   - *(Optional)* `MONGODB_URI`: Connect a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI (or use the built-in storage).
5. Click **Deploy**. In under 60 seconds, Vercel provides a live URL (e.g., `https://kisankart.vercel.app`) that anyone can open from any device anywhere!

---

## 👥 Demo Personas & Testing Accounts

Use the **"Switch Persona"** button in the top navigation bar or log in with any of these pre-configured accounts:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Consumer** | `consumer@kisankart.com` | `password123` | Browse 20 items, add to cart, choose delivery slots, place orders. |
| **Farmer (Verified)** | `farmer@kisankart.com` | `password123` | Farmer Fulfillment Desk, view live customer orders, update order dispatch status. |
| **Farmer (Organic Dairy)** | `sunita@kisankart.com` | `password123` | Manage A2 Gir Cow Milk & Vedic Ghee listings. |
| **Platform Admin** | `admin@kisankart.com` | `password123` | Admin Governance Portal, verify farmer land certificates, manage platform metrics. |

---

## 🛠️ Technology Stack
- **Framework:** Next.js 15 (App Router, Server Components & Client Actions)
- **Styling:** Tailwind CSS with custom glassmorphic components, fluid animations, and Google Fonts (`Plus Jakarta Sans` & `Outfit`)
- **Database:** MongoDB & Mongoose (with embedded `mongodb-memory-server` fallback)
- **Authentication:** JWT with HTTP-only cookies & role-based route middleware
- **Icons:** Lucide React
