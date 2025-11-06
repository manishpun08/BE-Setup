export const generateContactEmailHTML = (
  name: string,
  phone: string,
  message: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Submission</title>
      <style>
        /* Ensure proper rendering on various email clients */
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            margin: auto !important;
          }
          .btn {
            width: 100% !important;
            margin-top: 10px !important;
          }
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0;">
      <table class="container" style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
          <td align="center" bgcolor="#007bff" style="border-radius: 8px 8px 0 0; padding: 10px;">
            <h1 style="color: #fff; margin: 0;">New Contact Submission</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <p>Hello Admin,</p>
            <p>You have received a new contact submission with the following details:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p>Best regards,</p>
            <p>Luxe Design</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
