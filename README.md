# Kosha Backend API

Backend API for Kosha Personal Finance Application, built with Node.js, TypeScript, Express, MongoDB, PostgreSQL, and Redis.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Database & app configuration
│   ├── middleware/          # Auth & error handling
│   ├── types/               # Common TypeScript types
│   ├── models/
│   │   ├── postgres/        # PostgreSQL entities (TypeORM)
│   │   └── mongodb/         # MongoDB schemas (Mongoose)
│   ├── repositories/        # Data access layer
│   │   ├── postgres/        # PostgreSQL repositories
│   │   └── mongodb/         # MongoDB repositories
│   ├── services/            # Business logic layer
│   ├── controllers/         # HTTP request handlers
│   └── routes/              # API route definitions
├── tests/                   # Test files
├── package.json
└── tsconfig.json
```

## 🗄️ Database Architecture

- **PostgreSQL**: Users, Sessions, Investments, Payments
- **MongoDB**: Bills, Expenses, Income, Notifications
- **Redis**: Caching, Session tokens

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/link-gmail` - Link Gmail account

### Bills
- `GET /api/v1/bills` - List bills (with filters & pagination)
- `GET /api/v1/bills/upcoming` - Get upcoming bills
- `GET /api/v1/bills/recurring-suggestions` - Get recurring suggestions
- `POST /api/v1/bills` - Create/update bill
- `POST /api/v1/bills/import` - Import bills from Gmail/SMS
- `PATCH /api/v1/bills/:billId/paid` - Mark bill as paid

### Expenses
- `GET /api/v1/expenses` - List expenses (with filters & pagination)
- `GET /api/v1/expenses/summary` - Get expense summary
- `POST /api/v1/expenses` - Add expense
- `POST /api/v1/expenses/import` - Import expenses
- `PATCH /api/v1/expenses/:expenseId` - Update expense
- `DELETE /api/v1/expenses/:expenseId` - Delete expense

### Income
- `GET /api/v1/income` - List income records
- `GET /api/v1/income/summary` - Get income summary
- `POST /api/v1/income` - Add income
- `POST /api/v1/income/import` - Import income from Gmail
- `PATCH /api/v1/income/:incomeId` - Update income
- `DELETE /api/v1/income/:incomeId` - Delete income

### Investments
- `GET /api/v1/investments` - List investments
- `GET /api/v1/investments/summary` - Get portfolio summary
- `GET /api/v1/investments/:assetId/price` - Get live price
- `GET /api/v1/investments/:assetId/history` - Get price history
- `GET /api/v1/investments/:assetId/transactions` - Get transaction history
- `POST /api/v1/investments/assets` - Add asset
- `POST /api/v1/investments/transactions` - Add transaction
- `PATCH /api/v1/investments/assets/:assetId` - Update asset
- `PATCH /api/v1/investments/transactions/:transactionId` - Update transaction
- `DELETE /api/v1/investments/transactions/:transactionId` - Delete transaction

### Payments
- `GET /api/v1/payments` - List payments
- `GET /api/v1/payments/accounts` - List UPI accounts
- `GET /api/v1/payments/mandates` - List mandates
- `GET /api/v1/payments/:paymentId` - Get payment status
- `POST /api/v1/payments/link-upi` - Link UPI account
- `POST /api/v1/payments/mandates` - Create autopay mandate
- `POST /api/v1/payments/bills/:billId` - Pay bill
- `PATCH /api/v1/payments/mandates/:mandateId` - Update mandate

### Notifications
- `GET /api/v1/notifications` - List notifications
- `GET /api/v1/notifications/preferences` - Get preferences
- `POST /api/v1/notifications` - Schedule notification
- `POST /api/v1/notifications/preferences` - Update preferences
- `POST /api/v1/notifications/:notificationId/send` - Send notification

### Dashboard
- `GET /api/v1/dashboard/summary` - Get financial summary
- `GET /api/v1/dashboard/health-metrics` - Get health metrics
- `GET /api/v1/dashboard/trends` - Get trends

## 🔧 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 Code Generation Status

✅ All modules generated:
- ✅ Authentication (PostgreSQL)
- ✅ Bill Management (MongoDB)
- ✅ Expense Management (MongoDB)
- ✅ Income Tracking (MongoDB)
- ✅ Investment Monitoring (PostgreSQL)
- ✅ Payments (PostgreSQL)
- ✅ Notifications (MongoDB)
- ✅ Dashboard (Aggregates)

Total: **56 TypeScript files** generated

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet for security headers
- Input validation (to be implemented with Zod)

## 🚀 Deployment

### Quick Start with Docker Compose

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start all services (PostgreSQL, MongoDB, Redis, Backend)
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop services
npm run docker:compose:down
```

### Manual Deployment

1. **Build the application**:
   ```bash
   npm install
   npm run build
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Railway
- Render
- AWS (EC2/ECS/EKS)
- DigitalOcean
- Heroku

## 📚 Next Steps

1. Install dependencies: `npm install`
2. Set up databases (MongoDB, PostgreSQL, Redis)
3. Configure environment variables
4. Run database migrations (TypeORM)
5. Start development server
6. Test API endpoints

## 📖 Documentation

See `kosha/spec/` for complete specifications:
- Requirements: `01-requirements/`
- Architecture: `03-architecture/`
- Design: `04-design/`
- Backend Specs: `06-backend/features/`

