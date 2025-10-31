import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authenticateToken } from "../middleware/auth.middleware";
import { auditMiddleware } from "../middleware/audit.middleware";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { RefreshTokenDto } from "../dtos/refresh.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "../dtos/password.dto";

const router: Router = Router();

router.post(
  "/register",
  validationMiddleware(RegisterDto),
  AuthController.register
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Register a new customer'
   #swagger.description = 'Create a new customer account with email, password, and personal information'
     #swagger.security = [
      
    ]
  
   
   */
);

router.post(
  "/login",
  validationMiddleware(LoginDto),
  AuthController.login
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Login customer'
   #swagger.description = 'Authenticate customer with email and password. Returns access token and refresh token for API access.'
   
   #swagger.security = [
      
    ]
   */
);

router.post(
  "/refresh-token",
  validationMiddleware(RefreshTokenDto),
  AuthController.refreshToken
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Refresh access token'
   #swagger.description = 'Generate a new access token using a valid refresh token. Used to maintain session without re-login.' */
);

router.post(
  "/forgot-password",
  validationMiddleware(ForgotPasswordDto),
  AuthController.forgotPassword
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Forgot password'
   #swagger.description = 'Send password reset email to customer. Generates a secure reset token sent via email.'
   #swagger.security = [
      
    ]
   */
);

router.post(
  "/reset-password",
  validationMiddleware(ResetPasswordDto),
  AuthController.resetPassword
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Reset password'
   #swagger.description = 'Reset customer password using the token received via email. Requires new password confirmation.' 
   #swagger.security = [
      
    ]
   */
);

router.post(
  "/logout",
  authenticateToken,
  auditMiddleware("LOGOUT"),
  AuthController.logout
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Logout customer'
   #swagger.description = 'Logout customer and invalidate current session. Clears authentication tokens and logs audit trail.'
    }] */
);

router.get(
  "/devices",
  authenticateToken,
  auditMiddleware("VIEW_DEVICES"),
  AuthController.getDevices
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Get customer devices'
   #swagger.description = 'Retrieve list of all devices that have accessed this customer account. Shows device info and verification status.'
    }] */
);

router.get(
  "/sessions",
  authenticateToken,
  auditMiddleware("VIEW_SESSIONS"),
  AuthController.getActiveSessions
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Get active sessions'
   #swagger.description = 'View all currently active login sessions for this customer account across different devices.'
    }] */
);

router.delete(
  "/sessions",
  authenticateToken,
  auditMiddleware("REVOKE_ALL_SESSIONS"),
  AuthController.revokeAllSessions
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Revoke all other sessions'
   #swagger.description = 'Terminate all other active sessions except the current one. Useful for security when device is compromised.'
    }] */
);

router.delete(
  "/sessions/:sessionId",
  authenticateToken,
  auditMiddleware("REVOKE_SESSION"),
  AuthController.revokeSession
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Revoke specific session'
   #swagger.description = 'Terminate a specific active session by session ID. Logs out that particular device/browser.'
    }] */
);

router.post(
  "/devices/:deviceId/verify",
  authenticateToken,
  auditMiddleware("VERIFY_DEVICE"),
  AuthController.verifyDevice
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Verify device'
   #swagger.description = 'Mark a device as trusted/verified for this customer account. Reduces future security prompts.'
    }] */
);

router.get(
  "/profile",
  authenticateToken,
  AuthController.getProfile
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Get user profile'
   #swagger.description = 'Get the profile information of the currently logged in user'
    }] */
);

router.post(
  "/change-password",
  authenticateToken,
  auditMiddleware("CHANGE_PASSWORD"),
  AuthController.changePassword
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Change password'
   #swagger.description = 'Change user password with current password verification'
    }] */
);

router.post(
  "/change-email",
  authenticateToken,
  auditMiddleware("CHANGE_EMAIL"),
  AuthController.changeEmail
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Change email'
   #swagger.description = 'Change user email with password verification'
    }] */
);

router.post(
  "/verify-email",
  AuthController.verifyEmail
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Verify email'
   #swagger.description = 'Verify user email with OTP'
    }] */
);

router.post(
  "/resend-verification",
  AuthController.resendVerification
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Resend verification'
   #swagger.description = 'Resend email verification OTP'
    }] */
);

router.post(
  "/validate-withdrawal",
  authenticateToken,
  AuthController.validateWithdrawal
  /* #swagger.tags = ['Authentication']
   #swagger.summary = 'Validate withdrawal'
   #swagger.description = 'Validate withdrawal with PIN or password'
    }] */
);

export default router;
