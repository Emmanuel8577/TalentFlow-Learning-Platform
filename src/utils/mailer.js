const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    pool: true, // Use pooled connections for better performance in containers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false // Prevents handshake timeouts
    },
    connectionTimeout: 10000, // 10 seconds
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
        console.log('📧 Email sent successfully!');
        return info;
    } catch (error) {
        console.error('❌ Nodemailer Error:', error.message);
        throw error; 
    }
};

module.exports = sendEmail;