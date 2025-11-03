import { Company } from "../../domain/entities/Company";
import { RegisterCompanyDTO } from "../dto/company/CreateCompanyDTO";

export class AuthenticationMapper {
  
    
  static toDomainCompany(data: RegisterCompanyDTO, hashedPassword: string): Company {
  return new Company(
    undefined,
    data.name,
    data.email,
    data.phone,
    data.industry,
    data.description ?? "", 
    data.businessRegNo,
    data.address,
    data.city,
    data.state,
    data.country,
    data.zipcode,
    hashedPassword,
   "pending",
    "company",
    data.profileImage,
  );
}

  

  static toResponse(company: Company) {
    return {
      id: company.id,
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
      status: company.status,
      role: company.role,
      profileImage: company.profileImage,
    };
  }
}
