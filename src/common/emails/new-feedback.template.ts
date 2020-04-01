import * as handlebar from 'handlebars';

export default function newFeedbackEmailTemplate(receiverName: string, companyName: string, touchdownLink: string): string {
  const emailData: any = {
    receiverName,
    companyName,
    touchdownLink,
  };
  
  const emailSource = `
    <html>
    <body>
    <p>Hello {{receiverName}},</p>

    <p>Someone recently left a feedback on your touchdown for {{companyName}}.</p>

    <p>To view the comment, please click on the link below:</p>

    <a href={{touchdownLink}}>View Touchdown</a>

    <p>Please feel free to reply to this email for any questions and feedback!</p>
    <p>Thank you!</p>

    </body>
    </html>`;
  
  const compiledEmail: HandlebarsTemplateDelegate = handlebar.compile(emailSource);
  return compiledEmail(emailData);
}
