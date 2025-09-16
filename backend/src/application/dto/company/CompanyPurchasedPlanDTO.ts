export interface PurchasePlanDTO {
  companyName: string;              
  plan: string;                 
  validityInMonths: number;         
  amount: number;                   
  startDate: Date;                  
  endDate: Date;                  
  transactionId?: string;          
  status?: "active" | "expired" | "pending"; 
}