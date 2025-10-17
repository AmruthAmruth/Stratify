export const leaveStatusTemplate = (
  employeeName: string,
  leaveStart: Date,
  leaveEnd: Date,
  status: "Approved" | "Rejected",
  reason?: string,
): string => {
  const isRejected = status === "Rejected";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Leave ${status}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: ${
                  isRejected ? "#dc3545" : "#28a745"
                }; padding: 20px; text-align: center; color: #fff; font-size: 22px; font-weight: bold;">
                  📝 Leave ${status}
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 30px; color: #333; font-size: 15px; line-height: 1.6;">
                  <p>Dear <strong>${employeeName}</strong>,</p>
                  <p>
                    Your leave request from <strong>${leaveStart.toDateString()}</strong> to <strong>${leaveEnd.toDateString()}</strong> has been <strong>${status}</strong>.
                  </p>
                  
                  ${
                    isRejected && reason
                      ? `<p><strong>Reason for rejection:</strong> ${reason}</p>`
                      : ""
                  }
                  
                  <p>
                    Please contact your manager or HR if you have any questions regarding your leave status.
                  </p>

                  <p style="text-align: center; margin: 30px 0;">
                    <a href="https://stratify.com/login"
                       style="background-color: ${
                         isRejected ? "#dc3545" : "#28a745"
                       }; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px; display: inline-block;">
                      Login to Portal
                    </a>
                  </p>

                  <p>
                    Best regards,<br/>
                    Stratify HR Team
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f3f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                  © ${new Date().getFullYear()} Stratify. All rights reserved.
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
