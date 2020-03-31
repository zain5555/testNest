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
<p>Thanks for signing up on Touchdown. Your account creation has been successful!</p>
<p>Touchdown is an app designed to help you and your team keep track of shared goals. Using our online platform, you can:</p>
<ul>
<li>Receive weekly updates</li>
<li>Comment on any update posted</li>
<li>Give feedback on the updates</li>
<li>Start a conversation with your team members</li>
</ul>
<p>At Touchdown, we believe in teamwork and collaboration to better organize team communication. </p>
<p>Your account details are as follows:</p>
<p>Email: {{email}}</p>
<p>Company: {{companyName}}</p>

<p>We hope you enjoy using Touchdown and never have to miss out on group updates ever again! Please feel free to reply to this email for any questions and feedback!</p>
<p>Thank you!</p>
</body>
</html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
