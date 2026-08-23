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

        const response = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    service_id: serviceId,

                    template_id: templateId,

                    user_id: publicKey,

                    template_params: {
                        to_email: email,
                        email: email,
                        name: name,
                        verification_code:
                            verificationCode,
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

        return true;

    } catch (error) {
        console.error(
            "❌ Failed to send verification email:"
        );

        console.error(error);

        throw error;
    }
};

// IMPORTANT: named export
export { sendVerificationEmail };