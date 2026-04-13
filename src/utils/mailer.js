const { Resend } = require('resend');
require('dotenv').config();

// No need to wrap this in anything, process.env handles it!
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TalentFlow <onboarding@resend.dev>', // Keep this default until you verify a domain
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('📧 Email sent via Resend API:', data.id);
    return data;
  } catch (err) {
    console.error('❌ Resend API Error:', err.message);
    throw err;
  }
};

module.exports = sendEmail;