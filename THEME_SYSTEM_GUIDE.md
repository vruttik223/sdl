# 🎨 Theme System Guide - Customer & Doctor Themes

## Overview
The application now supports two distinct themes:
- **Customer Theme**: Green color scheme (#0da487)
- **Doctor Theme**: Blue color scheme (#2563eb)

The theme automatically switches based on the user's role (Doctor or Customer) upon login.

---

## 🏗️ System Architecture

### 1. Theme Variables
**Location**: `public/assets/scss/themes/_theme-variables.scss`

All colors are defined as CSS custom properties (CSS variables) in two theme classes:
- `.theme-customer` (default)
- `.theme-doctor`

### 2. Theme Provider
**Location**: `src/providers/ThemeProvider.jsx`

React Context provider that:
- Detects user role from `UserContext`
- Sets appropriate theme class on `<html>` element
- Manages theme cookie for persistence
- Provides `useTheme` hook for components

### 3. Integration Points
- **Root Layout**: `src/layout/index.jsx` - ThemeProvider wrapped after UserProvider
- **Auth Hooks**: `src/utils/hooks/useAuth.js` - Sets theme cookie on login
- **Main SCSS**: `public/assets/scss/app.scss` - Imports theme variables

---

## 🎯 How It Works

### Authentication Flow
1. User logs in (Customer or Doctor)
2. `useAuth` hooks detect user role from API response
3. Theme cookie is set based on role:
   - `isDoctor = true` → `theme=doctor`
   - `isDoctor = false` → `theme=customer`
4. `ThemeProvider` reads cookie and applies theme class
5. CSS variables update automatically

### Theme Application
```javascript
// ThemeProvider applies class to <html> element
document.documentElement.classList.add('theme-doctor'); // or 'theme-customer'

// CSS variables cascade from :root
.theme-doctor {
  --theme-color: #2563eb; // Blue
  --btn-primary-bg: var(--theme-color);
}

.theme-customer {
  --theme-color: #0da487; // Green
  --btn-primary-bg: var(--theme-color);
}
```

---

## 💻 Usage in Components

### Using the Theme Hook
```jsx
'use client';
import { useTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { theme, isDoctor, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current Theme: {theme}</p>
      <p>Is Doctor: {isDoctor ? 'Yes' : 'No'}</p>
      
      {/* Manual theme switch (if needed) */}
      <button onClick={() => setTheme('doctor')}>
        Switch to Doctor Theme
      </button>
    </div>
  );
}
```

### Using Theme Variables in SCSS
```scss
// ✅ CORRECT - Use CSS variables
.my-button {
  background: var(--theme-color);
  color: var(--btn-primary-text);
  border-color: var(--border-color);
  
  &:hover {
    background: var(--theme-color-dark);
  }
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: 0 2px 8px var(--card-shadow);
}

// ❌ WRONG - Hardcoded colors won't change with theme
.my-button {
  background: #0da487; // This won't change!
}
```

### Using Theme Variables in Inline Styles
```jsx
function Card() {
  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)',
      color: 'var(--title-color)'
    }}>
      Card Content
    </div>
  );
}
```

---

## 🎨 Available Theme Variables

### Primary Colors
```scss
--theme-color           // Main brand color (Green/Blue)
--theme-color-light     // Lighter variant
--theme-color-dark      // Darker variant for hover states
--theme-color-rgb       // RGB values for transparency
```

### Buttons
```scss
--btn-primary-bg        // Primary button background
--btn-primary-hover     // Primary button hover state
--btn-primary-text      // Primary button text color
--btn-secondary-bg      // Secondary button background
--btn-secondary-hover   // Secondary button hover
--btn-secondary-text    // Secondary button text
```

### Semantic Colors
```scss
--success-color         // Success states
--error-color           // Error states
--warning-color         // Warning states
--info-color            // Info states
```

### Backgrounds
```scss
--bg-primary            // Main background (usually white)
--bg-secondary          // Secondary background
--bg-tertiary           // Tertiary background
```

### Cards
```scss
--card-bg               // Card background
--card-border           // Card border color
--card-shadow           // Card shadow (with transparency)
```

### Text
```scss
--title-color           // Headings color
--content-color         // Body text color
--link-color            // Link color
--link-hover            // Link hover color
```

### UI Elements
```scss
--border-color          // General border color
--hover-bg              // Hover background
--badge-success         // Success badge
--badge-warning         // Warning badge
--badge-danger          // Danger badge
--rating-color          // Star rating color
--wishlist-active-color // Active wishlist heart
```

---

## 🔧 Migration Guide

### Converting Existing Components

#### Before (Hardcoded Colors)
```scss
.product-card {
  border: 1px solid #ececec;
  background: #ffffff;
  
  .title {
    color: #222222;
  }
  
  .price {
    color: #0da487;
    font-weight: 600;
  }
  
  .btn-buy {
    background: #0da487;
    color: white;
    
    &:hover {
      background: #0a8770;
    }
  }
}
```

#### After (Theme Variables)
```scss
.product-card {
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  
  .title {
    color: var(--title-color);
  }
  
  .price {
    color: var(--theme-color);
    font-weight: 600;
  }
  
  .btn-buy {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    
    &:hover {
      background: var(--btn-primary-hover);
    }
  }
}
```

---

## 🍪 Cookie Management

### Cookie Details
- **Name**: `theme`
- **Values**: `customer` | `doctor`
- **Expiry**: 365 days
- **Set By**: `useAuth` hooks on successful login
- **Read By**: `ThemeProvider` on app initialization

### Manual Cookie Access
```javascript
import Cookies from 'js-cookie';

// Get current theme
const theme = Cookies.get('theme'); // 'customer' or 'doctor'

// Set theme manually (not recommended)
Cookies.set('theme', 'doctor', { expires: 365 });

// Remove theme cookie
Cookies.remove('theme');
```

---

## 🔍 Debugging

### Check Current Theme
```javascript
// In browser console
console.log(document.documentElement.className); 
// Output: "theme-customer" or "theme-doctor"

console.log(document.documentElement.getAttribute('data-theme'));
// Output: "customer" or "doctor"
```

### Check Theme Variable Values
```javascript
// In browser console
const root = document.documentElement;
const themeColor = getComputedStyle(root).getPropertyValue('--theme-color');
console.log('Current theme color:', themeColor);
// Output: "#0da487" (customer) or "#2563eb" (doctor)
```

### Check Theme Cookie
```javascript
// In browser console
console.log(document.cookie);
// Look for: theme=customer or theme=doctor
```

---

## 🎨 Theme Color Reference

### Customer Theme (Green)
| Variable | Color | Usage |
|----------|-------|-------|
| `--theme-color` | #0da487 | Primary green |
| `--theme-color-light` | #1fbfa1 | Hover states |
| `--theme-color-dark` | #0a8770 | Active states |
| `--secondary-color` | #ff7e5f | Accent coral |
| `--accent-color` | #ffa92e | Highlights |

### Doctor Theme (Blue)
| Variable | Color | Usage |
|----------|-------|-------|
| `--theme-color` | #2563eb | Primary blue |
| `--theme-color-light` | #3b82f6 | Hover states |
| `--theme-color-dark` | #1d4ed8 | Active states |
| `--secondary-color` | #06b6d4 | Accent cyan |
| `--accent-color` | #10b981 | Success green |

---

## 🚀 Testing Themes

### Test Both Themes Manually
```javascript
// In browser console

// Switch to Doctor theme
document.documentElement.classList.remove('theme-customer');
document.documentElement.classList.add('theme-doctor');

// Switch back to Customer theme
document.documentElement.classList.remove('theme-doctor');
document.documentElement.classList.add('theme-customer');
```

### Using the Hook
```jsx
import { useTheme } from '@/providers/ThemeProvider';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme('customer')}>
        Customer Theme (Green)
      </button>
      <button onClick={() => setTheme('doctor')}>
        Doctor Theme (Blue)
      </button>
    </div>
  );
}
```

---

## ⚠️ Important Notes

1. **Always use CSS variables** for any color that should change with the theme
2. **Never hardcode theme colors** in component styles
3. **Theme cookie is set automatically** on login - don't set it manually unless testing
4. **Theme persists across sessions** via cookie (1 year expiry)
5. **ThemeProvider requires UserProvider** - ensure correct provider hierarchy
6. **SSR compatibility** - ThemeProvider uses 'use client' and checks `mounted` state

---

## 📝 TODO (Future Enhancements)

- [ ] Dark mode variants for both themes
- [ ] Theme preview in account settings
- [ ] Custom theme builder for admin users
- [ ] Animation transitions when switching themes
- [ ] Theme-specific asset loading (logos, images)
- [ ] Accessibility contrast checks for both themes

---

## 🆘 Troubleshooting

### Theme not changing on login
1. Check if `userData.isDoctor` or `userData.role` is set correctly
2. Verify theme cookie is being set in `useAuth` hooks
3. Check browser console for ThemeProvider errors

### Colors not updating
1. Ensure SCSS uses `var(--variable-name)` not hardcoded hex
2. Check if `_theme-variables.scss` is imported in `app.scss`
3. Clear browser cache and rebuild

### Theme flashing wrong color on load
1. ThemeProvider has a `mounted` check to prevent flash
2. Ensure ThemeProvider is placed correctly in layout hierarchy
3. Check cookie is accessible on initial page load

---

## 📚 Related Files

- `public/assets/scss/themes/_theme-variables.scss` - Theme color definitions
- `src/providers/ThemeProvider.jsx` - Theme context and logic
- `src/utils/hooks/useAuth.js` - Theme cookie setting on login
- `src/layout/index.jsx` - Provider hierarchy
- `public/assets/scss/app.scss` - Theme variables import

---

**Last Updated**: 2025
**Version**: 1.0.0
