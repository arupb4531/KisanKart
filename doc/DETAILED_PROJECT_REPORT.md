# KisanKart (Farmer-to-Consumer Agri Marketplace)
## Comprehensive Technical Brief & Project Specification Report

---

## 1. Project Background & Problem Context

### 1.1 The Core Problem
In traditional agricultural supply chains, fresh produce passes through multiple intermediaries—local village aggregators, commission agents, regional APMC mandis, secondary wholesalers, and neighbourhood retailers. This structure results in:
- **Low Farmer Realization:** Farmers typically receive only **20% to 35%** of the final consumer retail price.
- **Produce Degradation & Food Wastage:** A 4- to 7-day transport and warehouse holding lag causes high perishability loss (up to 30% post-harvest loss).
- **Opaque Sourcing:** Urban consumers have zero visibility into chemical pesticide usage, harvest dates, or farm origins.
- **Price Inconsistency:** Consumers pay inflated prices due to compounding multi-tier trader markups.

### 1.2 The KisanKart Solution
**KisanKart** establishes a direct digital bridge between verified local agricultural producers and urban consumers:
- **Fair Pricing:** 100% of the listed price is paid directly to the grower.
- **Dawn-to-Doorstep Freshness:** Produce harvested at dawn is dispatched in designated morning slots within 18 hours.
- **Complete Traceability:** Every item displays days/hours since harvest, farm GPS coordinates, farming method (Organic vs Natural), and grower ratings.
- **Governed Quality:** Strict administrative verification for farmer landholdings and certifications before listing privileges are granted.

---

## 2. System Architecture & Tech Stack

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|       Next.js 15 (App Router) + React 19 + Tailwind CSS + Lucide        |
|  - Consumer Marketplace  - Farmer Inventory Desk  - Admin Control Desk  |
+-------------------------------------------------------------------------+
                                    |
                           HTTP / JSON (REST APIs)
                                    |
+-------------------------------------------------------------------------+
|                              SERVER LAYER                               |
|        Next.js Route Handlers + TypeScript API Controllers              |
|  - JWT Authentication Middleware    - Atomic Stock & Checkout Engine    |
|  - Multi-Farmer Split Engine        - Role-Based Access Control (RBAC)  |
+-------------------------------------------------------------------------+
                                    |
                              Mongoose ODM
                                    |
