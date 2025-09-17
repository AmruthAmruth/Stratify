export const departmentManagerAssignedTemplate = (
  managerName: string,
  departmentName: string,
  companyName: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>New Department Assignment</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        font-size: 20px;
        font-weight: bold;
        color: #007bff;
        margin-bottom: 20px;
      }
      .content {
        font-size: 14px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        margin-top: 25px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
      .btn {
        display: inline-block;
        margin-top: 15px;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      .btn:hover {
        background: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">📢 New Department Assignment</div>
      <div class="content">
        <p>Dear <strong>${managerName}</strong>,</p>
        <p>
          Congratulations! You have been assigned as the <strong>Manager</strong>  
          of the <strong>${departmentName}</strong> department at <strong>${companyName}</strong>.
        </p>
        <p>
          As a Manager, you can now oversee your department, assign tasks, and collaborate with your team effectively.
        </p>
        <a href="https://stratify.com/login" class="btn">Access Your Dashboard</a>
        <p>
          Best regards,<br/>
          ${companyName} HR Team
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
