 interface TransactionRequest {
  amount: number;
}

 interface Transaction {
  id: string;
  refId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'REVERSAL';
  amount: string;
  createdAt: string;
  status?: string;
  reversedReason?: string;
}

 interface Balance {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: string;
  isVerified: boolean;
  createdAt: string;
}

 interface TransactionHistory {
  transactions: Transaction[];
  total: number;
  pages: number;
}