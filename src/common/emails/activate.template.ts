import * as handlebar from 'handlebars';

export default function activateEmailTemplate(userName: string, activationLink: string): string {
  const emailData: any = {
    userName,
    activationLink,
  };
  
  const emailSource = `
<html>
<body>
<p>Dear {{userName}},</p>

<p>To complete your registration, and confirmation of your email address at Touchdown, please click on the link below to activate your account:</p>
<a href={{activationLink}}>Activate Account</a>

<p>Through this verification, your account details remain secured with just the Touchdown team.</p>
<p>If there are any questions, please email us at <a href='mailto:support@trytouchdown.com'>support@trytouchdown.com</a></p>

<p>Thank you!</p>

</body>
</html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
