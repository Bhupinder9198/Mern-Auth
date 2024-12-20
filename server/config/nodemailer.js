import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host : 'smtp-relay.brevo.com',
  port: 587,
  auth:{
    user:  process.env.SMTP_USER,
    pass:  process.env.SMTP_PASS

  }
})



export default transporter;

transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Transporter Error:', error);
    } else {
        console.log('SMTP Transporter is ready to send emails');
    }
});
