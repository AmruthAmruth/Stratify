export const approveCompanyTemplate = (companyName: string): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Company Registration Approved</title>
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
        color: #28a745;
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
        background: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      .btn:hover {
        background: #218838;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">🎉 Congratulations!</div>
      <div class="content">
        <p>Dear <strong>${companyName} Team</strong>,</p>
        <p>
          We are pleased to inform you that your company registration has been <strong>successfully approved</strong>.  
          You can now access your account and start managing your company with ease through our platform.
        </p>
        <a href="https://stratify.com/login" class="btn">Access Your Account</a>
        <p>
          Welcome aboard, and we look forward to supporting your growth.
        </p>
        <p>Best regards,  
        <br/>The Stratify Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Stratify. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
