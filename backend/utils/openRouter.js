import "dotenv/config";

const getOpenROuterResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "openrouter/auto",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 5000
        })
    };

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            options
        );

        const data = await response.json();

        console.log("OpenRouter response:", data);

        if (!response.ok) {
            throw new Error(data.error?.message || "OpenRouter request failed");
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.log("OpenRouter error:", err);
        throw err;
    }
};

export default getOpenROuterResponse;