import { protectedApi } from '@/lib/axios';

export const contactService = {
  async createContact(data: CreateContactRequest): Promise<Contact> {
    const response = await protectedApi.post('/contact', data);
    return response.data.data;
  },

  async getUserContacts(page = 1, limit = 10): Promise<ContactsResponse> {
    const response = await protectedApi.get('/contact/my-contacts', {
      params: { page, limit }
    });
    return response.data.data;
  },

  async getAllContacts(
    page = 1, 
    limit = 10, 
    status?: string, 
    search?: string
  ): Promise<ContactsResponse> {
    const response = await protectedApi.get('/contacts/all', {
      params: { page, limit, status, search }
    });
    return response.data.data;
  },

  async updateContactStatus(
    contactId: string, 
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  ): Promise<void> {
    await protectedApi.patch(`/contacts/${contactId}/status`, { status });
  },

  async replyToContact(contactId: string, message: string): Promise<ContactReply> {
    const response = await protectedApi.post(`/contacts/${contactId}/reply`, { message });
    return response.data.data;
  },

  async getContactReplies(contactId: string): Promise<ContactReply[]> {
    const response = await protectedApi.get(`/contacts/${contactId}/replies`);
    return response.data.data;
  },
};