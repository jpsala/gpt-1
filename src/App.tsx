import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useState } from 'react';
import './App.css';
import { Box, Button } from '@mui/material';

const API_KEY = "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";

// Define a type for the message object
type Message = {
    message: string;
    sender: string;
    sentTime?: string; // Optional if you want to include sent time
    direction?: 'outgoing' | 'incoming'; // Include if you use direction
};

const App = () => {
    const [inputString, setInputString] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [chatResponse, setChatResponse] = useState<string>("");
    const handleSendRequest = async (text: string) => {

        const newMessage: Message = {
            message: text,
            direction: 'outgoing',
            sender: "user",
        };

        try {
            setLoading(true);
            setChatResponse('');
            const response = await processMessageToChatGPT(newMessage).finally(() => {
                setLoading(false);
            });
            const content = response.choices[0]?.message?.content.replace(/\\n/g, "\n");
            if (content) {
                setChatResponse(content);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    };

    async function processMessageToChatGPT(chatMessage: Message) {
        const role = chatMessage.sender === "ChatGPT" ? "assistant" : "user";
        const apiMessages = [
            { role, content: chatMessage.message }
        ]

        const apiRequestBody = {
            "model": "gpt-4-1106-preview",
            "messages": [
                {
                    role: "system", content: `You help me by fixing my grammer and spelling, make the less posible changes in the text and in the style, don't return any comment, clarification or nothing` },
                ...apiMessages,
            ],
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiRequestBody),
        });

        return response.json();
    }

    return (
        <div className="App">
            <Box sx={{ width: '100vw', height: "100vh", display: "flex", flexDirection: "column" }}>
                <TextareaAutosize
                    disabled={loading}
                    style={{ flex: 1, resize: "none", fontSize: "1.1Rem" }}
                    placeholder="Type your message here"
                    value={inputString}
                    onChange={(e) => setInputString(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                            handleSendRequest(inputString);
                        }
                    }}
                />
                <Button onClick={() => handleSendRequest(inputString)}>Send</Button>
                <Box sx={{ flex: 1, resize: "none", fontSize: "1.1Rem" }}> {/* Response occupies bottom half */}
                    <>{chatResponse.split("\n").map((line, index) => <div key={index}>{line}</div>)}</>
                </Box>
            </Box>
        </div>
    );
};

export default App;
