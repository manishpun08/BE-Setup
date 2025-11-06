export const generateServiceNotificationEmail = (
  name: string,
  email: string,
  serviceName: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Service Notification</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
        }
        .btn {
          background-color: #f0d2da;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin-top: 10px;
        }
        .footer {
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <table class="container" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <h2 style="margin: 0; color: #1C2734;">Service Notification</h2>
          </td>
        </tr>
        <tr>
          <td>
            <p>Dear ${name},</p>
            <p>We are excited to inform you that <strong>${serviceName}</strong> is now available for your account associated with <strong>${email}</strong>.</p>
            <p>If you have any questions, feel free to reach out to our team.</p>
            <p>Best regards,<br><strong>LuxeDesign</strong></p>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p>You're receiving this email because you signed up for updates from LuxDesign.</p>
            <p><a href="" style="color: #999999; text-decoration: underline;">Unsubscribe</a> | LuxeDesign, Dubai, UAE</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
