import * as handlebar from 'handlebars';

export default function signUpEmailTemplate(userName: string, email: string, companyName: string): string {
  const emailData: any = {
    userName,
    email,
    companyName,
  };
  
  const emailSource = `
<html>
<body>
<p>Hello {{userName}},</p>
<p>Thanks for signing up on OfficeTours. Your account creation has been successful!</p>
<p>Your account details are as follows:</p>
<p>Email: {{email}}</p>
<p>Company: {{companyName}}</p>

<p>Thank you!</p>
</body>
</html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