+-------------------------------------------------------------------------+
|                             DATABASE LAYER                              |
|           MongoDB (with embedded Memory Server fallback)                |
|  - Users  - FarmerProfiles  - Products  - Orders  - Reviews             |
+-------------------------------------------------------------------------+
```

### 2.1 Technology Matrix
- **Frontend & Fullstack Framework:** Next.js 15.2.1 with React 19 and TypeScript 5.8.
- **Styling Architecture:** Tailwind CSS 3.4 with custom palettes (Forest Emerald, Harvest Amber, Earth Tones).
- **Database & ODM:** MongoDB with Mongoose 8.13 ODM (integrated auto-fallback to `mongodb-memory-server` for zero-config portability).
- **Authentication & Security:** JWT (JSON Web Tokens) with HttpOnly cookies, Authorization Bearer headers, and bcrypt password hashing.
- **Icons & Visuals:** Lucide React with responsive glassmorphic cards and dynamic freshness badges.

---

## 3. Complete Database Entity Relationship (ER) Schemas

### A. User Entity (`users`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `name` | String | Full name (Required) |
| `email` | String | Unique, lowercased email address (Required) |
| `passwordHash`| String | bcrypt hashed password |
| `phone` | String | Contact phone number (Required) |
| `role` | Enum | `'farmer'`, `'consumer'`, or `'admin'` (Default: `'consumer'`) |
| `isVerified` | Boolean | `false` for new farmers until admin approval; `true` for consumers |
| `address` | Object | `{ street, city, state, pincode, coordinates: { lat, lng } }` |
| `avatar` | String | Profile photo URL |
| `createdAt` / `updatedAt` | Timestamps | Auto-generated timestamp records |

---

### B. Farmer Profile Entity (`farmer_profiles`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Foreign Key $\rightarrow$ `users._id` (Unique, 1-to-1) |
| `farmName` | String | Registered farm/estate name |
| `farmLocation` | Object | `{ address, city, state, pincode, coordinates: [lng, lat] }` |
| `farmingMethod`| Enum | `'organic'`, `'natural'`, or `'conventional'` |
| `bio` | String | Farm background, crop cultivation history |
| `primaryCrops` | Array[String]| List of primary produce cultivated |
| `experienceYears` | Number | Total years in farming |
| `verificationDocs`| Array[String]| URLs of submitted certificates / land records |
| `certificates` | Array[String]| Validated accreditation tags (NPOP, Jaivik Bharat, FSSAI) |
| `averageRating` | Number | Aggregated rating (1.0 to 5.0, Default: 5.0) |
| `totalRatings` | Number | Count of submitted reviews |

---

### C. Product Entity (`products`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `farmerId` | ObjectId | Foreign Key $\rightarrow$ `users._id` (Producer) |
| `name` | String | Harvest produce name |
| `category` | Enum | `'vegetables'`, `'fruits'`, `'dairy'`, `'grains'`, `'pulses'`, `'other'` |
| `description` | String | Produce characteristics and harvesting notes |
| `pricePerUnit` | Number | Direct price in INR (₹) |
| `unit` | Enum | `'kg'`, `'g'`, `'litre'`, `'dozen'`, `'piece'`, `'bundle'` |
| `stockQuantity`| Number | Real-time available inventory |
| `harvestDate` | Date | Exact date and time when produce was harvested |
| `isOrganic` | Boolean | True if chemical-free / NPOP certified |
| `images` | Array[String]| Produce photograph gallery URLs |
| `isAvailable` | Boolean | Automatically false when `stockQuantity === 0` |

---

### D. Order Entity (`orders`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `orderNumber` | String | Unique auto-generated identifier (e.g. `KM-88401-1`) |
| `consumerId` | ObjectId | Foreign Key $\rightarrow$ `users._id` (Buyer) |
| `farmerId` | ObjectId | Foreign Key $\rightarrow$ `users._id` (Direct Producer) |
| `items` | Array[SubDoc]| `[{ productId, name, unitPrice, quantity, unit, subtotal, image }]` |
| `totalAmount` | Number | Calculated order amount in INR (₹) |
| `deliverySlot`| Object | `{ date: Date, timeSlot: String }` (e.g. `07:00 AM - 10:00 AM`) |
| `shippingAddress` | Object | Full destination delivery address snapshot |
| `status` | Enum | `'pending'`, `'confirmed'`, `'dispatched'`, `'delivered'`, `'cancelled'` |
| `paymentMethod` | Enum | `'cod'` (Cash on Delivery) or `'online'` (Instant UPI/Card) |
| `paymentStatus` | Enum | `'pending'`, `'paid'`, or `'failed'` |

---

### E. Review Entity (`reviews`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `orderId` | ObjectId | Foreign Key $\rightarrow$ `orders._id` (Unique per order) |
| `consumerId` | ObjectId | Foreign Key $\rightarrow$ `users._id` |
| `farmerId` | ObjectId | Foreign Key $\rightarrow$ `users._id` |
| `productId` | ObjectId | Optional Foreign Key $\rightarrow$ `products._id` |
| `rating` | Number | Integer value between 1 and 5 |
| `comment` | String | Consumer text feedback |

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / Action | Guest | Consumer | Farmer (Unverified) | Farmer (Verified) | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Browse Marketplace & Filter Items | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Farm Profiles & Harvest Recency | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add to Cart & Select Delivery Slots | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkout & Place Orders | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Consumer Dashboard & Live Tracker | ❌ | ✅ | ❌ | ❌ | ❌ |
| Submit Post-Delivery Review | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Farmer Portal & Analytics | ❌ | ❌ | ✅ | ✅ | ❌ |
| Create Harvest Listings (**Verification Gate**)| ❌ | ❌ | ❌ (*Blocked*) | ✅ | ✅ |
| Advance Order Status (`Confirmed` $\rightarrow$ `Delivered`) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve / Reject Farmer Applications | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Platform GMV & Platform KPIs | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Non-Functional Requirements & Performance Standards

1. **Page Load Performance:**
   - Pre-rendered static catalog components with dynamic hydration load in under **1.8 seconds**.
   - Optimized images with lazy-loading and WebP remote patterns.
2. **Data Consistency & Concurrency:**
   - Atomic decrement prevents race conditions when multiple buyers check out remaining units of a harvest simultaneously.
3. **Usability & Accessibility:**
   - High-contrast visual tokens tailored for accessibility across mobile smartphones and desktop tablets.
   - Clean iconography and color-coded status badges for users with varying digital literacy.
4. **Security:**
   - Passwords hashed with 10-round bcrypt salts.
   - HttpOnly JWT cookie support prevents Cross-Site Scripting (XSS) token exfiltration.

---

## 6. Verification Test Results

- **Build Validation:** `npm run build` generates 25 routes with **0 errors**.
- **Automated E2E Suite:** `node scripts/verify-e2e.js` confirms:
  - Multi-criteria product queries (Organic vegetables, dairy).
  - Atomic stock updates during multi-item orders.
  - Multi-stage farmer fulfillment (`pending` $\rightarrow$ `confirmed` $\rightarrow$ `dispatched` $\rightarrow$ `delivered`).
  - 5-star customer review calculation and farmer average rating recalculation.
  - Admin approval workflow unlocking farmer listing capabilities.
