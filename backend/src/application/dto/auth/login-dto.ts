
export interface LoginDTO{
    email:string;
    password:string;
}


export interface LoginResponseDTO {
  id: string;
  name: string;
  email: string;
  role: "company" | "manager" | "employee";
  token: string;   
}

