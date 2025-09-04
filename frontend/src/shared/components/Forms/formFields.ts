
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


export const addDepartmentWithManagerFields = [
  { name: "departmentName", label: "Department Name", type: "text" },
  { name: "departmentDescription", label: "Description", type: "textarea" },
  { name: "departmentStatus", label: "Status", type: "select", options: ["active", "inactive"] },
  { name: "managerName", label: "Manager Name", type: "text" },
  { name: "managerEmail", label: "Manager Email", type: "email" },
  { name: "managerPhone", label: "Manager Phone", type: "tel" },
  { name: "managerJoiningDate", label: "Joining Date", type: "date" },
  { name: "managerProfileImage", label: "Profile Image", type: "file" },
];




export const addMemberFields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "position", label: "Position", type: "text" },
  { name: "status", label: "Status", type: "select", options: ["active", "inactive", "suspended"] },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "joinDate", label: "Joining Date", type: "date" },
  { name: "avatar", label: "Profile Image", type: "file" },
];