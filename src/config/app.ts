import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initializeDatabases } from './database';
import { setupSwagger } from './swagger';
import authRoutes from '../routes/authentication/auth.routes';
import billRoutes from '../routes/bills/bill.routes';
import expenseRoutes from '../routes/expenses/expense.routes';
import incomeRoutes from '../routes/income/income.routes';
import investmentRoutes from '../routes/investments/investment.routes';
import paymentRoutes from '../routes/payments/payment.routes';
import notificationRoutes from '../routes/notifications/notification.routes';
import dashboardRoutes from '../routes/dashboard/dashboard.routes';
import { errorHandler } from '../middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Setup Swagger UI (only in non-production environments)
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  return app;
}

export async function startServer(): Promise<void> {
  const app = createApp();
  const port = process.env.PORT || 3000;

  // Initialize databases
  await initializeDatabases();

  // Register routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/bills', billRoutes);
  app.use('/api/v1/expenses', expenseRoutes);
  app.use('/api/v1/income', incomeRoutes);
  app.use('/api/v1/investments', investmentRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

