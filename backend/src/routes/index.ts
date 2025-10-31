import { Router } from "express";
import authRoutes from "./auth.routes";
import savingsRoutes from "./savings.routes";

import userRoutes from "./user.routes";

import securityRoutes from "./security.routes";

import contactRoutes from "./contact.routes";
import notificationRoutes from "./notification.routes";

const router: Router = Router();

router.use(
  "/auth",
  authRoutes
  /*
    #swagger.tags = ['Authentication']
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  */
);

router.use(
  "/savings",
  savingsRoutes
  /*
    #swagger.tags = ['Savings']
      #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  
     }]
  */
);

router.use(
  "/users",
  userRoutes
  /*
    #swagger.tags = ['User Management']
     }]
       #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  */
);

router.use(
  "/security",
  securityRoutes
  /*
    #swagger.tags = ['Security']
      #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  */
);

// notification
router.use(
  "/notifications",
  notificationRoutes
  /*
    #swagger.tags = ['Notification']
       #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  */
);

router.use(
  "/contact",
  contactRoutes
  /*
    #swagger.tags = ['Contact']
       #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
  */
);

export default router;
