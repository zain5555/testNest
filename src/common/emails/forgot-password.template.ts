import * as handlebar from 'handlebars';

export default function forgotPasswordEmailTemplate(userName: string, resetPasswordLink: string): string {
  const emailData: any = {
    userName,
    resetPasswordLink,
  };
  
  const emailSource = `
<html>
<body>
<p>Dear {{userName}},</p>

<p>We have received your request about resetting your password, please click on the link below to reset your password:</p>

<a href={{resetPasswordLink}}>Reset Password</a>

<p>If you didn't initiate password reset request, then ignore this email!</p>
<p>If there are any questions, please email us at <a href='mailto:support@trytouchdown.com'>support@trytouchdown.com</a></p>

<p>Thank you!</p>

</body>
</html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
