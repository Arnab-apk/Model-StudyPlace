/**
 * AI Chatbot for 3D Learning Hub
 * Powered by Google Generative AI
 */

// Initialize Google Generative AI
const API_KEY = 'AIzaSyDNbfYdFAsbDRf1INC6jQeOIEQIYLzXuH4';
const { GoogleGenerativeAI } = window;
const client = new GoogleGenerativeAI(API_KEY);

// Model data for context
const MODEL_DATA = `
Available 3D Models:
1. Jet Engine - A gas turbine engine commonly used in aircraft. Operates on the Brayton cycle, compresses air to high pressures before combustion, and produces immense thrust for high-speed flight.

2. Human Body Anatomy - A comprehensive view of human anatomy, showcasing the intricate systems of muscles, bones, and organs working in harmony. Includes detailed muscular and skeletal systems.

3. DNA Double Helix - The molecule that carries genetic instructions. This model visualizes the double helix structure, formed by base pairs attached to a sugar-phosphate backbone. Discovered by Watson and Crick in 1953.

4. Complete Human Anatomy - A detailed 3D model of the complete human anatomy, including all major organ systems, accurate skeletal structure. Perfect for medical education.

5. Exploded Skull - A detailed interactive view of the human skull, showing individual bones in an exploded view for clear identification. Great for learning bone relationships.

6. Local AR Viewer - Load your own .glb files to view them in Augmented Reality. Supports .glb and .gltf formats.

This is an educational platform for learning about 3D models, anatomy, engineering, and genetics.
`;

// DOM Elements
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatLoading = document.getElementById('chat-loading');

let conversationHistory = [];
let model;

// Initialize Gemini model
async function initializeModel() {
    try {
        model = client.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
        console.error('Error initializing model:', error);
    }
}

// Toggle chat window
chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        chatInput.focus();
    }
});

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    chatInput.value = '';
    chatLoading.classList.remove('hidden');

    try {
        if (!model) {
            await initializeModel();
        }

        // Build system prompt with context
        const systemPrompt = `You are a helpful AI assistant for the "3D Learning Hub" educational website. 
${MODEL_DATA}

Your role is to:
- Answer questions about the 3D models available on the website
- Provide educational information about anatomy, engineering, genetics, and science
- Be friendly and encouraging
- Keep responses concise and clear (2-3 sentences typically)
- If asked about something not related to the models or education, politely redirect to the available topics
- Include relevant facts from the model data when answering questions

Always maintain an educational and helpful tone.`;

        // Create chat message with history
        const messages = conversationHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // Add new message
        messages.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Generate response
        const chat = model.startChat({ history: messages });
        const result = await chat.sendMessage(message);
        const response = result.response.text();

        // Add bot response to chat
        addMessageToChat(response, 'bot');

        // Store in history
        conversationHistory.push({ role: 'user', content: message });
        conversationHistory.push({ role: 'assistant', content: response });

    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
    } finally {
        chatLoading.classList.add('hidden');
        scrollChatToBottom();
    }
}

// Add message to chat display
function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-3 animate-fade-in-up';

    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="ml-auto bg-brand/20 text-brand rounded-lg p-3 max-w-xs border border-brand/30">
                <p class="text-sm">${escapeHtml(text)}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                <span class="text-brand text-sm">🤖</span>
            </div>
            <div class="bg-gray-800 rounded-lg p-3 max-w-xs border border-gray-700">
                <p class="text-sm text-gray-300">${escapeHtml(text)}</p>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Scroll chat to bottom
function scrollChatToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 0);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initialize model on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeModel();
});

// Handle message input on mobile
if (window.innerWidth < 768) {
    chatInput.addEventListener('focus', () => {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 300);
    });
}
