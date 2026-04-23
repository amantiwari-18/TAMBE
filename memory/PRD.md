# Tambe Engineering - Luxury Automotive Website
**Product Requirements Document**

## Original Problem Statement
Create a luxury, high-end, futuristic website for "Tambe" - a brand specializing in precision-engineered vehicle gears and mechanical components. The website should feel like a premium automotive brand (Tesla/BMW/Porsche style) with minimal, powerful, and highly polished design.

## User Personas
- **B2B Buyers**: Automotive manufacturers seeking precision components
- **Engineering Managers**: Technical decision-makers evaluating suppliers
- **Procurement Teams**: Professionals comparing quality and reliability
- **Industry Partners**: Distributors and resellers
- **Website Admin**: Marketing/Brand team managing website appearance

## Core Requirements (Static)
### Design Style
- Dark luxury theme (deep black, charcoal, metallic grey)
- Electric blue (#00FFD1) accent color (customizable via admin)
- Clean, spacious layout with premium typography
- Subtle glassmorphism and soft glow effects
- Smooth animations and micro-interactions
- Cinematic scrolling experience
- Sharp-edged buttons (no border-radius)
- 90/10 color rule (black backgrounds, accents only for buttons)

### Technical Stack
- React + Tailwind CSS + CSS Variables
- Framer Motion for animations
- Sonner for toast notifications
- Lucide React for icons
- FastAPI backend
- MongoDB for theme storage
- Inter/Poppins/Roboto/Montserrat/Playfair fonts

### Sections Required
1. Hero Section (full-screen with CTAs)
2. About Section (with animated counters)
3. Products Section (grid layout with 6 products)
4. Engineering Process (4-step timeline)
5. Why Choose Tambe (6 feature cards)
6. Gallery (6 image placeholders)
7. Contact Section (form + info cards)
8. Footer (links, social icons)
9. **Admin Panel** (theme customization)

## What's Been Implemented ✓
**Date: December 2024**

### Phase 1: Frontend Website (Complete - Mock Data)
- ✅ Responsive sticky navbar with blur effect
- ✅ Full-screen hero section with gradient background
- ✅ About section with animated counters (IntersectionObserver)
- ✅ Products grid (3 columns) with hover animations
- ✅ Engineering process timeline (4 steps)
- ✅ Why Choose section (6 feature cards with icons)
- ✅ Gallery with hover zoom effects
- ✅ Contact form (mock submission)
- ✅ Contact info cards with icons
- ✅ Footer with social links
- ✅ Scroll-to-top button
- ✅ Smooth scroll navigation
- ✅ All animations using Framer Motion
- ✅ Toast notifications for form submission
- ✅ Mock data structure in `/app/frontend/src/mock.js`

### Phase 2: Theme Customization System (Complete)

#### Backend Implementation ✅
- ✅ Theme schema with ColorSettings and FontSettings models
- ✅ MongoDB collection for themes storage
- ✅ RESTful API endpoints:
  - GET /api/themes - List all themes
  - GET /api/themes/active - Get active theme
  - GET /api/themes/{id} - Get specific theme
  - POST /api/themes - Create theme (auth required)
  - PUT /api/themes/{id} - Update theme (auth required)
  - POST /api/themes/{id}/activate - Activate theme (auth required)
  - DELETE /api/themes/{id} - Delete theme (auth required)
  - GET /api/themes/presets/all - Get default presets
- ✅ Simple password authentication (ADMIN_PASSWORD env var)
- ✅ Admin login endpoint (/api/admin/login)
- ✅ Token-based authorization with x-admin-token header
- ✅ Three preset themes (Industrial Dark, Clean Light, High Contrast)
- ✅ Validation preventing preset deletion
- ✅ Active theme management (only one active at a time)

#### Frontend Implementation ✅
- ✅ Theme Context Provider (React Context API)
- ✅ CSS Variables system for dynamic styling (17 variables)
- ✅ Admin Login page (/admin/login)
  - Password input with show/hide toggle
  - Authentication with backend
  - Token storage in localStorage
  - Default password display
- ✅ Admin Dashboard (/admin/dashboard)
  - Protected route with auth check
  - Color settings panel (12 color controls)
    - Color picker + manual HEX/RGBA input
    - Primary, Secondary, Background colors
    - Text colors (primary, secondary, muted)
    - Button colors (bg, text, hover states)
    - Border color
  - Typography settings panel (6 controls)
    - Font family selector (5 professional fonts)
    - H1, H2, H3 size controls
    - Body text and button text size controls
    - Range sliders + manual input
  - Theme presets sidebar
    - 3 default themes with visual swatches
    - Active theme indicator
    - One-click preset loading
  - Saved themes sidebar
    - List of custom themes
    - Activate button for each theme
    - Active/inactive status display
  - Action buttons
    - Preview (test changes without saving)
    - Save Theme (create/update with name prompt)
    - Reset (revert to active theme)
    - Logout
  - Validation system
    - Color contrast warnings
    - Identical color detection
    - Save prevention when errors exist
  - Preview mode banner
    - Active preview indicator
    - Cancel preview button
  - Real-time updates using CSS variables
- ✅ Navigation routes (/admin, /admin/login, /admin/dashboard)
- ✅ Professional UI with dark theme styling
- ✅ Responsive design for all screen sizes

#### Design Implementation ✅
- ✅ CSS Variables for all themeable properties
- ✅ Font imports (Inter, Poppins, Roboto, Montserrat, Playfair Display)
- ✅ Global styles updated to use CSS variables
- ✅ Dynamic theme application on load
- ✅ No page reload required for theme changes

### Components Created
**Website Components:**
- `/app/frontend/src/components/Navbar.jsx`
- `/app/frontend/src/components/Hero.jsx`
- `/app/frontend/src/components/About.jsx`
- `/app/frontend/src/components/Products.jsx`
- `/app/frontend/src/components/EngineeringProcess.jsx`
- `/app/frontend/src/components/WhyChoose.jsx`
- `/app/frontend/src/components/Gallery.jsx`
- `/app/frontend/src/components/Contact.jsx`
- `/app/frontend/src/components/Footer.jsx`
- `/app/frontend/src/mock.js`

**Admin Components:**
- `/app/frontend/src/pages/AdminLogin.jsx`
- `/app/frontend/src/pages/AdminDashboard.jsx`
- `/app/frontend/src/context/ThemeContext.jsx`

**Backend Components:**
- `/app/backend/models/theme.py`
- `/app/backend/routes/theme_routes.py`
- `/app/backend/routes/admin_routes.py`

**Documentation:**
- `/app/ADMIN_GUIDE.md` - Complete usage guide

### Styling
- Updated `/app/frontend/src/App.css` (CSS variables system)
- Updated `/app/frontend/src/index.css` (font imports, root variables)
- Updated `/app/frontend/src/App.js` (routes, ThemeProvider)

## API Contracts

### Theme Endpoints
```
# Public
GET /api/themes/active
Returns: ThemeResponse (active theme)

# Admin Only (requires x-admin-token header)
GET /api/themes
Returns: List[ThemeResponse]

POST /api/themes
Body: ThemeCreate (name, colors, fonts)
Returns: ThemeResponse

PUT /api/themes/{id}
Body: ThemeUpdate (optional fields)
Returns: ThemeResponse

POST /api/themes/{id}/activate
Returns: ThemeResponse (activated theme)

DELETE /api/themes/{id}
Returns: {message: "Theme deleted successfully"}

GET /api/themes/presets/all
Returns: List[ThemeResponse] (3 presets)
```

### Admin Endpoints
```
POST /api/admin/login
Body: {password: string}
Returns: {token: string, message: string}

POST /api/admin/verify
Body: {token: string}
Returns: {valid: boolean, message: string}
```

## Prioritized Backlog

### P0 Features (Completed)
- [✅] Theme customization admin panel
- [✅] Color controls with validation
- [✅] Typography controls
- [✅] Theme presets
- [✅] Preview system
- [✅] Save/activate themes
- [✅] CSS variables implementation
- [✅] Authentication system

### P1 Features (Next Phase)
- [ ] Backend API for contact form submissions
- [ ] MongoDB schema for inquiries
- [ ] Email notification system
- [ ] Replace gradient placeholders with actual images
- [ ] Google Maps integration for contact section

### P2 Features (Enhancement)
- [ ] Theme scheduling (auto-switch by date/time)
- [ ] A/B testing dashboard with analytics
- [ ] Export/Import themes as JSON
- [ ] Theme versioning and rollback
- [ ] Live website preview iframe in admin
- [ ] Accessibility score for color combinations
- [ ] Product detail pages with routing
- [ ] Image lightbox for gallery
- [ ] SEO optimization (meta tags, Open Graph)

### P3 Features (Future)
- [ ] Multi-admin user support with roles
- [ ] Audit logs for theme changes
- [ ] Rate limiting on admin endpoints
- [ ] Session timeout / auto-logout
- [ ] Product search and filtering
- [ ] Multi-language support
- [ ] Blog/News section
- [ ] Newsletter subscription

## Next Tasks
1. **Testing**: Test theme changes across all pages
2. **Documentation**: Share ADMIN_GUIDE.md with client
3. **Security**: Change default admin password in production
4. **Content**: Replace image placeholders with actual photos
5. **Backend**: Implement contact form API
6. **Deployment**: Production deployment with custom domain

## Technical Notes
### Theme System
- **CSS Variables**: 17 customizable properties
- **Fonts**: 5 professional font families
- **Validation**: Prevents unreadable color combinations
- **Performance**: No page reload, instant CSS variable updates
- **Storage**: MongoDB themes collection
- **Auth**: Simple password-based (token in localStorage)

### Current Limitations
- Single admin user (no multi-user support)
- No session timeout (token persists indefinitely)
- No rate limiting on admin endpoints
- Presets cannot be modified (by design)
- Cannot delete active theme (safety feature)

### Environment Variables
```
# Backend
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
ADMIN_PASSWORD=tambe_admin_2024

# Frontend
REACT_APP_BACKEND_URL=https://tambe-engineering.preview.emergentagent.com
```

## Default Theme (Industrial Dark)
```json
{
  "colors": {
    "primary": "#00FFD1",
    "secondary": "#FFFFFF",
    "background": "#000000",
    "background_secondary": "#121212",
    "text_primary": "#FFFFFF",
    "text_secondary": "rgba(255, 255, 255, 0.8)",
    "text_muted": "rgba(255, 255, 255, 0.6)",
    "button_bg": "#00FFD1",
    "button_text": "#000000",
    "button_hover_bg": "#FFFFFF",
    "button_hover_text": "#000000",
    "border": "rgba(255, 255, 255, 0.1)"
  },
  "fonts": {
    "family": "Inter",
    "h1_size": "66px",
    "h2_size": "48px",
    "h3_size": "32px",
    "body_size": "18px",
    "button_size": "18px"
  }
}
```

