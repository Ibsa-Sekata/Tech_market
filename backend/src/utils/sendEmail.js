import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: EMAIL_SECURE === "true",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    return transporter;
}

export async function sendEmail({ to, subject, html }) {
    const tx = getTransporter();

    if (!tx) {
        console.warn("Email transport not configured. Skipping email send.");
        return;
    }

    await tx.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    });
}
