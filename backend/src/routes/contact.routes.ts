import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { auditMiddleware } from "../middleware/audit.middleware";
import { CreateContactDto } from "../dtos/contact.dto";

const router: Router = Router();

router.use(authenticateToken);

router.post(
  "/",
  validationMiddleware(CreateContactDto),
  auditMiddleware("CREATE_CONTACT", "SUPPORT"),
  ContactController.createContact
  /* #swagger.tags = ['Contact']
   #swagger.summary = 'Create contact message'
   #swagger.description = 'Submit a support request or inquiry. Can be linked to a specific transaction for context.'
    }] */
);

router.get(
  "/my-contacts",
  ContactController.getUserContacts
  /* #swagger.tags = ['Contact']
   #swagger.summary = 'Get user contacts'
   #swagger.description = 'Retrieve paginated list of all contact messages submitted by the authenticated customer.'
   #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Page number (default: 1)' }
   #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Items per page (default: 10, max: 100)' }
    }] */
);



router.get(
  "/:id/replies",
  ContactController.getContactReplies
  /* #swagger.tags = ['Contact']
   #swagger.summary = 'Get contact replies'
   #swagger.description = 'Retrieve all replies for a specific contact message.'
    }] */
);

export default router;
