import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMsg = async (data) => {
  const msg = {
    from: "sagor2.me@outlook.com",
    to: data.email,
    subject: data.subject,
    html: data.html,
  };

  try {
    await sgMail.send(msg);
    console.log("successss");
  } catch (error) {
    console.log("failed");
  }
};

// sendMsg("robiul100.me@gmail.com", "Test mail by send grid");
export default sendMsg;
