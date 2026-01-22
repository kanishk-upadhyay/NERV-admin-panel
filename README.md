# NERV Admin Panel ✨

A **state management gauntlet** built with React and Redux Toolkit, featuring **Material 3 Expressive** design language. This isn't a todo app for toddlers—it's a fully-featured, vibrant, and delightful admin panel with rigid architecture and proper state management.

## 🎨 Design System

This admin panel follows **Material 3 Expressive** design language, featuring:

- 🌈 **Vibrant Gradients** - 7+ colorful gradient presets
- 🔵 **Playful Shapes** - Large rounded corners (12px-40px) and pill-shaped buttons
- ✨ **Dynamic Animations** - Bouncy transitions with 12+ micro-interactions
- 🎯 **Bold Typography** - Heavy weights (700-900) with gradient text effects
- 🌊 **Colorful Shadows** - Shadows that match component colors
- 🎭 **Glass Morphism** - Backdrop blur effects on overlays
- 😊 **Delightful Details** - Emojis, pulsing indicators, and playful hover effects

## 🏗️ Architecture

### Core Technologies
- **React 18** - UI framework
- **Redux Toolkit** - State management (no legacy Redux garbage)
- **React Router v6** - Routing with protected routes
- **Vite** - Build tool (because we're not living in 2015)

### State Structure

The application uses **Redux Toolkit** with three primary slices:

#### 1. `authSlice`
- `isLoggedIn` (boolean) - Authentication state
- `token` (string) - Fake JWT token

#### 2. `userSlice`
- `users` (array) - User collection with CRUD operations
- Actions: `addUser`, `updateUser`, `deleteUser`, `toggleUserStatus`

#### 3. `productSlice`
- `products` (array) - Product collection with category metadata
- Actions: `addProduct`, `updateProduct`, `deleteProduct`, `updateProductCategory`

#### 4. `uiSlice`
- `theme` (string) - Light/Dark theme toggle

### Derived State (No Redundancy)

All computed values use **selectors** instead of storing redundant data:

```javascript
// User Stats
- selectTotalUsers: state.users.length
- selectActiveUsers: state.users.filter(u => u.status === 'active').length
- selectInactiveUsers: state.users.filter(u => u.status === 'inactive').length

// Product Stats
- selectTotalProducts: state.products.length
- selectTotalRevenue: Calculated from (price * sold)
- selectProductsByCategory: Grouped by category
- selectCategoryCount: Number of unique categories
- selectAverageProductPrice: Average across all products
```

### Protected Routes

The `ProtectedRoute` wrapper checks `isLoggedIn` from Redux. If false, it redirects to `/login` using `Navigate` from react-router-dom. No exceptions.

### Layout Architecture

- **Persistent Layout**: `Sidebar` and `Navbar` stay mounted
- **Dynamic Content**: Only the `Outlet` changes between routes
- **Theme Management**: CSS variables controlled by Redux `uiSlice`

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Navbar.jsx          # Top navigation with logout & theme toggle
│   │   ├── Sidebar.jsx         # Side navigation menu
│   │   └── ProtectedRoute.jsx  # Route guard
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Stats dashboard (all derived state)
│   │   ├── Users.jsx           # User CRUD table
│   │   └── Products.jsx        # Product CRUD with categories
│   ├── store/
│   │   ├── store.js            # Redux store configuration
│   │   ├── authSlice.js        # Authentication state
│   │   ├── userSlice.js        # User management state
│   │   ├── productSlice.js     # Product management state
│   │   ├── uiSlice.js          # UI theme state
│   │   └── selectors.js        # Memoized selectors
│   ├── data/
│   │   ├── users.json          # Initial user data
│   │   └── products.json       # Initial product data
│   ├── App.jsx                 # Router & data initialization
│   └── main.jsx                # Redux Provider setup
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🔐 Authentication

The login page accepts **any non-empty email and password** for demonstration purposes. Upon successful login:

1. Redux `authSlice` sets `isLoggedIn: true`
2. A fake JWT token is stored: `fake-jwt-token-12345`
3. User is redirected to `/dashboard`

## 📊 Features

### Dashboard
- **Total Users** - Calculated from array length
- **Active/Inactive Users** - Filtered count
- **Total Products** - Product array length
- **Total Revenue** - Sum of (price × sold)
- **Product Categories** - Unique category count
- **Average Product Price** - Calculated average
- **User Activity Rate** - Percentage of active users

### User Management
- **CRUD Operations**
  - ✅ Create new users
  - 📖 Read/Display all users in table
  - ✏️ Update user information
  - 🗑️ Delete users
- **Toggle Status** - Switch between active/inactive
- **Modal Form** - Add/Edit users via modal
- **Real-time Updates** - Redux updates UI instantly

### Product Management
- **CRUD Operations**
  - ✅ Create new products
  - 📖 Display products in table
  - ✏️ Update product details
  - 🗑️ Delete products
- **Category Management** - Organize by categories
- **Stock Tracking** - Visual indicators for low stock
- **Revenue Calculation** - Automatic revenue computation
- **Category Stats** - Grouped product counts

## 🎨 Theme System

Toggle between Light and Dark modes using the moon/sun icon in the navbar.

### CSS Variables
All colors are defined in `:root` and `[data-theme="dark"]` in `index.css`:

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`
- `--primary`, `--primary-hover`
- `--danger`, `--success`, `--warning`

Theme changes apply globally and persist during the session.

## 🗄️ Data Management

### Initial Data Loading

On app mount, `useEffect` in `App.jsx` dispatches initial data **only if the store is empty**:

```javascript
// Only load initial data if store is empty (prevents overwriting persisted data)
if (users.length === 0) {
  dispatch(initUsers(usersData));
}
if (products.length === 0) {
  dispatch(initProducts(productsData));
}
```

### "Fake" Backend

**Redux reducers ARE the database.** All CRUD operations:

- **Create**: `state.push(action.payload)`
- **Read**: Map through state array
- **Update**: Find by ID, overwrite object
- **Delete**: `state.filter(item => item.id !== action.payload)`

### Data Persistence ✨

✅ **Data IS persisted!** Using `redux-persist`, all state is automatically saved to localStorage:

- **Authentication state** - Stay logged in across sessions
- **User data** - All CRUD changes persist
- **Product data** - Inventory changes saved
- **UI preferences** - Theme selection remembered

#### How It Works

1. **Automatic Saving**: Every Redux state change is automatically persisted to localStorage
2. **Automatic Loading**: On page refresh, state is rehydrated from localStorage
3. **Smart Initialization**: Initial JSON data only loads if store is empty

#### Managing Persisted Data

Debug utilities are available in the browser console via `window.__NERV_ADMIN__`:

```javascript
// Clear all persisted data
window.__NERV_ADMIN__.clearPersistedState()

// View current persisted state
window.__NERV_ADMIN__.getPersistedState()

// Check if persisted data exists
window.__NERV_ADMIN__.hasPersistedState()

// Get storage size info
window.__NERV_ADMIN__.getStorageInfo()

// Reset app to initial state (with confirmation)
window.__NERV_ADMIN__.resetApp()
```

#### Storage Location

Persisted data is stored in localStorage under the key: `persist:nerv-admin-root`

#### Clear Persisted Data

To start fresh:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `window.__NERV_ADMIN__.resetApp()`
4. Or manually: Application → Local Storage → Clear

## 🛣️ Routes

| Route | Protected | Component | Description |
|-------|-----------|-----------|-------------|
| `/login` | ❌ | Login | Authentication page |
| `/` | ✅ | Layout | Redirects to `/dashboard` |
| `/dashboard` | ✅ | Dashboard | Stats overview |
| `/users` | ✅ | Users | User management table |
| `/products` | ✅ | Products | Product management table |
| `/*` | ❌ | Navigate | Redirects to `/login` |

## 🧪 Testing the Application

### 1. Login
- Go to `http://localhost:5173/login`
- Enter any email/password
- Click "Login"

### 2. Dashboard
- View computed statistics
- Toggle theme (moon/sun icon)
- All values update automatically when data changes

### 3. User Management
- Click "Users" in sidebar
- Add new user (+ Add User button)
- Edit existing user (✏️ icon)
- Toggle user status (🔄 icon)
- Delete user (🗑️ icon)

### 4. Product Management
- Click "Products" in sidebar
- View products by category
- Add/Edit/Delete products
- Watch revenue calculations update

### 5. Logout
- Click "Logout" button in navbar
- Redirected to login page
- Protected routes become inaccessible

## 🎯 Key Features

### ✅ Redux Toolkit (RTK)
- Modern Redux with `createSlice`
- Immer for immutable updates
- No boilerplate action types
- Built-in thunk support

### ✅ Protected Routes
- Authentication guard
- Automatic redirects
- State-based access control

### ✅ Derived State
- Memoized selectors
- No redundant data storage
- Automatic recomputation
- Performance optimized

### ✅ CRUD Operations
- Full create/read/update/delete
- Instant UI updates
- Confirmation dialogs
- Modal forms

### ✅ Responsive Design
- Mobile-friendly tables
- Collapsible sidebar (mobile)
- Adaptive grid layouts
- Touch-optimized buttons

### ✅ Dark Mode
- CSS variable-based theming
- Instant theme switching
- Persistent during session
- Accessible contrast ratios

## 📝 Notes

This admin panel demonstrates:
- Proper Redux Toolkit architecture
- Protected route implementation
- Derived state with selectors
- CRUD without a backend
- Component composition
- CSS variable theming
- React Router v6 patterns

It's built to be **maintainable**, **scalable**, and **educational**. No shortcuts, no legacy patterns, no excuses.

---

**Built by following orders. Get in the robot, Shinji.**