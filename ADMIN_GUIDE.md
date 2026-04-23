# TAMBE Website - Theme Customization Admin Panel
## Complete Usage Guide

---

## 🎨 Overview

The Theme Customization Admin Panel allows you to control the entire website's appearance without touching code. Change colors, fonts, typography, and see changes in real-time before publishing.

---

## 🔐 Access & Authentication

### Admin Login
- **URL**: `https://your-domain.com/admin/login`
- **Default Password**: `tambe_admin_2024`
- **Security**: Token-based authentication stored in localStorage

### Changing Admin Password
Update the `ADMIN_PASSWORD` in `/app/backend/.env`:
```bash
ADMIN_PASSWORD=your_new_secure_password
```
Then restart the backend: `sudo supervisorctl restart backend`

---

## 🎛️ Dashboard Features

### 1. Color Settings (12 Controls)

#### **Primary Colors**
- **Primary Color** - Brand highlight (buttons, accents, links)
- **Secondary Color** - Supporting brand color
- **Background** - Main page background
- **Secondary Background** - Card/section backgrounds

#### **Text Colors**
- **Primary Text** - Main headings and content
- **Secondary Text** - Supporting text
- **Muted Text** - Navigation, captions

#### **Button Colors**
- **Button Background** - CTA button fill
- **Button Text** - Text on buttons
- **Button Hover BG** - Button color on hover
- **Button Hover Text** - Text color on hover

#### **Interface**
- **Border** - Dividers, card borders

**How to Use:**
1. Click color picker to choose visually
2. OR enter HEX/RGBA code manually
3. Changes reflect immediately in preview

---

### 2. Typography Settings

#### **Font Family**
Choose from 5 professional fonts:
- **Inter** - Modern, clean (default)
- **Poppins** - Friendly, rounded
- **Roboto** - Professional, neutral
- **Montserrat** - Bold, impactful
- **Playfair Display** - Elegant, serif

#### **Font Sizes**
- **H1 Size** - Main hero headings (12-100px)
- **H2 Size** - Section headings (12-100px)
- **H3 Size** - Subsection headings (12-100px)
- **Body Text Size** - Paragraphs, descriptions (12-100px)
- **Button Text Size** - CTA button text (12-100px)

**How to Use:**
1. Drag slider for quick adjustment
2. OR type exact size in input field
3. Preview updates instantly

---

### 3. Theme Presets (Quick Start)

Three professionally designed themes ready to use:

