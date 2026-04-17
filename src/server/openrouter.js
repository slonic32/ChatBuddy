const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL;
const URL = process.env.OPENROUTER_URL;

export async function sendQuestion(messageHistory) {
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
        return 'Connection error. Please repeat your question.';
    }
}
