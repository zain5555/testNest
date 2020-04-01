import * as handlebar from 'handlebars';

export default function newTouchdownEmailTemplate(receiverName: string, touchdownCreator: string, companyName: string, touchdownLink: string): string {
  const emailData: any = {
    receiverName,
    touchdownCreator,
    companyName,
    touchdownLink,
  };
  
  const emailSource = `
    <html>
    <body>

    <p>Hello {{receiverName}},</p>

    <p>{{touchdownCreator}} from {{companyName}} recently created a new Touchdown for your team members!</p>

    <p>To view the Touchdown, please click on the link below:</p>
    <a href={{touchdownLink}}> View Touchdown </a>

    <p>In case you have any questions, please feel free to reply to this email!</p>
    <p>Thank you!</p>
    </body>
    </html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
