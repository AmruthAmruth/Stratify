import bcrypt from 'bcryptjs'

export const comparePassword=async(plain:string,hash:string):Promise<boolean>=>{
    return bcrypt.compare(plain,hash)
} 