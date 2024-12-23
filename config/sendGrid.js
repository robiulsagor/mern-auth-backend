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
  } catch (error) {
    console.log("mail send error ", error);
    throw new Error("Failed to send email");
  }
};

export default sendMsg;
