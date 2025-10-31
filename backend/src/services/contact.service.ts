import prisma from '../config/prisma-client';
import { CreateContactDto } from '../dtos/contact.dto';

export class ContactService {
  static async createContact(userId: string, data: CreateContactDto) {
    let transactionId = null;

    if (data.transactionRefId) {
      const transaction = await prisma.transaction.findUnique({
        where: { refId: data.transactionRefId },
        include: { account: true }
      });

      if (transaction && transaction.account.userId === userId) {
        transactionId = transaction.id;
      }
    }

    const contact = await prisma.contact.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        transactionId,
        status: 'OPEN'
      },
      include: {
        transaction: {
          select: { refId: true, type: true, amount: true, createdAt: true }
        }
      }
    });

    return {
      id: contact.id,
      title: contact.title,
      message: contact.message,
      status: contact.status,
      transaction: contact.transaction,
      createdAt: contact.createdAt
    };
  }

  static async getUserContacts(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(limit, 100);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: { userId },
        include: {
          transaction: {
            select: { refId: true, type: true, amount: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: maxLimit
      }),
      prisma.contact.count({ where: { userId } })
    ]);

    const pages = Math.ceil(total / maxLimit);

    return {
      contacts: contacts.map(contact => ({
        id: contact.id,
        title: contact.title,
        message: contact.message,
        status: contact.status,
        transaction: contact.transaction,
        createdAt: contact.createdAt
      })),
      total,
      pages,
      currentPage: page
    };
  }

  static async getAllContacts(page: number = 1, limit: number = 10, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(limit, 100);
    
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: whereClause,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }
          },
          transaction: {
            select: { refId: true, type: true, amount: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: maxLimit
      }),
      prisma.contact.count({ where: whereClause })
    ]);

    const pages = Math.ceil(total / maxLimit);

    return {
      contacts: contacts.map(contact => ({
        id: contact.id,
        title: contact.title,
        message: contact.message,
        status: contact.status,
        user: contact.user,
        transaction: contact.transaction,
        createdAt: contact.createdAt
      })),
      total,
      pages,
      currentPage: page
    };
  }

  static async updateContactStatus(contactId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') {
    return await prisma.contact.update({
      where: { id: contactId },
      data: { status }
    });
  }

  static async replyToContact(contactId: string, adminId: string, message: string) {
    const reply = await prisma.contactReply.create({
      data: {
        contactId,
        adminId,
        message
      },
      include: {
        admin: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    return {
      id: reply.id,
      message: reply.message,
      admin: reply.admin,
      createdAt: reply.createdAt
    };
  }

  static async getContactReplies(contactId: string) {
    const replies = await prisma.contactReply.findMany({
      where: { contactId },
      include: {
        admin: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return replies.map(reply => ({
      id: reply.id,
      message: reply.message,
      admin: reply.admin,
      createdAt: reply.createdAt
    }));
  }
}