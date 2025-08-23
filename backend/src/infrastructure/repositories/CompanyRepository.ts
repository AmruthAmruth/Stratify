import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { Company } from "../../domain/entities/Company";
import CompanyModel from "../models/CompanyModel";
import mongoose from "mongoose";

export class companyRepository implements ICompanyRepository {
  async create(company: Company): Promise<Company> {
    const doc = await CompanyModel.create({
      name: company.name,
      email: company.email,
      phone: company.phone,
      industry: company.industry,
      description: company.description,
      businessRegNo: company.businessRegNo,
      address: company.address,
      city: company.city,
      state: company.state,
      country: company.country,
      zipcode: company.zipcode,
      password: company.password,
      status: company.status,
      profileImage: company.profileImage,
      role: company.role
    });

    return new Company(
      doc.name,
      doc.email,
      doc.phone,
      doc.industry,
      doc.description || "",
      doc.businessRegNo,
      doc.address,
      doc.city,
      doc.state,
      doc.country,
      doc.zipcode,
      doc.password,
      doc.status,
      doc.profileImage,
      (doc._id as mongoose.Types.ObjectId).toString(),
      doc.role as "company" | "manager" | "employee"
    );
  }
async findByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: "company" | "manager" | "employee";
  } | null> {
    const user = await CompanyModel.findOne({ email });
    if (!user) return null;

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  async findByPhone(phone: string): Promise<Company | null> {
  const doc = await CompanyModel.findOne({ phone });
  if (!doc) return null;

  return new Company(
    doc.name,
    doc.email,
    doc.phone,
    doc.industry,
    doc.description || "",
    doc.businessRegNo,
    doc.address,
    doc.city,
    doc.state,
    doc.country,
    doc.zipcode,
    doc.password,
    doc.status,
    doc.profileImage,
    (doc._id as mongoose.Types.ObjectId).toString()
  );
}

async findById(id: string): Promise<Company | null> {
  const doc = await CompanyModel.findById(id);
  if (!doc) return null;

  return new Company(
    doc.name,
    doc.email,
    doc.phone,
    doc.industry,
    doc.description || "",
    doc.businessRegNo,
    doc.address,
    doc.city,
    doc.state,
    doc.country,
    doc.zipcode,
    doc.password,
    doc.status,
    doc.profileImage,
    (doc._id as mongoose.Types.ObjectId).toString()
  );
}


async findAll(): Promise<Company[]> {
  return await CompanyModel.find();
}


async updatePassword(email: string, password: string): Promise<void> {
  await CompanyModel.updateOne(
    { email },                 
    { $set: { password } }     
  );
}
 
} 
