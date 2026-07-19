import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import {
  IGetSuperAdminDashboardStatsUseCase,
  SuperAdminDashboardStatsResponse,
} from "../../interfaces/super-admin/IGetSuperAdminDashboardStatsUseCase";

export class GetSuperAdminDashboardStats implements IGetSuperAdminDashboardStatsUseCase {
    constructor(
        private companyRepository: ICompanyRepository,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(): Promise<SuperAdminDashboardStatsResponse> {
    
        const totalCompaniesResult = await this.companyRepository.findPaginated({ pageSize: 1, filter: {} });
        const totalCompanies = totalCompaniesResult.total;

        const approvedCompaniesResult = await this.companyRepository.findPaginated({ pageSize: 1, filter: { status: "approved" } });
        const approvedCompanies = approvedCompaniesResult.total;

        const pendingCompaniesResult = await this.companyRepository.findPaginated({ pageSize: 1, filter: { status: "pending" } });
        const pendingCompanies = pendingCompaniesResult.total;

        const rejectedCompaniesResult = await this.companyRepository.findPaginated({ pageSize: 1, filter: { status: "rejected" } });
        const rejectedCompanies = rejectedCompaniesResult.total;

       
        const allSubscriptions = await this.subscriptionRepository.listAllPlan();
        const activeSubscriptions = allSubscriptions.filter(sub => sub.status === "active" || sub.status === "trial").length;

    
        const totalRevenue = allSubscriptions.reduce((acc, sub) => acc + (sub.amount || 0), 0);

       
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = allSubscriptions
            .filter(sub => {
                const date = new Date(sub.startDate);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((acc, sub) => acc + (sub.amount || 0), 0);

      
        const planCounts: Record<string, number> = {};
        allSubscriptions.forEach(sub => {
            const planName = sub.plan || "Unknown";
            planCounts[planName] = (planCounts[planName] || 0) + 1;
        });

       
        const revenueTrend: Record<string, number> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            revenueTrend[monthKey] = 0;
        }

        allSubscriptions.forEach(sub => {
            const date = new Date(sub.startDate);
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (revenueTrend[monthKey] !== undefined) {
                revenueTrend[monthKey] += (sub.amount || 0);
            }
        });

        return {
            stats: {
                totalCompanies,
                approvedCompanies,
                pendingCompanies,
                rejectedCompanies,
                activeSubscriptions,
                totalRevenue,
                monthlyRevenue
            },
            graphs: {
                companiesByStatus: {
                    labels: ["Approved", "Pending", "Rejected"],
                    data: [
                        approvedCompanies ?? 0,
                        pendingCompanies ?? 0,
                        rejectedCompanies ?? 0,
                    ]
                },
                subscriptionsByPlan: {
                    labels: Object.keys(planCounts),
                    data: Object.values(planCounts)
                },
                revenueTrend: {
                    labels: Object.keys(revenueTrend),
                    data: Object.values(revenueTrend)
                }
            }
        };
    }
}
