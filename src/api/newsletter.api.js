export const subscribeNewsletter = async (email, recaptchaToken) => {
    const payload = { email };

    if (recaptchaToken) {
        payload.recaptchaToken = recaptchaToken;
    }

    const res = await fetch(`https://sdlserver.hyplap.com/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    
    const data = await res.json();

    console.log(data);

    if (!data.success) {
        throw new Error(data.message);
    }
    return data;
}