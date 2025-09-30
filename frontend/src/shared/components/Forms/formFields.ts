
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




export const planFormFields = [
  { name: "plan", label: "Plan Name", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "amount", label: "Amount (₹)", type: "number" },
  { name: "durationInMonths", label: "Duration (Months)", type: "number" },
];



export const rejectionFormFields = [
    {
      name: "reason",
      label: "Rejection Reason",
      type: "textarea",
      placeholder: "Please provide a reason for rejection...",
    }
  ];






export const createProjectFields = [
  { name: "name", label: "Project Name", type: "text" },
  { name: "key", label: "Project Key", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
  {  name: "status",  label: "Status",  type: "select", options: ["Planned", "Active", "Completed", "Archived"] },
  // { 
  //   name: "teamMemberIds", label: "Team Members", type: "multiselect",  options: []  // 🔹 fill with user list dynamically
  // }
];




export const createBacklogsFields=[
  { name: "name", label: "Backlog Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
]






export const createUserStoryFields=[
  { name: "title", label: "Story Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
  {  name: "priority",  label: "Priority",  type: "select", options: ["Low", "Medium", "High"] },
  { name: "storyPoints", label: "Story Points", type: "number" },
  {  name: "status",  label: "Status",  type: "select", options: ["To Do", "In Progress", "Done"] },
  { name: "acceptanceCriteria", label: "Acceptance Criteria", type: "text" },

]


export const createTaskFields=[
  { name: "title", label: "Story Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
  {  name: "status",  label: "Status",  type: "select", options: ["To Do", "In Progress", "Done"] },

]

export const createLeaveFields=[
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  {  name: "type",  label: "Status",  type: "select", options: ["Casual", "Sick", "Earned"] },
 { name: "reason", label: "Reason", type: "text" },
]




export const createRejectLeaveFields=[
  { name: "reason", label: "Reason For Rejection", type: "text" },
 
  
]