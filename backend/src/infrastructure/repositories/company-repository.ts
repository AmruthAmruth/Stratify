import { ICompanyRepository } from "../../domain/repositories/i-company-repository";
import { Company } from "../../domain/entities/company";
import CompanyModel from "../models/company-model";
import mongoose from "mongoose";
import { PaginatedResult } from "../../domain/common/pagination";
import { FilterQuery } from "mongoose";

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
  role: "company"
    });

    return new Company(
       (doc._id as mongoose.Types.ObjectId).toString(),
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
  "company" ,
  doc.profileImage,
    );
  }


async findByEmail(email: string): Promise<Company | null> {
  const doc = await CompanyModel.findOne({ email });
  if (!doc) return null;

  return new Company(
     (doc._id as mongoose.Types.ObjectId).toString(),
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
    "company",
    doc.profileImage,
  )
}
 





  async findByPhone(phone: string): Promise<Company | null> {
  const doc = await CompanyModel.findOne({ phone });
  if (!doc) return null;

  return new Company(
   (doc._id as mongoose.Types.ObjectId).toString(),
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
    "company",
    doc.profileImage,
  );
}

async findById(id: string): Promise<Company | null> {
  const doc = await CompanyModel.findById(id);
  if (!doc) return null;

  return new Company(
    (doc._id as mongoose.Types.ObjectId).toString(),
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
    "company",
    doc.profileImage,
  );
}




async updatePassword(email: string, password: string): Promise<void> {
  await CompanyModel.updateOne(
    { email },                 
    { $set: { password } }     
  );
}

async findPaginated(options: {
  page?: number;
  pageSize?: number;
  cursor?: string;
 filter?: FilterQuery<typeof CompanyModel>;
  sort?: { [key: string]: 1 | -1 };
}): Promise<PaginatedResult<Company>> {
  const {
    page = 1,
    pageSize = 10,
    cursor,
    filter = {},
    sort = { createdAt: -1 },
  } = options;

  if (cursor) {
   const typedFilter: FilterQuery<typeof CompanyModel> = filter;
typedFilter["createdAt"] = { $lt: new Date(cursor) };
    const data = await CompanyModel.find(filter).sort(sort).limit(pageSize);
    return {
      data: data.map(
        (doc) =>
          new Company(
           (doc._id as mongoose.Types.ObjectId).toString(),
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
    "company",
    doc.profileImage,
          )
      ),
      total: data.length,
      page,
      pageSize,
    };
  } else {
    const total = await CompanyModel.countDocuments(filter);
    const data = await CompanyModel.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      data: data.map(
        (doc) =>
          new Company(
           (doc._id as mongoose.Types.ObjectId).toString(),
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
    "company",
    doc.profileImage,
          )
      ),
      total,
      page,
      pageSize,
    };
  }
}
 

async approveCompany(id: string): Promise<void> {
   await CompanyModel.findByIdAndUpdate(id,{status:'approved'},{new:true})
}

async unapproveCompany(id: string): Promise<void> {
  await CompanyModel.findByIdAndUpdate(id,{status:'rejected'},{new:true})
}






}  
