 interface CreateContactRequest {
  title: string;
  message: string;
  transactionRefId?: string;
}

 interface Contact {
  id: string;
  title: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  transaction?: {
    refId: string;
    type: string;
    amount: string;
  };
  createdAt: string;
}

 interface ContactReply {
  id: string;
  message: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

 interface ContactsResponse {
  contacts: Contact[];
  total: number;
  pages: number;
  currentPage: number;
}