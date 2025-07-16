# PostgreSQL Setup for RedConnect

## Prerequisites

1. Install PostgreSQL on your system:
   - **Windows**: Download from https://www.postgresql.org/download/windows/
   - **macOS**: Use Homebrew: `brew install postgresql`
   - **Linux**: Use package manager: `sudo apt-get install postgresql postgresql-contrib`

## Database Setup

1. **Start PostgreSQL service**:
   ```bash
   # Windows (if installed as service, it should start automatically)
   # macOS with Homebrew
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Create database and user**:
   ```bash
   # Connect to PostgreSQL as superuser
   sudo -u postgres psql
   
   # Or on Windows, use psql command directly
   psql -U postgres
   ```

3. **Run the following SQL commands**:
   ```sql
   -- Create database
   CREATE DATABASE redconnect_db;
   
   -- Create user (optional, you can use postgres user)
   CREATE USER redconnect_user WITH PASSWORD 'your_secure_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE redconnect_db TO redconnect_user;
   
   -- Exit
   \q
   ```

4. **Import the database schema**:
   ```bash
   # Navigate to the project directory
   cd d:\RedConnect
   
   # Import schema using psql
   psql -U postgres -d redconnect_db -f database/schema.sql
   
   # Or if using custom user
   psql -U redconnect_user -d redconnect_db -f database/schema.sql
   ```

## Environment Configuration

1. **Create `.env` file in the root directory**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your database credentials**:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=redconnect_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Admin Credentials
   ADMIN_EMAIL=admin@redconnect.org
   ADMIN_PASSWORD=admin123
   ```

## Verify Setup

1. **Test database connection**:
   ```bash
   # Connect to verify everything is working
   psql -U postgres -d redconnect_db -c "SELECT * FROM blood_groups;"
   ```

2. **Start the application**:
   ```bash
   # Install dependencies
   npm install
   
   # Run both frontend and backend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api/health
   - Admin Panel: http://localhost:3000/admin/login

## Default Admin Credentials

- **Email**: admin@redconnect.org
- **Password**: admin123

**⚠️ Important**: Change the default admin credentials in production!

## Database Structure

The database includes the following main tables:
- `blood_groups` - Blood type definitions (A+, A-, B+, etc.)
- `donors` - Registered blood donors
- `blood_requests` - Blood requirement requests
- `contact_messages` - Contact form submissions
- `admin_users` - Admin user accounts
- `donations` - Donation tracking records

## Troubleshooting

1. **Connection Issues**:
   - Ensure PostgreSQL service is running
   - Check if the port 5432 is available
   - Verify database credentials in `.env`

2. **Schema Import Issues**:
   - Make sure the database exists before importing
   - Check file path for `database/schema.sql`
   - Ensure proper user permissions

3. **Permission Issues**:
   - Grant necessary privileges to the database user
   - Check PostgreSQL authentication configuration (`pg_hba.conf`)

## Production Deployment

For production deployment:
1. Use environment variables for sensitive data
2. Set up SSL/TLS for database connections
3. Configure proper backup strategies
4. Use connection pooling for better performance
5. Monitor database performance and logs
