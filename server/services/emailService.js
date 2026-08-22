import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email,
    name,
    verificationCode
) => {

    try {

        const { data, error } = await resend.emails.send({

            from: "Shortly <onboarding@resend.dev>",

            to: [email],

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
        });

        if (error) {

            console.error(
                "❌ Resend email error:",
                error
            );

            throw new Error(
                error.message || "Failed to send email"
            );
        }

        console.log(
            "✅ Verification email sent successfully:",
            data?.id
        );

        return data;

    } catch (error) {

        console.error(
            "❌ Failed to send verification email:"
        );

        console.error(
            "Error:",
            error.message
        );

        throw error;
    }
};