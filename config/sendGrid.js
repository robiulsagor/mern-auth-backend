import sgMail from "@sendgrid/mail";

const sendMsg = async (data) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    from: "sagor2.me@outlook.com",
    to: data.email,
    subject: data.subject,
    html: data.html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email Sent ");
  } catch (error) {
    console.log("failed ", error);
  }
};

export default sendMsg;
