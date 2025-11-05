# Cloudflare Pages Deployment Guide

## Project Structure Issue

Your project has both `backend` and `client` folders. Cloudflare Pages is designed for static sites (frontend only), so you need to configure it to build only the `client` folder.

## Step-by-Step Configuration for Cloudflare Pages

### 1. Connect Your Repository
- Go to Cloudflare Dashboard → Pages
- Click **Create a project** → **Connect to Git**
- Select your repository: `Udit-jpg/collegeelections`
- Click **Begin setup**

### 2. Build Configuration Settings

Use these **exact settings** in Cloudflare Pages:

| Setting | Value |
|---------|-------|
| **Project name** | `collegeelections` (or your choice) |
| **Production branch** | `main` |
| **Framework preset** | **None** (don't select React/Vite) |
| **Build command** | `cd client && npm install && npm run build` |
| **Build output directory** | `client/dist` |
| **Root directory (advanced)** | Leave empty or set to `/` |

### 3. Environment Variables

Add this environment variable in Cloudflare Pages:

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://collegeelections.onrender.com` |

**How to add:**
- After creating the project, go to **Settings** → **Environment variables**
- Click **Add variable**
- Production and Preview environments should both have this variable

### 4. Node.js Version (Optional but Recommended)

Add another environment variable to specify Node.js version:

| Variable Name | Value |
|--------------|-------|
| `NODE_VERSION` | `18` or `20` |

## Why This Configuration?

### ❌ Common Mistakes:
1. **Selecting "Vite" or "React" preset** - This fails because:
   - Cloudflare expects the project root to contain `package.json`
   - Your `package.json` is in the `client` subfolder
   - The preset doesn't know to navigate to `client` first

2. **Wrong build output directory** - Must be `client/dist`, not just `dist`

### ✅ Correct Approach:
- **Framework preset: None** - We manually specify the build command
- **Build command with `cd client`** - Navigates to the correct folder first
- **Output directory: `client/dist`** - Points to where Vite outputs files

## Alternative: Monorepo Configuration

If you want to use the Vite preset, you can use Cloudflare's **Root directory** setting:

| Setting | Value |
|---------|-------|
| **Framework preset** | `Vite` |
| **Root directory** | `client` |
| **Build command** | `npm run build` (automatically set) |
| **Build output directory** | `dist` (automatically set) |

**Note:** Root directory is under **Advanced settings** during setup.

## Backend Deployment

Remember: **Cloudflare Pages only hosts your frontend.** Your backend needs to stay on Render.com (or similar).

### Current Setup:
- **Frontend**: Cloudflare Pages → `https://your-site.pages.dev`
- **Backend**: Render.com → `https://collegeelections.onrender.com`

### Update CORS After Deployment:

Once your Cloudflare Pages site is live, update your backend's `FRONTEND_ORIGIN` environment variable on Render:

```
FRONTEND_ORIGIN=https://your-site.pages.dev
```

## Troubleshooting

### Build Fails with "Cannot find package.json"
- Make sure build command starts with `cd client`
- Or set **Root directory** to `client`

### Build Succeeds but Site Shows Blank Page
- Check browser console for API errors
- Verify `VITE_API_URL` environment variable is set in Cloudflare
- Check that backend CORS allows your Cloudflare domain

### API Calls Fail (CORS Error)
- Update `FRONTEND_ORIGIN` on your Render backend to match Cloudflare URL
- Format: `https://your-project.pages.dev` (no trailing slash)

### Build Command Times Out
- Consider using `npm ci` instead of `npm install` for faster builds:
  ```
  cd client && npm ci && npm run build
  ```

## Complete Build Settings Summary

```yaml
Framework preset: None
Build command: cd client && npm install && npm run build
Build output directory: client/dist
Root directory: (leave empty)

Environment Variables:
  VITE_API_URL: https://collegeelections.onrender.com
  NODE_VERSION: 18
```

## After Deployment

1. Your site will be available at: `https://your-project.pages.dev`
2. You can add a custom domain in Cloudflare Pages settings
3. Update backend CORS to allow the new domain
4. Test login and all API functionality

---

Need help with any step? Let me know!
