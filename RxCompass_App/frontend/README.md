# RxCompass.AI Frontend

A modern, responsive medical diagnostics frontend built with React, TypeScript, and Tailwind CSS.

##  Features

- **Neon Theme System**: Toggle between neon-dark and neon-blue themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **File Upload**: CSV file upload for patient data analysis
- **Real-time Results**: Live prediction results with feature importance analysis

##  Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod

##  Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on configurable URL

##  Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RxCompass.AI/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and set your backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

##  Environment Configuration

The app uses environment variables for configuration:

- `VITE_API_URL`: Your backend API URL (default: `http://localhost:5000`)

### For Different Environments

**Development:**
```bash
VITE_API_URL=http://localhost:5000
```

**Production:**
```bash
VITE_API_URL=https://your-backend-api.com
```

**Staging:**
```bash
VITE_API_URL=https://staging-api.yourapp.com
```

##  Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options

The app can be deployed to any static hosting service:

- **Vercel**: Connect your repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **AWS S3 + CloudFront**: Upload the `dist` folder to S3

##  Responsive Design

The app is fully responsive and works on:
-  Desktop (1200px+)
-  Laptop (768px - 1199px)
-  Tablet (480px - 767px)
-  Mobile (< 480px)

##  Theme System

The app includes two neon themes:

- **neon-dark**: Dark black background with cyan/magenta/teal accents
- **neon-blue**: Soft blue-gray background with blue/cyan accents

Themes are applied automatically and can be toggled via the theme switcher.

##  Troubleshooting

### Common Issues

**Backend Connection Error**
```
Error: Failed to process the file
```
- Ensure your backend is running
- Check the `VITE_API_URL` in your `.env` file
- Verify CORS is configured on your backend

**Build Errors**
```bash
npm run build
```
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

**Development Server Issues**
```bash
npm run dev
```
- Check if port 8080 is available
- Try a different port: `npm run dev -- --port 3000`

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are met
3. Verify your environment variables are set correctly
4. Create an issue with detailed information about your setup

##  Development Setup

For a complete development experience:

1. **Backend Setup**: Ensure your backend API is running
2. **Environment Setup**: Copy `.env.example` to `.env`
3. **Install Dependencies**: `npm install`
4. **Start Development**: `npm run dev`

## Automatic Setup

git clone <your-repo-url>
cd RxCompass.AI-/RxCompass_App/frontend
npm run setup    
npm run dev

The app will automatically start with the neon-dark theme and connect to your configured backend.
