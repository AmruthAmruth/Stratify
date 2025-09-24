

export class Sprint {
  constructor(
    public id: string | undefined,                  
    public name: string,                           
    public projectId: string,                      
    public startDate: Date,                        
    public endDate: Date,                           
    public goal?: string,                           
    public status: "Planned" | "Active" | "Completed" = "Planned",  
    public createdAt?: Date,                       
    public updatedAt?: Date                         
  ) {}
}