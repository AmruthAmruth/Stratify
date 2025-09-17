export const unapproveCompanyTemplate = (companyName: string): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Company Registration Not Approved</title>
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
        color: #d9534f;
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
        background: #d9534f;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      .btn:hover {
        background: #c9302c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Registration Not Approved</div>
      <div class="content">
        <p>Dear <strong>${companyName} Team</strong>,</p>
        <p>
          We regret to inform you that your company registration has not been approved at this time.  
          This decision may be due to incomplete information, eligibility requirements, or other verification criteria.
        </p>
        <p>
          If you believe this was a mistake or would like to reapply, please review the requirements and submit the necessary details through our platform.
        </p>
        <p>Thank you for your interest in Stratify. We appreciate your understanding.</p>
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
