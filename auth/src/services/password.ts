import bcrypt from 'bcryptjs';

export class Password {
  static async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async compare(suppliedpassword: string, storedpassword: string) {
    return await bcrypt.compare(suppliedpassword, storedpassword);
  }
}
