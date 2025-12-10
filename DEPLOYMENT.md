# Deployment Instructions

## 1. Push to GitHub
1. Create a new repository on GitHub (e.g., `pandiyarajan-platform`).
2. Run the following commands in your terminal (inside the `Pandiyarajan` folder):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pandiyarajan-platform.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy Server (Backend) on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   - `DATABASE_URL`: (Create a PostgreSQL database on Render first, copy the Internal URL)
   - `JWT_SECRET`: (Enter a secure secret key)
   - `PORT`: `5000`

## 3. Deploy Client (Frontend) on Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Settings:
   - **Root Directory**: Click 'Edit' and select `client`.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: (The URL of your deployed Render server, e.g., `https://your-service.onrender.com/api`)
     *Important: Do not include the trailing slash if not needed, but ensure it ends with /api if that's your base path.*

## 4. Final Finalization
- Once both are deployed, testing the live site.
- If you need to run locally again, you will need to install PostgreSQL or revert `server/prisma/schema.prisma` to `sqlite`.

