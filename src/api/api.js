const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;
const URL = import.meta.env.VITE_OPENROUTER_URL;

export async function postMessage(messageHistory) {
    try {
        const answer = await fetch(URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messageHistory,
                stream: false,
            }),
        });
        const data = await answer.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.log('API error: ', error);
        return {};
    }
}
