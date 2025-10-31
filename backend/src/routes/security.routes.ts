import { Router } from "express";
import { SecurityController } from "../controllers/security.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { VerifyOtpDto, GenerateOtpDto } from "../dtos/otp.dto";

const router: Router = Router();

router.use(authenticateToken);


router.post(
  "/otp/generate",
  validationMiddleware(GenerateOtpDto),
  SecurityController.generateOtp
  /* #swagger.tags = ['Security']
   #swagger.summary = 'Generate OTP'
   #swagger.description = 'Generate and send One-Time Password via email for additional security verification.'
    }] */
);

router.post(
  "/otp/verify",
  validationMiddleware(VerifyOtpDto),
  SecurityController.verifyOtp
  /* #swagger.tags = ['Security']
   #swagger.summary = 'Verify OTP'
   #swagger.description = 'Verify the One-Time Password received via email. Required for sensitive operations.'
    }] */
);


export default router;
