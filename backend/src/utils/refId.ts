export class RefIdGenerator {
  static generateTransactionRefId(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN${timestamp}${random}`;
  }
}