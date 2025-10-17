export function subscriptionConfirmationTemplate(
  companyName: string,
  planName: string,
  amount: number,
  startDate: Date,
  endDate: Date,
): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Subscription Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9fafb; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <tr>
        <td style="background-color: #2563eb; color: #fff; padding: 20px; text-align: center;">
          <h2>Subscription Activated 🎉</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p>Dear <strong>${companyName} Team</strong>,</p>
          <p>We’re excited to inform you that your subscription has been successfully activated.</p>
          <table width="100%" cellpadding="5" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
            <tr style="background-color: #f3f4f6;">
              <td><strong>Plan</strong></td>
              <td>${planName}</td>
            </tr>
            <tr>
              <td><strong>Amount Paid</strong></td>
              <td>₹${amount}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td><strong>Start Date</strong></td>
              <td>${startDate.toDateString()}</td>
            </tr>
            <tr>
              <td><strong>End Date</strong></td>
              <td>${endDate.toDateString()}</td>
            </tr>
          </table>
          <p>You can now enjoy all the premium features of Stratify. 🚀</p>
          <p>If you have any questions, our support team is here to help.</p>
          <p style="margin-top: 30px;">Best regards,</p>
          <p><strong>The Stratify Team</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #6b7280;">
          &copy; ${new Date().getFullYear()} Stratify. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
