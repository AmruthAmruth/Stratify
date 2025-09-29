

export const LEAVE_POLICY: Record<string, {
  monthlyQuota: number | null;     
  annualQuota: number | null;      
  carryForward: boolean;           
  accrual?: number;                
}> = {
  Casual: { monthlyQuota: 2, annualQuota: 12, carryForward: false },
  Sick:   { monthlyQuota: 2, annualQuota: 12, carryForward: false },
  Earned: { monthlyQuota: null, annualQuota: 18, carryForward: true, accrual: 1.5 },
  Unpaid: { monthlyQuota: null, annualQuota: null, carryForward: false }
};