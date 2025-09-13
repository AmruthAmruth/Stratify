
export const registerFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "description", label: "Description", type: "text" },
  { name: "businessRegNo", label: "Business Reg. No", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "zipcode", label: "Zip Code", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
  { name: "profileImage", label: "Profile Image", type: "file" },
];

export const loginFields = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];


export const addDepartment = [
  { name: "name", label: "Department Name", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];




export const addMember = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "joiningDate", label: "Joining Date", type: "date" },
  { name: "position", label: "Position", type: "text" },
  { name: "gender", label: "Gender", type: "select", options: ["male", "female", "other"] }
];



export const addManager = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "joiningDate", label: "Joining Date", type: "date" },
  { name: "position", label: "Position", type: "text" },
  { name: "gender", label: "Gender", type: "select", options: ["male", "female", "other"] }
];