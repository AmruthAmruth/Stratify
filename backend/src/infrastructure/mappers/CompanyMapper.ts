import { Types } from "mongoose";
import { Company } from "../../domain/entities/Company";
import { ICompanyDoc } from "../models/CompanyModel";

export class CompanyMapper {
  static toEntity(doc: ICompanyDoc): Company {
    return new Company(
      (doc._id as Types.ObjectId).toString(),
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

  static toDocument(entity: Company): Partial<ICompanyDoc> {
    return {
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      industry: entity.industry,
      description: entity.description,
      businessRegNo: entity.businessRegNo,
      address: entity.address,
      city: entity.city,
      state: entity.state,
      country: entity.country,
      zipcode: entity.zipcode,
      password: entity.password,
      status: entity.status,
      role: entity.role,
      profileImage: entity.profileImage,
    };
  }

  static toEntities(docs: ICompanyDoc[]): Company[] {
    return docs.map((d) => this.toEntity(d));
  }
}
