 interface AdminRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN';
  registrationSecret: string;
}

 interface ReverseTransactionRequest {
  reason: string;
}

 interface AuditLog {
  id: string;
  action: string;
  resource?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

 interface AuditLogsResponse {
  auditLogs: AuditLog[];
  total: number;
  pages: number;
  currentPage: number;
}