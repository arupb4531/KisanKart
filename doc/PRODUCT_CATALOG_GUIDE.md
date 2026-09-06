# KisanKart: Produce & Product Catalog Management Guide

## 📍 File Location

The centralized master catalog file for all vegetables, fruits, dairy, grains, and produce is located at:

👉 [**`src/data/products.json`**](file:///e:/Farmer-to-Consumer%20Agri%20Marketplace/src/data/products.json)

---

## 🗂️ How the Product Catalog is Structured

Every product entry in [`src/data/products.json`](file:///e:/Farmer-to-Consumer%20Agri%20Marketplace/src/data/products.json) contains the following fields:

```json
{
  "id": "prod-016",
  "name": "Organic Red Carrots (Gajar)",
  "category": "vegetables",
  "farmerEmail": "farmer@kisankart.com",
  "pricePerUnit": 40,
  "unit": "kg",
  "stockQuantity": 100,
  "harvestHoursAgo": 6,
  "isOrganic": true,
  "description": "Crunchy, sweet organic red carrots harvested early morning from bio-mulched raised beds.",
  "images": [
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop"
  ]
}
```

---

## 📋 Field Definitions & Supported Values

| Field | Type | Description / Valid Values |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g. `"prod-016"`, `"prod-017"`) |
| `name` | `string` | Display name of the vegetable/produce |
| `category` | `string` | Must be one of: `"vegetables"`, `"fruits"`, `"dairy"`, `"grains"`, `"pulses"`, `"other"` |
| `farmerEmail` | `string` | Grower email who owns this listing: `"farmer@kisankart.com"` (Ramesh Patil) or `"sunita@kisankart.com"` (Sunita Devi) |
| `pricePerUnit` | `number` | Direct price in Rupees (₹) |
| `unit` | `string` | Must be one of: `"kg"`, `"g"`, `"litre"`, `"dozen"`, `"bundle"`, `"piece"` |
| `stockQuantity`| `number` | Initial available quantity |
| `harvestHoursAgo`| `number`| Hours elapsed since harvest (e.g. `4` for 4 hours ago $\rightarrow$ shows `🟢 Harvested 4h ago`) |
| `isOrganic` | `boolean` | `true` (adds **100% Certified Organic** badge) or `false` (Conventional) |
| `description` | `string` | Farming notes, taste profile, and cultivation methods |
| `images` | `array` | High-resolution product image URLs (Unsplash / Cloudinary / direct links) |

---

## ➕ Ready-to-Copy Templates for Adding New Produce

You can copy and paste any of the templates below directly into [`src/data/products.json`](file:///e:/Farmer-to-Consumer%20Agri%20Marketplace/src/data/products.json):

### 🥕 1. New Vegetable Template
```json
{
  "id": "prod-016",
  "name": "Fresh Organic Green Broccoli",
  "category": "vegetables",
  "farmerEmail": "farmer@kisankart.com",
  "pricePerUnit": 60,
  "unit": "piece",
  "stockQuantity": 75,
  "harvestHoursAgo": 6,
  "isOrganic": true,
  "description": "Dense, crisp heads of organic broccoli harvested fresh at dawn.",
  "images": [
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop"
  ]
}
```

### 🍎 2. New Fruit Template
```json
{
  "id": "prod-017",
  "name": "Kashmir Royal Gala Crisp Apples",
  "category": "fruits",
  "farmerEmail": "sunita@kisankart.com",
  "pricePerUnit": 150,
  "unit": "kg",
  "stockQuantity": 80,
  "harvestHoursAgo": 12,
  "isOrganic": true,
  "description": "Juicy, sweet, naturally waxed-free mountain orchard apples.",
  "images": [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop"
  ]
}
```

### 🥛 3. New Dairy Template
```json
{
  "id": "prod-018",
  "name": "Fresh Organic Cow Milk Paneer (Cottage Cheese)",
  "category": "dairy",
  "farmerEmail": "sunita@kisankart.com",
  "pricePerUnit": 110,
  "unit": "g",
  "stockQuantity": 40,
  "harvestHoursAgo": 3,
  "isOrganic": true,
  "description": "Soft, melt-in-mouth paneer crafted daily from pure whole A2 cow milk with lemon juice.",
  "images": [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop"
  ]
}
```

### 🌾 4. New Grains / Pulses Template
```json
{
  "id": "prod-019",
  "name": "Organic Black Mustard Seeds (Rai)",
  "category": "other",
  "farmerEmail": "farmer@kisankart.com",
  "pricePerUnit": 95,
  "unit": "kg",
  "stockQuantity": 120,
  "harvestHoursAgo": 48,
  "isOrganic": true,
  "description": "Sun-dried whole organic black mustard seeds rich in essential oils.",
  "images": [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop"
  ]
}
```

---

## ⚡ How Your Changes are Applied to the Live Site

Whenever you edit or add products in [`src/data/products.json`](file:///e:/Farmer-to-Consumer%20Agri%20Marketplace/src/data/products.json), you can apply them to the site immediately using either of these 2 methods:

### Method A: 1-Click UI Button (Instant)
1. Open the site at [http://localhost:3002](http://localhost:3002).
2. Click **"Switch Role / Test Persona"** in the top black/green announcement bar.
3. Click the **"Reset Data"** button at the bottom of the modal.
4. The site will instantly reload with all your newly added items in the Marketplace!

### Method B: Terminal Command
Run this command in the project directory:
```bash
node -e "fetch('http://localhost:3002/api/seed', {method:'POST'}).then(r=>r.json()).then(console.log)"
```

---

## 👨‍🌾 Adding Products via the Farmer Portal UI
In addition to the `products.json` file, verified farmers can also list products dynamically at runtime:
1. Sign in as Farmer (`farmer@kisankart.com` / `password123`) or click **"1-Click Demo Farmer"**.
2. Go to **Farmer Dashboard** (`/dashboard/farmer`).
3. Click **"List New Dawn Harvest"**.
4. Fill in produce name, category, price, stock, and photos $\rightarrow$ It goes live instantly!
