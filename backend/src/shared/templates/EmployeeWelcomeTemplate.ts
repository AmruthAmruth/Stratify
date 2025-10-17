export const employeeWelcomeTemplate = (
  employeeName: string,
  companyName: string,
  departmentName: string,
  position: string,
  tempPassword: string,
): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to ${companyName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #28a745; padding: 20px; text-align: center; color: #fff; font-size: 22px; font-weight: bold;">
                  👋 Welcome to ${companyName}!
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 30px; color: #333; font-size: 15px; line-height: 1.6;">
                  <p>Dear <strong>${employeeName}</strong>,</p>
                  <p>
                    We’re thrilled to welcome you to <strong>${companyName}</strong>!  
                    You’ve officially joined the <strong>${departmentName}</strong> department  
                    as our new <strong>${position}</strong>.
                  </p>
                  <p>
                    Your account has been created. Please use the following  
                    temporary password to log in:
                  </p>
                  <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border: 1px dashed #ccc; text-align: center; font-size: 16px;">
                    <strong>Temporary Password:</strong><br/>
                    <span style="font-size: 18px; color: #d6336c;">${tempPassword}</span>
                  </div>
                  <p>
                    🔒 For security reasons, please change this password immediately  
                    after logging in.
                  </p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="https://stratify.com/login"
                       style="background-color: #28a745; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px; display: inline-block;">
                      Login to Your Account
                    </a>
                  </p>
                  <p>
                    We look forward to working with you and wish you success in your journey here.  
                  </p>
                  <p>
                    Best regards,<br/>
                    ${companyName} HR Team
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f3f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                  © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
