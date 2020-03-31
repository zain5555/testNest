import * as handlebar from 'handlebars';

export default function inviteEmailTemplate(userName: string, inviteeName: string, invitationLink: string): string {
  const emailData: any = {
    userName,
    inviteeName,
    invitationLink,
  };
  
  const emailSource = `
<html>
<body>
<p>Hi {{userName}}!</p>

<p>{{inviteeName}} has invited you to use Touchdown so they can share updates with you! </p>

<p>Touchdown is an app designed to help you and your team keep track of shared goals. Using our online platform, you can:</p>
<ul>
<li>Receive weekly updates</li>
<li>Comment on any update posted</li>
<li>Give feedback on the updates</li>
<li>Start a conversation with your team members</li>
</ul>
<p>Use the button below to set up your account and get started:</p>

<a href={{invitationLink}}>Accept Invite</a>

<p>Please feel free to reply to this email for any questions and feedback!</p>
<p>Thank you!</p>
</body>
</html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
