import bcrypt from 'bcryptjs'

export const comparePassword=async(plain:string,hash:string):Promise<boolean>=>{
    return bcrypt.compare(plain,hash)
} 



const SALT_ROUNDS = 10;

export const hashPassword=async(password: string): Promise<string>=> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}