# KisanKart: REST API Specification & Endpoint Manual

All endpoints are hosted at `/api/*`. Protected endpoints require an `Authorization: Bearer <token>` header or a valid `krishi_token` HttpOnly cookie.

---

## 1. Authentication & User Profile APIs

### `POST /api/auth/register`
Creates a new account (`consumer`, `farmer`, or `admin`).

**Request Body (Consumer):**
```json
{
  "name": "Ananya Sharma",
  "email": "consumer@kisankart.com",
  "password": "password123",
  "phone": "+91 98200 45678",
  "role": "consumer",
  "address": {
    "street": "Flat 402, Green Acre Heights, Baner Road",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411045"
  }
}
```

**Request Body (Farmer):**
```json
{
  "name": "Ramesh Patil",
  "email": "farmer@kisankart.com",
  "password": "password123",
  "phone": "+91 94220 54321",
  "role": "farmer",
  "farmName": "Patil Organic Bio Farms",
  "farmingMethod": "organic",
  "farmLocation": {
    "address": "Gat No. 42, Purandar Tehsil",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "412301"
  },
  "bio": "3rd generation organic certified farmer dedicated to zero chemical residues."
}
```

**Response (201 Created):**
```json
{
  "message": "Account created successfully.",
  "user": {
    "id": "67b43a9...",
    "name": "Ramesh Patil",
    "email": "farmer@kisankart.com",
    "role": "farmer",
    "isVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### `POST /api/auth/login`
Authenticates user and returns JWT token & HttpOnly session cookie.

**Request Body:**
```json
{
  "email": "farmer@kisankart.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful.",
  "user": {
    "id": "67b43a9...",
    "name": "Ramesh Patil",
    "email": "farmer@kisankart.com",
    "role": "farmer",
    "isVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### `GET /api/auth/me`
Fetches the current authenticated profile and attached `farmerProfile` (if farmer).

---

### `POST /api/auth/logout`
Clears the session cookie and signs out the user.

---

## 2. Produce & Inventory APIs

### `GET /api/products`
Retrieves products with query filters.

**Query Parameters:**
- `category`: e.g. `vegetables`, `fruits`, `dairy`, `grains`, `pulses`, `other`, `all`
- `isOrganic`: `true` or `false`
- `farmingMethod`: `organic`, `natural`, `conventional`, `all`
- `city`: e.g. `pune`, `nashik`, `indore`, `all`
- `search`: Keyword search in product title and description
- `minPrice` & `maxPrice`: Numeric bounds in ₹
- `sort`: `newest`, `harvest_desc`, `price_asc`, `price_desc`
- `farmerId`: Specific grower User ID

**Response (200 OK):**
```json
{
  "count": 1,
  "products": [
    {
      "_id": "67b43b1...",
      "name": "Farm Fresh Organic Desi Tomatoes",
      "category": "vegetables",
      "pricePerUnit": 48,
      "unit": "kg",
      "stockQuantity": 120,
      "harvestDate": "2026-08-18T16:00:00.000Z",
      "isOrganic": true,
      "images": ["https://images.unsplash.com/..."],
      "farmerId": {
        "_id": "67b43a9...",
        "name": "Ramesh Patil",
        "avatar": "https://..."
      },
      "farmerProfile": {
        "farmName": "Patil Organic Bio Farms",
        "farmingMethod": "organic",
        "averageRating": 4.9,
        "farmLocation": { "city": "Pune", "state": "Maharashtra" }
      }
    }
  ]
}
```

---

### `POST /api/products` *(Protected: Farmer Only)*
Creates a new dawn harvest listing. Enforces **Verification Gate** (`isVerified: true`).

**Request Body:**
```json
{
  "name": "Organic Red Capsicum",
  "category": "vegetables",
  "pricePerUnit": 65,
  "unit": "kg",
  "stockQuantity": 80,
  "harvestDate": "2026-08-19",
  "isOrganic": true,
  "description": "Crisp greenhouse capsicum harvested at sunrise.",
  "images": ["https://images.unsplash.com/..."]
}
```

---

### `PUT /api/products/:id` *(Protected: Owner / Admin)*
Updates pricing, stock, availability, or description.

### `DELETE /api/products/:id` *(Protected: Owner / Admin)*
Deletes the product listing.

---

## 3. Order & Checkout APIs

### `POST /api/orders` *(Protected: Logged-in Consumer)*
Validates inventory, performs atomic stock decrement, and creates farmer-grouped sub-orders.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "67b43b1...",
      "name": "Farm Fresh Organic Desi Tomatoes",
      "unitPrice": 48,
      "quantity": 2,
      "unit": "kg"
    }
  ],
  "deliverySlot": {
    "date": "2026-08-20",
    "timeSlot": "07:00 AM - 10:00 AM"
  },
  "shippingAddress": {
    "street": "Flat 402, Green Acre Heights, Baner Road",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411045"
  },
  "paymentMethod": "online"
}
```

**Response (201 Created):**
```json
{
  "message": "Order(s) placed successfully.",
  "orderCount": 1,
  "orders": [
    {
      "_id": "67b43c2...",
      "orderNumber": "KM-88401-1",
      "totalAmount": 96,
      "status": "pending",
      "paymentMethod": "online",
      "paymentStatus": "paid"
    }
  ]
}
```

---

### `GET /api/orders/my-orders` *(Protected: Consumer)*
Returns order history with delivery tracking timeline, item breakdown, and submitted review status.

---

### `GET /api/orders/farmer-orders` *(Protected: Farmer)*
Returns all incoming fulfillments assigned to this farmer with customer delivery addresses.

---

### `PUT /api/orders/:id/status` *(Protected: Farmer / Admin)*
Updates order state progression.
- Valid status values: `pending`, `confirmed`, `dispatched`, `delivered`, `cancelled`.

---

## 4. Review & Ratings APIs

### `POST /api/reviews` *(Protected: Consumer)*
Submits rating and feedback for a delivered order. Automatically recalculates the grower's average rating.

**Request Body:**
```json
{
  "orderId": "67b43c2...",
  "rating": 5,
  "comment": "Exceptional freshness! Delivered right at 7:30 AM."
}
```

---

## 5. Admin Governance APIs

### `GET /api/admin/metrics` *(Protected: Admin)*
Returns platform KPIs: GMV, Total Orders, Delivered Orders, Fulfillment Rate %, Total Farmers, Verified vs Pending count, and Consumer statistics.

### `GET /api/admin/farmers/pending` *(Protected: Admin)*
Returns list of all unverified farmer applicants with submitted certificate URLs.

### `PUT /api/admin/farmers/:id/verify` *(Protected: Admin)*
Approves (`isVerified: true`) or rejects a farmer account.

---

## 6. Seed & Demo API

### `POST /api/seed`
Wipes and populates the database with realistic sample farmers, verified produce across 5 categories, orders, and 5-star reviews.
