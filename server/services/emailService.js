import "dotenv/config";

const sendVerificationEmail = async (
    email,
    name,
    verificationCode
) => {
    try {
        const serviceId =
            process.env.EMAILJS_SERVICE_ID;

        const templateId =
            process.env.EMAILJS_TEMPLATE_ID;

        const publicKey =
            process.env.EMAILJS_PUBLIC_KEY;

        const privateKey =
            process.env.EMAILJS_PRIVATE_KEY;

        const frontendUrl =
            process.env.FRONTEND_URL;

        if (!serviceId) {
            throw new Error(
                "EMAILJS_SERVICE_ID is missing"
            );
        }

        if (!templateId) {
            throw new Error(
                "EMAILJS_TEMPLATE_ID is missing"
            );
        }

        if (!publicKey) {
            throw new Error(
                "EMAILJS_PUBLIC_KEY is missing"
            );
        }

        if (!privateKey) {
            throw new Error(
                "EMAILJS_PRIVATE_KEY is missing"
            );
        }

        if (!frontendUrl) {
            throw new Error(
                "FRONTEND_URL is missing"
            );
        }

        // Remove trailing slash
        const cleanFrontendUrl =
            frontendUrl.replace(/\/$/, "");

        // URL that will open the React verification page
        const verificationLink =
            `${cleanFrontendUrl}/verify-email?email=${encodeURIComponent(
                email
            )}&code=${encodeURIComponent(
                verificationCode
            )}`;

        const response = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    service_id: serviceId,

                    template_id: templateId,

                    user_id: publicKey,

                    // EmailJS private key
                    accessToken: privateKey,

                    template_params: {
                        to_email: email,

                        email: email,

                        name: name,

                        verification_code:
                            verificationCode,

                        verification_link:
                            verificationLink,
                    },
                }),
            }
        );

        const result =
            await response.text();

        if (!response.ok) {
            console.error(
                "❌ EmailJS error:",
                result
            );

            throw new Error(
                `EmailJS request failed: ${response.status} ${result}`
            );
        }

        console.log(
            `✅ Verification email sent to ${email}`
        );

        console.log(
            `🔗 Verification link: ${verificationLink}`
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Failed to send verification email:"
        );

        console.error(error);

        throw error;
    }
};

export {
    sendVerificationEmail,
};