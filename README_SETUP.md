# StoriesByFoot - Setup Guide

## Database File Explanation

### ❌ **database.db file nahi hai - Ye normal hai!**

Ye project **IndexedDB** use karta hai jo browser ka built-in database hai. 

- **Physical file nahi hota** - Data browser ke storage me store hota hai
- **Chrome:** DevTools → Application → Storage → IndexedDB → `storiesbyfoot_db`
- **Firefox:** DevTools → Storage → IndexedDB → `storiesbyfoot_db`
- Database automatically create hota hai jab app first time run hota hai

### ✅ **Admin user automatically create hota hai**

First time app run hote hi admin user automatically ban jata hai:
- **Email:** `nitinmishra2202@gmail.com`
- **Password:** `stnt@stories123@`

### ❌ **.env file nahi chahiye**

Is project me `.env` file ki zarurat nahi hai kyunki:
- Database browser me store hoti hai (IndexedDB)
- Koi API keys ya secrets nahi hain
- Sab configuration code me hi hai

---

## Blank Page Issue Fix

### **Step 1: Browser Console Check Karein**

1. Browser me `F12` ya `Right Click → Inspect` press karein
2. **Console tab** me koi errors check karein
3. Agar error hai to wo batao, main fix kar dunga

### **Step 2: Common Issues & Solutions**

#### **Issue 1: "Failed to initialize auth" error**
- **Solution:** Browser cache clear karein
- `Ctrl + Shift + Delete` → Clear cache

#### **Issue 2: Module not found errors**
```bash
# Dependencies reinstall karein
pnpm install
```

#### **Issue 3: Port already in use**
```bash
# Different port use karein
# vite.config.ts me port change karo ya
# Terminal me stop karke phir se start karo
```

### **Step 3: Hard Refresh**

1. `Ctrl + Shift + R` (Windows/Linux)
2. Ya `Ctrl + F5`
3. Ya browser me cache clear karein

---

## Project Run Karna

### **Development Mode:**
```bash
pnpm install    # Dependencies install (sirf pehli baar)
pnpm dev        # Development server start
```

### **Browser me open:**
- Default: `http://localhost:8080`
- Ya terminal me jo URL dikhe wo open karo

---

## Database Access (Browser me)

### **Chrome/Edge:**
1. `F12` press karo
2. **Application** tab
3. **Storage** → **IndexedDB** → **storiesbyfoot_db**
4. Yaha saara data dikhega

### **Firefox:**
1. `F12` press karo
2. **Storage** tab
3. **IndexedDB** → **storiesbyfoot_db**
4. Yaha saara data dikhega

---

## Features

✅ **User Features:**
- Signup/Login
- Dashboard with bookings
- Account management
- Password change
- Testimonials submission

✅ **Admin Features:**
- User management
- Booking management
- Testimonials control
- Excel export
- Password reset

---

## Support

Agar koi problem ho:
1. Browser console me errors check karo
2. Terminal me errors check karo
3. Error ka full message share karo

---

**Note:** Database browser me store hoti hai, isliye different browser me alag alag data hoga. Agar data clear karna ho to browser's Application/Storage section me jao aur clear karo.
