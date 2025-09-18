


export interface IUnapproveCompany{
    execute(id:string,reason:string):Promise<void>
}