#### **Industrial Dark** (Default)
- Colors: Electric Blue (#00FFD1) + Black
- Style: Modern, futuristic, high-tech
- Best for: Technology, automotive, engineering

#### **Clean Light**
- Colors: Royal Blue (#0066FF) + White
- Style: Professional, approachable, clean
- Best for: Corporate, services, consulting

#### **High Contrast**
- Colors: Yellow (#FFFF00) + Black
- Style: Bold, accessible, attention-grabbing
- Best for: Accessibility, headlines, impact

**How to Use:**
1. Click any preset to load instantly
2. Modify colors/fonts as needed
3. Save as custom theme

---

### 4. Preview System

**Preview Mode** - Test before publishing
1. Make your color/font changes
2. Click **"Preview"** button
3. Website updates temporarily
4. Navigate site to check all pages
5. **Save** to publish OR **Cancel Preview** to revert

**Safety Features:**
- Changes NOT saved until you click "Save Theme"
- "Cancel Preview" instantly reverts to active theme
- "Reset" button restores current active settings

---

### 5. Save & Activate Themes

#### **Creating New Theme**
1. Adjust colors and fonts
2. Click **"Save Theme"**
3. Enter theme name (e.g., "Summer 2025")
4. Theme saved to "Saved Themes" list

#### **Activating Theme**
1. Go to "Saved Themes" sidebar
2. Click "Activate" on any saved theme
3. Website updates immediately across all pages

#### **Managing Themes**
- **Active Theme** - Currently live (shows "Active" badge)
- **Custom Themes** - Your saved designs
- **Preset Themes** - Cannot be deleted or modified

---

### 6. Validation & Safety

#### **Automatic Warnings**
The system warns you about:
- ⚠️ Identical text and background colors (unreadable)
- ⚠️ No button contrast (invisible buttons)
- ⚠️ Too-similar backgrounds (poor visual hierarchy)

**You cannot save** themes with validation errors - fix warnings first.

#### **Reset to Default**
- Click **"Reset"** button (red circular arrow)
- Instantly restores active theme settings
- Useful if you make mistakes

---

## 🔄 Workflow Examples

### Example 1: Quick Brand Color Change
1. Login to admin
2. Click "Industrial Dark" preset
3. Change Primary Color from #00FFD1 to your brand color
4. Click "Preview" → Check website
5. Click "Save Theme" → Name it "Brand Theme 2025"
6. Click "Activate" → Live on website

### Example 2: Seasonal Theme
1. Create summer theme (bright blues, larger text)
2. Save as "Summer 2025"
3. When fall arrives, activate "Fall 2024" theme
4. Instant seasonal refresh without coding

### Example 3: A/B Testing
1. Create "Version A" with blue buttons
2. Create "Version B" with green buttons
3. Activate each and measure conversions
4. Keep winner active

---

## 🏗️ Technical Architecture

### Frontend Implementation
- **React Context API** - Global theme state
- **CSS Variables** - Dynamic styling system
- **Real-time Preview** - Instant visual feedback
- **Local Storage** - Auth token persistence

### Backend Implementation
- **MongoDB** - Theme storage
- **FastAPI** - RESTful API endpoints
- **Simple Auth** - Password-protected access
- **CORS Enabled** - Cross-origin requests

### API Endpoints
```
GET    /api/themes              - List all themes
GET    /api/themes/active       - Get active theme
GET    /api/themes/{id}         - Get specific theme
POST   /api/themes              - Create new theme (auth required)
PUT    /api/themes/{id}         - Update theme (auth required)
POST   /api/themes/{id}/activate- Activate theme (auth required)
DELETE /api/themes/{id}         - Delete theme (auth required)
GET    /api/themes/presets/all  - Get default presets
POST   /api/admin/login         - Admin authentication
```

### CSS Variables Used
```css
--color-primary
--color-secondary
--color-background
--color-background-secondary
--color-text-primary
--color-text-secondary
--color-text-muted
--color-button-bg
--color-button-text
--color-button-hover-bg
--color-button-hover-text
--color-border
--font-family
--font-h1-size
--font-h2-size
--font-h3-size
--font-body-size
--font-button-size
```

---

## 🚀 Performance & Best Practices

### Optimization
- **No Page Reload** - CSS variables update instantly
- **Lightweight** - ~50KB additional bundle size
- **Cached** - Active theme loaded once on page load
- **Efficient** - Only changed properties update

### Best Practices
1. **Test in Preview** before activating
2. **Name themes clearly** (e.g., "Dark Blue - Dec 2024")
3. **Keep presets** as backup fallback options
4. **Check mobile** after font size changes
5. **Verify contrast** for accessibility

### Common Mistakes to Avoid
- ❌ White text on white background
- ❌ Button colors matching background
- ❌ Font sizes below 14px (readability)
- ❌ Too many accent colors (visual clutter)
- ✅ Use validation warnings as guide
- ✅ Preview on actual website before saving

---

## 🛠️ Troubleshooting

### Theme Not Applying
1. Check browser cache (Ctrl+Shift+R to hard refresh)
2. Verify theme is marked "Active" in admin
3. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`

### Login Issues
1. Verify password in `/app/backend/.env`
2. Clear browser localStorage
3. Check backend is running: `sudo supervisorctl status backend`

### Colors Not Updating
1. Ensure CSS variables are loaded in App.css
2. Check browser console for errors
3. Verify theme context is wrapping App component

### Preview Stuck
1. Click "Cancel Preview" button
2. Hard refresh page (Ctrl+Shift+R)
3. Restart frontend if needed: `sudo supervisorctl restart frontend`

---

## 📱 Mobile Responsiveness

All theme changes apply responsively:
- **Desktop** (1920px+) - Full size
- **Tablet** (768px-1919px) - Scaled appropriately
- **Mobile** (<768px) - Optimized for small screens

Font sizes automatically scale based on viewport.

---

## 🔒 Security Considerations

### Current Implementation (Basic)
- Simple password authentication
- Token stored in localStorage
- No rate limiting
- Single admin user

### Production Recommendations
1. **Use environment variable** for password (not hardcoded)
2. **Enable HTTPS** for secure transmission
3. **Add rate limiting** to login endpoint
4. **Implement session timeout** (auto-logout)
5. **Add audit logs** for theme changes
6. **Multi-user support** with roles (if needed)

---

## 📊 Future Enhancements

Possible additions:
- [ ] Schedule theme changes (e.g., auto-switch seasons)
- [ ] A/B testing dashboard with analytics
- [ ] Undo/Redo functionality
- [ ] Export/Import themes as JSON
- [ ] Theme versioning and rollback
- [ ] Live website preview iframe in admin
- [ ] Accessibility score for color combinations
- [ ] Dark mode toggle for website visitors

---

## 📞 Support

### Quick Links
- Admin Panel: `/admin/login`
- Main Website: `/`
- Backend API Docs: `/docs` (if enabled)

### Default Credentials
```
Password: tambe_admin_2024
```

**Remember to change the default password in production!**

---

## ✅ Checklist: First-Time Setup

- [ ] Login to admin panel
- [ ] Verify default "Industrial Dark" theme is active
- [ ] Test changing Primary Color
- [ ] Click "Preview" to see changes
- [ ] Save a custom theme
- [ ] Activate your custom theme
- [ ] View website to confirm changes
- [ ] Change admin password in .env file
- [ ] Document your brand colors for future reference

---

**Need Help?** Check backend logs or contact your developer for assistance.
