import printMessage from './chat';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;
const URL = import.meta.env.VITE_OPENROUTER_URL;

export default async function sendMessage(root, msg) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: msg }],
                stream: true,
            }),
        });

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        let answer = '';

        let isFirstChunk = true; //flag for first chunk

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Append new chunk to buffer
                buffer += decoder.decode(value, { stream: true });

                // Process complete lines from buffer
                while (true) {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd === -1) break;

                    const line = buffer.slice(0, lineEnd).trim();
                    buffer = buffer.slice(lineEnd + 1);

                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content || '';
                            if (content) {
                                if (isFirstChunk) {
                                    isFirstChunk = false;
                                    printMessage(root, { role: 'ai', text: content }, true); // Print first chunk
                                } else {
                                    printMessage(root, { role: 'ai', text: content }, false); // Append  chunks to the same message
                                }

                                answer += content;
                            }
                        } catch (e) {
                            // Ignore invalid JSON
                            console.log('Error: ', e);
                        }
                    }
                }
            }
        } finally {
            reader.cancel();
        }
        return answer.trim();
    } catch (error) {
        console.log('Error: ', error);
        return 'Connection error. Please try again later.';
    }
}
