import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green("Welcome to Chatbot!"));
    console.log(colors.bold.green("You Can Start From Now ..."));

    const chatHistory = []; // Store history of chat

    while (true) {
        const userInput = readlineSync.question(colors.yellow("You: "));

        // Check for exit condition BEFORE calling OpenAI API
        if (userInput.toLowerCase() === 'exit') {
            console.log(colors.bold.green("Bot: ") + "Goodbye!");
            return;
        }

        try {
            // Construct messages by iterating over history
            const messages = chatHistory.map(({ role, content }) => ({ role, content }));

            // Add latest user input
            messages.push({ role: 'user', content: userInput });

            // Call the API with user input
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
            });

            // Get completion text/content
            const completionText = completion.choices[0].message.content;

            console.log(colors.bold.green("Bot: ") + completionText);

            // Update history with user input and assistant response
            chatHistory.push({ role: 'user', content: userInput });
            chatHistory.push({ role: 'assistant', content: completionText });

        } catch (err) {
            console.log(colors.bold.red("Error: "), err.message);
            return;
        }
    }
}

main();
