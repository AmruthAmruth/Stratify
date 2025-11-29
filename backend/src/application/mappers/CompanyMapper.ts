import { Company } from "../../domain/entities/Company";

export class CompanyMapper {

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

    static toListResponse(companies: Company[]) {
        return companies.map((company) => this.toResponse(company));
    }

    static toProfileResponse(company: Company) {
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
            profileImage: company.profileImage,
        };
    }
}
