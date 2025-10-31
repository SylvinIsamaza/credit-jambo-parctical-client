import { Router } from "express";
import { SavingsController } from "../controllers/savings.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { auditMiddleware } from "../middleware/audit.middleware";
import { TransactionDto } from "../dtos/transaction.dto";
import { TransactionPinDto } from "../dtos/transaction-pin.dto";

const router: Router = Router();

router.use(authenticateToken);

router.post(
  "/transactions/:id/confirm",
  validationMiddleware(TransactionPinDto),
  auditMiddleware("CONFIRM_TRANSACTION", "SAVINGS"),
  SavingsController.confirmTransaction
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Confirm pending transaction with PIN'
   #swagger.description = 'Confirm a pending deposit or withdrawal transaction by providing the transaction PIN. Required for PIN-protected accounts.'
   #swagger.parameters['body'] = {
     in: 'body',
     schema: { $ref: '#/definitions/TransactionPinDto' }
   }
    }] */
);

router.post(
  "/transactions/:id/cancel",
  SavingsController.cancelTransaction
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Cancel pending transaction'
   #swagger.description = 'Cancel a pending transaction before it expires. Only works for transactions in PENDING status.'
    }] */
);

router.post(
  "/deposit",
  validationMiddleware(TransactionDto),
  auditMiddleware("DEPOSIT", "SAVINGS"),
  SavingsController.deposit
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Make a deposit'
   #swagger.description = 'Add money to customer savings account. If PIN is enabled, creates pending transaction requiring confirmation.'
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/TransactionDto' } }
    }] */
);

router.post(
  "/withdraw",
  validationMiddleware(TransactionDto),
  auditMiddleware("WITHDRAW", "SAVINGS"),
  SavingsController.withdraw
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Make a withdrawal'
   #swagger.description = 'Withdraw money from customer savings account. Checks for sufficient balance and sends email if insufficient funds.'
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/TransactionDto' } }
    }] */
);

router.get(
  "/balance",
  auditMiddleware("VIEW_BALANCE", "SAVINGS"),
  SavingsController.getBalance
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Get account balance'
   #swagger.description = 'Retrieve current account balance and customer information for the authenticated user.'
    }] */
);

router.get(
  "/transactions",
  auditMiddleware("VIEW_TRANSACTIONS", "SAVINGS"),
  SavingsController.getTransactionHistory
  /* #swagger.tags = ['Savings']
   #swagger.summary = 'Get transaction history with pagination'
   #swagger.description = 'Retrieve paginated list of all transactions (deposits, withdrawals, reversals) for the customer account.'
   #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Page number (default: 1)' }
   #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Items per page (default: 10, max: 100)' }
    }] */
);

export default router;
