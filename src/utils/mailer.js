const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    pool: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false
    },
    // ⚡ THE FIX: Force IPv4 to avoid ENETUNREACH errors
    family: 4, 
    connectionTimeout: 10000,
    greetingTimeout: 5000,
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"TalentFlow Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log('📧 Email sent successfully via IPv4');
        return info;
    } catch (error) {
        console.error('❌ Nodemailer Error:', error.message);
        throw error; 
    }
};

module.exports = sendEmail;