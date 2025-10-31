import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { auditMiddleware } from "../middleware/audit.middleware";
import { UpdateProfileDto } from "../dtos/user-profile.dto";

const router: Router = Router();

router.use(authenticateToken);

router.put(
  "/profile",
  validationMiddleware(UpdateProfileDto),
  auditMiddleware("UPDATE_PROFILE", "USER"),
  UserController.updateProfile
  /* #swagger.tags = ['User Management']
   #swagger.summary = 'Update user profile'
   #swagger.description = 'Update customer profile information including name, phone, and other personal details.'
    }] */
);

router.post(
  "/profile/image",
  UserController.uploadMiddleware,
  auditMiddleware("UPLOAD_PROFILE_IMAGE", "USER"),
  UserController.uploadProfileImage
  /* #swagger.tags = ['User Management']
   #swagger.summary = 'Upload profile image'
   #swagger.description = 'Upload and set customer profile picture. Accepts image files and stores them securely.'
    }] */
);

router.get(
  "/profile/image-url",
  UserController.getProfileImageUrl
  /* #swagger.tags = ['User Management']
   #swagger.summary = 'Get profile image URL'
   #swagger.description = 'Retrieve the URL of the customer profile image for display purposes.'
    }] */
);




export default router;
