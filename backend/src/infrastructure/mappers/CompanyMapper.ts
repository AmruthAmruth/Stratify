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
      doc.profileImage
    );
  }

  static toEntities(docs: ICompanyDoc[]): Company[] {
    return docs.map((d) => this.toEntity(d));
  }
}
