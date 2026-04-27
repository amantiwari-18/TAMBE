# JSON Storage Guide - Tambe Website

## Overview
Your website now uses **JSON files** instead of a database. All data is stored in `/app/backend/data/` directory.

## Data Files Location
```
/app/backend/data/
├── themes.json          # Theme configurations (colors, fonts)
├── products.json        # Product catalog
├── hero.json           # Hero slider slides
├── settings.json       # Site settings (WhatsApp, SEO)
└── status_checks.json  # System status logs
```

## How to Edit Data

### Method 1: Through Admin Panel (Recommended)
1. Go to `/admin/login` in your browser
2. No password required (authentication is simplified)
3. Use the Admin Dashboard to manage:
   - Themes (colors, typography)
   - Products (add/edit/delete with images)
   - Hero Slides (main banner content)
   - Settings (WhatsApp number, SEO metadata)

### Method 2: Direct JSON File Editing

#### Editing Themes (`themes.json`)
```json
{
  "id": "preset-luxury-gold",
  "name": "Luxury Gold",
  "colors": {
    "primary": "#D4AF37",           // Main accent color (buttons, links)
    "secondary": "#1A2332",          // Secondary color
    "background": "#0A0E17",         // Main background
    "background_secondary": "#141B2D", // Card backgrounds
    "text_primary": "#FFFFFF",       // Main text color
    "button_bg": "#D4AF37",          // Button background
    "button_text": "#0A0E17"         // Button text color
  },
  "fonts": {
    "family": "Inter",               // Font family
    "h1_size": "66px",               // Main heading size
    "body_size": "18px"              // Body text size
  },
  "is_active": true                  // Set to true for active theme
}
```

**To change active theme:**
1. Find the theme you want to activate
2. Set its `"is_active": true`
3. Set all other themes' `"is_active": false`
4. Save the file
5. Refresh your website

#### Editing Products (`products.json`)
```json
{
  "id": "product-1",
  "name": "Drive Shafts",
  "description": "Premium drive shafts built for performance and longevity",
  "category": "AUTOMOTIVE PARTS",
  "features": [
    "High-strength steel construction",
    "Precision-balanced",
    "Enhanced durability"
  ],
  "image_url": "/uploads/products/drive-shaft.jpg",
  "link_url": "https://example.com/product",
  "is_active": true,
  "order": 1
}
```

**To add a new product:**
1. Copy an existing product entry
2. Change the `id` to something unique (e.g., "product-new-1")
3. Update name, description, features, etc.
4. Set `order` to control display position (lower numbers appear first)
5. Save the file

#### Editing Hero Slides (`hero.json`)
```json
{
  "id": "slide-1",
  "title": "Engineering Precision. Powering Performance.",
  "subtitle": "Crafting the future of automotive excellence",
  "tagline": "WHERE CUTTING-EDGE TECHNOLOGY MEETS AUTOMOTIVE EXCELLENCE",
  "cta_text": "Explore Products",
  "cta_link": "#products",
  "image_url": "/uploads/hero/slide1.jpg",
  "order": 1,
  "is_active": true
}
```

#### Editing Settings (`settings.json`)
```json
{
  "whatsapp_number": "+1234567890",
  "site_title": "Tambe - Precision Engineered Gears",
  "meta_description": "Leading manufacturer of precision-engineered vehicle gears",
  "contact_email": "info@tambeglobal.com"
}
```

## Important Notes

### 🔄 After Editing JSON Files
- Changes take effect **immediately** (no restart needed)
- Refresh your browser to see updates
- If changes don't appear, restart backend: `sudo supervisorctl restart backend`

### ⚠️ JSON Syntax Rules
- Use double quotes `"` (not single quotes `'`)
- No trailing commas in arrays/objects
- Validate JSON syntax before saving (use https://jsonlint.com)

### 🎨 Available Preset Themes
1. **Luxury Gold** (Current) - Gold + Navy (Premium automotive)
2. **Industrial Dark** - Cyan + Black (Modern tech)
3. **Electric Blue** - Blue + Dark (Contemporary)
4. **Carbon Black** - Orange + Black (Sporty)

To switch themes, simply activate a different preset in `themes.json`.

### 📁 Uploading Images
Place product/hero images in:
- Products: `/app/backend/uploads/products/`
- Hero: `/app/backend/uploads/hero/`

Then reference them in JSON as: `"/uploads/products/image-name.jpg"`

## Backup Your Data
**Always backup before major edits:**
```bash
cp /app/backend/data/themes.json /app/backend/data/themes.backup.json
```

## Troubleshooting

**Website shows errors after editing?**
1. Check JSON syntax is valid
2. Restart backend: `sudo supervisorctl restart backend`
3. Check logs: `tail -50 /var/log/supervisor/backend.err.log`

**Changes not appearing?**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Verify JSON file was saved correctly

## Admin Panel URLs
- Login: `https://your-domain.com/admin/login`
- Dashboard: `https://your-domain.com/admin/dashboard`
- Products: `https://your-domain.com/admin/products`
- Settings: `https://your-domain.com/admin/settings`
- Hero: `https://your-domain.com/admin/hero`
