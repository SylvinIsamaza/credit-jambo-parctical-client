import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import prisma from "./config/prisma-client";
import { TransactionCleanupService } from './services/transaction-cleanup.service';
import { FileService } from './services/file.service';
import errorHandler from './middleware/error.middleware';
import { NotificationService } from './services/notification.service';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10000, 
  message: 'Too many requests from this IP'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/v1', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});



app.listen(PORT, () => {
   prisma.$connect().then(async () => {
    console.log("Connected to database")
 
    NotificationService.initialize();
    console.log("Notification service with queue initialized");
        try {
      await FileService.initializeBucket();
      console.log("MinIO bucket initialized");
    } catch (error) {
      console.warn("MinIO initialization failed, continuing without file storage");
    }
    TransactionCleanupService.startCleanupScheduler();
    console.log("Transaction cleanup scheduler started");
  }).catch((err => {
  console.log("Connection to database failed", err);
  })
  )
});