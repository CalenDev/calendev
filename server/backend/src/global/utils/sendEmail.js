import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default async (options) => {
  // Create Transport
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER_EMAIL,
      pass: process.env.EMAIL_SENDER_PASSWORD,
    },
  });
  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    html: ` 
                  가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
                  <form action="#" method="POST">
                    <button>가입확인</button> 
                  </form>  
                  `,
  };
  // Send the Email
  await transport.sendMail(mailOptions);
};
