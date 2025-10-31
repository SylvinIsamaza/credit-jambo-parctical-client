import prisma from '../config/prisma-client';

export class AccountUtils {
  private static readonly BANK_IDENTIFIER = process.env.BANK_IDENTIFIER || '5730';

  static async generateAccountNumber(): Promise<string> {
    let accountNumber: string;
    let isUnique = false;

    while (!isUnique) {
      const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      
      accountNumber = `${this.BANK_IDENTIFIER}${randomDigits}`;

      const existingAccount = await prisma.account.findUnique({
        where: { accountNumber }
      });

      if (!existingAccount) {
        isUnique = true;
      }
    }

    return accountNumber!;
  }

  static validateAccountNumber(accountNumber: string): boolean {
    return accountNumber.startsWith(this.BANK_IDENTIFIER) && accountNumber.length === 16;
  }

  static getBankIdentifier(): string {
    return this.BANK_IDENTIFIER;
  }

  static getBankName(): string {
    return process.env.BANK_NAME || 'Credit Jambo';
  }
}