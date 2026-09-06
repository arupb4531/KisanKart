# KisanKart: User Manual & Testing Operations Guide

---

## 1. Quick Start & Test Personas

KisanKart includes an interactive **Role & Persona Switcher** in the top navigation bar to test all user journeys without typing passwords.

### Pre-Configured Test Accounts:

| Persona | Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **🛒 Consumer** | `consumer@kisankart.com` | `password123` | Browse catalog, add to cart, select morning delivery slot, place orders, view 4-stage tracking timeline, submit reviews. |
| **👨‍🌾 Verified Farmer** | `farmer@kisankart.com` | `password123` | Ramesh Patil (Patil Organic Bio Farms). Full inventory management, list produce, advance order statuses (`Confirmed` $\rightarrow$ `Dispatched` $\rightarrow$ `Delivered`). |
| **⚠️ Unverified Farmer** | `vikram@kisankart.com` | `password123` | Vikram Singh (Malwa Heritage Grain Fields). Tests the **Verification Gate** (product creation disabled until admin approves). |
| **🛡️ Platform Admin** | `admin@kisankart.com` | `password123` | Rajesh Sharma. Full governance desk, platform GMV analytics, 1-click farmer verification approval. |

---

## 2. Guided Step-by-Step Test Scenarios

### Scenario 1: The Consumer Experience (Browse $\rightarrow$ Slot $\rightarrow$ Order $\rightarrow$ Review)
1. Open the platform at [http://localhost:3002](http://localhost:3002).
2. Click **"Switch Role / Test Persona"** in the top announcement bar and select **"Consumer (Ananya Sharma)"**.
3. Navigate to **Marketplace** (`/marketplace`):
   - Toggle **"100% Certified Organic Only"** to filter chemical-free produce.
   - Select category **"Vegetables"** or **"Dairy & Ghee"**.
4. Click on **"Farm Fresh Organic Desi Tomatoes"** (`/products/[id]`):
   - Notice the **Harvest Freshness Badge** (`🟢 Harvested 8h ago`).
   - Check the **Grower Trust Card** showing Ramesh Patil's farm location in Saswad, Pune and his 4.9 rating.
   - Set quantity to `2 kg` and click **"Add to Cart"**.
5. Go to **Cart** (`/cart`):
   - Notice how items are grouped under **Patil Organic Bio Farms** for direct farm transparency.
   - Click **"Proceed to Delivery & Slot Selection"** (`/checkout`).
6. At **Checkout** (`/checkout`):
   - Select **Tomorrow's Early Morning Slot** (`07:00 AM - 10:00 AM`).
   - Choose **Instant Online Payment (UPI/Card)**.
   - Click **"Confirm & Place Order"**.
   - An Order Confirmation Modal will display generated order ID (e.g. `KM-XXXXXX-1`).
7. Go to **Consumer Dashboard** (`/dashboard/consumer`):
   - View the active 4-stage delivery timeline (`Placed` $\rightarrow$ `Confirmed` $\rightarrow$ `Dispatched` $\rightarrow$ `Delivered`).
   - On previously delivered orders, click **"Rate Freshness & Grower"** to submit a 5-star review.

---

### Scenario 2: The Farmer Experience (Inventory $\rightarrow$ Order Fulfillment)
1. Click **"Switch Role / Test Persona"** and choose **"Farmer - Verified (Ramesh Patil)"**.
2. Navigate to **Farmer Portal** (`/dashboard/farmer`):
   - See the green banner: `✓ Verified Farmer Producer Account`.
   - Review live metrics: Gross Revenue, Pending Orders, and Active Produce Listings.
3. **List New Produce:**
   - Click **"List New Dawn Harvest"**.
   - Enter Produce Name (e.g. *Organic Sweet Corn*), Category *Vegetables*, Price per unit *₹40/piece*, Stock *50*, Harvest Date *Today*, toggle *100% Organic*.
   - Click **"Publish Produce Listing"** $\rightarrow$ Appears immediately in marketplace!
4. **Fulfill Customer Orders:**
   - Switch to the **"Incoming Orders"** tab.
   - For a `pending` order, click **"✓ Accept & Confirm Harvest"**.
   - Click **"🚚 Mark Out for Delivery (Dispatched)"**.
   - Click **"🎉 Mark Delivered (Handed Over)"** $\rightarrow$ Consumer can now review the produce!

---

### Scenario 3: Testing the Farmer Verification Gate
1. Click **"Switch Role / Test Persona"** and choose **"Farmer - Unverified (Vikram Singh)"**.
2. Notice the amber alert banner on the dashboard:
   > ⚠️ **Farm Verification Under Review (Verification Gate Active):** Product listing creation is disabled until administrator verification is complete.
3. Switch role to **"Platform Admin (Rajesh Sharma)"** (`/dashboard/admin`):
   - Locate Vikram Singh's application in the **Pending Farmer Verification Queue**.
   - Click **"View Submitted Land Certificate / APMC ID"** to review documents.
   - Click **"Approve & Verify"**.
4. Switch back to Vikram Singh $\rightarrow$ Account is now verified, and product listing is unlocked!

---

## 3. Database Resetting & Maintenance

To reset the database to a clean default state with fresh sample produce, orders, and reviews at any time:
- Click **"Switch Role / Test Persona"** $\rightarrow$ Click **"Reset Data"**.
- Or run in terminal:
  ```bash
  node scripts/verify-e2e.js
  ```
