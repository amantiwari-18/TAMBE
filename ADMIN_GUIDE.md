# TAMBE Website - Admin Panel Complete Guide
## Theme Customization & Product Management

---

## 🎨 Overview

The Admin Panel provides complete control over your website's appearance and content without writing code. Manage colors, fonts, typography, and products - all through an intuitive interface.

### Key Features:
1. **Theme Customization** - Colors, fonts, typography
2. **Product Management** - Add, edit, delete products
3. **Real-time Preview** - See changes before publishing
4. **Image Upload** - Upload product images directly
5. **Safety Controls** - Validation and rollback options

---

## 🔐 Access & Authentication

### Admin Login
- **URL**: `https://your-domain.com/admin/login`
- **Password**: Set in backend environment variable `ADMIN_PASSWORD`
- **Security**: Token-based authentication stored in localStorage

### Changing Admin Password
Update the `ADMIN_PASSWORD` in `/app/backend/.env`:
```bash
ADMIN_PASSWORD=your_new_secure_password
```
Then restart the backend: `sudo supervisorctl restart backend`

---

## 📦 PRODUCT MANAGEMENT

### Accessing Product Management
1. Login to admin panel
2. Click **"Manage Products"** button in header
3. Or navigate to `/admin/products`

### 🆕 Adding New Products

**Step 1: Click "Add Product"**
- Green button in top-right corner

**Step 2: Fill Product Details**

#### **Product Name** (Required)
- Example: "Precision Gears", "Transmission Systems"
- Keep it concise and descriptive

#### **Category** (Required)
Choose from dropdown:
- **Gears** - Gear products
- **Automotive Parts** - Car components
- **Custom Components** - Bespoke parts

#### **Description** (Required)
- 2-3 sentences describing the product
- Highlight key benefits and use cases
- Example: "High-performance gears engineered for maximum durability and efficiency"

#### **Features** (At least 1 required)
- List 3-5 key features
- Each feature on separate line
- Click "+ Add Feature" for more
- Click "X" to remove a feature
- Examples:
  - "CNC Machined"
  - "Heat Treated"
  - "ISO Certified"

#### **Product Image** (Optional)
**Upload Image:**
1. Click "Upload Image" button
2. Select image file (JPEG, PNG, WebP)
3. Max file size: 5MB
4. Preview appears instantly
5. Click "X" to remove and choose different image

**Image Guidelines:**
- ✅ High resolution (at least 800x600px)
- ✅ Clear product photo on plain background
- ✅ Good lighting
- ✅ Professional quality
- ❌ No watermarks or text overlays
- ❌ Avoid cluttered backgrounds

**If No Image:**
- Gradient placeholder will be used
- Shows product name
- Still looks professional

#### **Active Status**
- ☑️ **Checked** = Visible on website
- ☐ **Unchecked** = Hidden (draft mode)

**Step 3: Save Product**
- Click **"Create Product"** button
- Success message appears
- Product added to list
- Immediately visible on website (if active)

---

### ✏️ Editing Products

**Step 1: Find Product**
- Scroll through product list
- Look for product name

**Step 2: Click Edit Button** (✏️ pencil icon)
- Form opens with current details pre-filled

**Step 3: Make Changes**
- Update any fields
- Change image (upload new or keep existing)
- Modify features

**Step 4: Save Changes**
- Click **"Update Product"**
- Changes reflect immediately on website

---

### 👁️ Show/Hide Products

**Quick Toggle:**
- Click **Eye icon** (👁️) next to product
- Green eye = Visible on website
- Gray crossed-eye = Hidden

**Use Cases:**
- Hide out-of-stock products
- Test new products before public launch
- Seasonal products (show/hide by season)

---

### 🗑️ Deleting Products

**Step 1: Click Delete Button** (🗑️ trash icon)
- Red button next to product

**Step 2: Confirm Deletion**
- Popup asks for confirmation
- Click "OK" to permanently delete
- Click "Cancel" to keep product

**⚠️ Warning**: Deletion is permanent and cannot be undone!

---

### 📊 Product Display Order

Products appear on website in the order they were created.

**To Reorder** (future feature):
- Drag and drop products
- Or use "Order" field

---

### 🎬 Product Management Workflow Examples

#### Example 1: Launching New Product
1. Click "Add Product"
2. Enter name: "Advanced Clutch System"
3. Select category: "Automotive Parts"
4. Write description
5. Add 3-5 features
6. Upload professional product photo
7. **Uncheck "Active"** (keep hidden)
8. Click "Create Product"
9. Preview on test environment
10. When ready: Click Eye icon to make visible

#### Example 2: Seasonal Update
1. **Winter Season Ends:**
   - Click Eye icon on winter products → Hide
2. **Spring Season Starts:**
   - Click Eye icon on spring products → Show
3. Changes instant, no downtime

#### Example 3: Product Improvement
1. Click Edit on existing product
2. Upload better quality image
3. Add 2 more features discovered from customer feedback
4. Update description with new benefits
5. Click "Update Product"
6. Website updated instantly

---

### 🔄 Initialize Default Products

**First Time Setup:**
- If no products exist, click **"Initialize Default Products"**
- Adds 6 sample products:
  1. Precision Gears
  2. Transmission Systems
  3. Custom Components
  4. Drive Shafts
  5. Differential Gears
  6. Clutch Systems
- Use as templates or delete and add your own

---

## 🎨 THEME CUSTOMIZATION

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
