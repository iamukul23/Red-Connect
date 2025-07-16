# RedConnect - Blood Donation Management System

A modern, full-stack Blood Donation Management System that connects donors to recipients directly through an intuitive web platform with comprehensive admin controls.

## 🩸 About

RedConnect is a comprehensive blood donation management system built with modern web technologies to streamline the process of connecting blood donors with those in need. Our platform eliminates traditional barriers and creates direct connections between life-savers and life-receivers, while providing powerful administrative tools for management.

## ✨ Features

### 🌐 Public Features
- **🏠 Modern Home Page**: Beautiful hero section with carousel showcasing blood donation impact
- **💉 Donor Registration**: Easy-to-use form for registering as a blood donor
- **🔍 Search Donors**: Advanced search functionality to find donors by blood group and location
- **🆘 Emergency Requests**: Quick blood requirement submission for urgent needs
- **📚 Educational Content**: Information about why blood donation matters
- **📞 Contact System**: Multiple ways to get in touch for support
- **📱 Responsive Design**: Mobile-first design that works on all devices

### 🔐 Admin Panel Features
- **📊 Dashboard**: Comprehensive overview with statistics and recent activity
- **👥 Donor Management**: View, search, and manage all registered donors
- **🩸 Blood Request Management**: Handle and track blood requirements with priority levels
- **💬 Message Management**: Respond to contact form submissions
- **📈 Analytics & Reports**: Blood group distribution and donation trends
- **🔒 Secure Authentication**: JWT-based admin authentication

### 🎨 Design Features
- **Gradient Backgrounds**: Beautiful primary color gradients
- **Smooth Animations**: Page transitions and component animations using Framer Motion
- **Mobile Responsive**: Optimized for all screen sizes
- **Accessibility**: Built with accessibility best practices
- **Modern Typography**: Clean, readable fonts with proper hierarchy

## 🛠 Technology Stack

### Frontend
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for utility-first styling
- **React Router DOM** for navigation
- **Heroicons** for beautiful SVG icons
- **Framer Motion** for smooth animations
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with advanced queries
- **JWT** authentication for admin security
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database
- **PostgreSQL** with optimized schema
- **Automated timestamps** and triggers
- **Indexed queries** for performance
- **Data validation** and constraints

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL (version 12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/sarthakroutray/RedConnect.git
cd RedConnect
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up PostgreSQL database**:
   - Follow the detailed instructions in [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)
   - Create database and import schema
   - Configure environment variables

4. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start the application**:
```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run server  # Backend only
npm start       # Frontend only
```

6. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:5001/api/health
   - **Admin Panel**: http://localhost:3000/admin/login

### Available Scripts

- `npm run dev` - Runs both frontend and backend concurrently
- `npm start` - Runs the React app in development mode
- `npm run server` - Runs the backend API server
- `npm run dev:server` - Runs backend with nodemon for auto-restart
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation component
│   ├── Footer.js       # Footer component
│   ├── ProtectedRoute.js # Route protection
│   └── admin/          # Admin-specific components
│       ├── AdminLayout.js
│       └── AdminSidebar.js
├── pages/              # Page components
│   ├── Home.js         # Landing page with hero section
│   ├── DonateBlood.js  # Donor registration form
│   ├── SearchBlood.js  # Search donors functionality
│   ├── NeedBlood.js    # Blood requirement form
│   ├── WhyDonate.js    # Educational content
│   ├── AboutUs.js      # About page (featuring Sarthak Routray)
│   ├── ContactUs.js    # Contact form
│   └── admin/          # Admin pages
│       ├── AdminLogin.js
│       └── AdminDashboard.js
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── services/           # API services
│   └── api.js          # API client configuration
├── App.js              # Main app component with routing
├── index.js            # Entry point
└── index.css           # Global styles and Tailwind imports

server/
├── index.js            # Express server with all API endpoints
└── ...

database/
├── schema.sql          # PostgreSQL database schema
└── ...
```

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: admin@redconnect.org
- **Password**: admin123

**⚠️ Important**: Change these credentials in production!

### Admin Features
- **Dashboard**: Real-time statistics and activity overview
- **Donor Management**: Complete CRUD operations for donors
- **Request Management**: Handle blood requests with urgency levels
- **Communication**: Manage contact form submissions
- **Analytics**: Blood group distribution and trends

## 🗄️ Database Schema

Key tables include:
- `donors` - Registered blood donors with contact information
- `blood_requests` - Blood requirement requests with urgency levels
- `blood_groups` - Blood type definitions (A+, A-, B+, etc.)
- `contact_messages` - Contact form submissions
- `admin_users` - Administrative user accounts
- `donations` - Donation history tracking

## 🔗 API Endpoints

### Public Endpoints
- `POST /api/donors` - Register new donor
- `GET /api/donors/search` - Search donors
- `POST /api/blood-requests` - Submit blood request
- `POST /api/contact` - Send contact message
- `GET /api/blood-groups` - Get blood group list

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/donors` - Get all donors
- `GET /api/admin/blood-requests` - Get all requests
- `PUT /api/admin/blood-requests/:id` - Update request status
- `GET /api/admin/contact-messages` - Get all messages

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
1. Set up PostgreSQL database on your server
2. Configure environment variables
3. Deploy the server code
4. Set up process manager (PM2 recommended)

### Environment Variables
```env
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=redconnect_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## 🤝 Contributing

We welcome contributions to improve RedConnect! Please feel free to submit issues and enhancement requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 About the Developer

**Sarthak Routray** - Founder & CEO  
Passionate about leveraging technology to save lives and create meaningful connections between donors and recipients.

## 🙏 Acknowledgments

- Built with Create React App
- Icons by Heroicons
- Animations by Framer Motion
- Styling by Tailwind CSS
- Database powered by PostgreSQL

## 📞 Support

For support or questions, please contact:
- **Email**: support@redconnect.org
- **Emergency Helpline**: +1-800-BLOOD-NOW
- **Admin Panel**: http://localhost:3000/admin/login

## 🔧 Development

### Setting up Development Environment
1. Follow installation instructions above
2. Set `NODE_ENV=development` in `.env`
3. Use `npm run dev` for hot reloading
4. Backend runs on port 5000, frontend on port 3000

### Database Development
- Use `npm run dev:server` for auto-restart on changes
- PostgreSQL runs on default port 5432
- Schema changes should be documented in `database/schema.sql`

---

**Save Lives. Donate Blood. Be a Hero.** ❤️

*Built with ❤️ by Sarthak Routray to make blood donation accessible and efficient for everyone.*
