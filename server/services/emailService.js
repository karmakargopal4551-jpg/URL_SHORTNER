import nodemailer from "nodemailer";

// =========================================
// ENVIRONMENT VALIDATION
// =========================================

if (!process.env.EMAIL_USER) {
    console.error("❌ EMAIL_USER is missing");
}

if (!process.env.EMAIL_APP_PASSWORD) {
    console.error("❌ EMAIL_APP_PASSWORD is missing");
}


// =========================================
// CREATE EMAIL TRANSPORTER
// =========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },

    tls: {
        rejectUnauthorized: true,
    },
});


// =========================================
// VERIFY SMTP CONNECTION
// =========================================

transporter.verify((error, success) => {

    if (error) {

        console.error(
            "❌ Gmail SMTP connection failed:"
        );

        console.error(error);

    } else {

        console.log(
            "✅ Gmail SMTP connection successful"
        );

    }

});


// =========================================
// SEND VERIFICATION EMAIL
// =========================================

export const sendVerificationEmail = async (
    email,
    name,
    verificationCode
) => {

    try {

        // -----------------------------------------
        // Validate environment variables
        // -----------------------------------------

        if (!process.env.EMAIL_USER) {

            throw new Error(
                "EMAIL_USER environment variable is missing"
            );

        }

        if (!process.env.EMAIL_APP_PASSWORD) {

            throw new Error(
                "EMAIL_APP_PASSWORD environment variable is missing"
            );

        }


        // -----------------------------------------
        // Mail options
        // -----------------------------------------

        const mailOptions = {

            from: `"Shortly" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Verify your Shortly account",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #f8f9fc;
                ">

                    <div style="
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                        border: 1px solid #e5e7eb;
                    ">

                        <h2 style="
                            color: #635bff;
                            margin-bottom: 10px;
                        ">
                            Welcome to Shortly 🚀
                        </h2>


                        <p>
                            Hello ${name},
                        </p>


                        <p>
                            Thank you for creating your
                            Shortly account.
                        </p>


                        <p>
                            Use the verification code below
                            to verify your email address:
                        </p>


                        <div style="
                            background: #f1f0ff;
                            padding: 20px;
                            text-align: center;
                            border-radius: 10px;
                            margin: 25px 0;
                        ">

                            <span style="
                                font-size: 32px;
                                font-weight: bold;
                                letter-spacing: 8px;
                                color: #635bff;
                            ">
                                ${verificationCode}
                            </span>

                        </div>


                        <p>
                            This code will expire in
                            <strong>10 minutes</strong>.
                        </p>


                        <p>
                            If you did not create this
                            account, you can safely ignore
                            this email.
                        </p>


                        <hr style="
                            border: none;
                            border-top: 1px solid #eee;
                            margin: 25px 0;
                        ">


                        <p style="
                            color: #888;
                            font-size: 12px;
                        ">
                            Shortly - URL Shortener
                        </p>

                    </div>

                </div>
            `,
        };


        // -----------------------------------------
        // Send email
        // -----------------------------------------

        const info = await transporter.sendMail(
            mailOptions
        );


        console.log(
            "✅ Verification email sent successfully"
        );

        console.log(
            "Message ID:",
            info.messageId
        );


        return info;


    } catch (error) {

        // -----------------------------------------
        // Detailed error logging
        // -----------------------------------------

        console.error(
            "❌ Failed to send verification email"
        );

        console.error(
            "Error code:",
            error.code
        );

        console.error(
            "Error command:",
            error.command
        );

        console.error(
            "Error response:",
            error.response
        );

        console.error(
            "Error message:",
            error.message
        );


        throw error;
    }
};