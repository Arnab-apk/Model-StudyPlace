import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Chatbot for 3D Learning Hub
 * Powered by Google Generative AI
 * re-written using Class-based architecture for better state management
 */

class ChatBot {
    constructor() {
        // Configuration
        this.API_KEY = 'AIzaSyCLKUq3yM97drroGxkCNVkCGUNWkU1EiEY'; // Note: In production, use backend proxy
        this.MODEL_NAME = 'gemini-pro';

        // State
        this.isOpen = false;
        this.isLoading = false;
        this.history = [];
        this.model = null;

        // Context Data
        this.contextData = `
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
        this.elements = {
            toggle: document.getElementById('chat-toggle'),
            window: document.getElementById('chat-window'),
            messages: document.getElementById('chat-messages'),
            input: document.getElementById('chat-input'),
            sendBtn: document.getElementById('chat-send'),
            loading: document.getElementById('chat-loading')
        };

        // Initialize if elements exist
        if (this.elements.toggle) {
            this.init();
        } else {
            console.error('Chatbot elements not found. Initialization failed.');
        }
    }

    async init() {
        console.log('🤖 Initializing ChatBot...');

        // Setup Event Listeners
        this.setupEventListeners();

        // Initialize AI Model
        try {
            // GoogleGenerativeAI is imported at top
            const client = new GoogleGenerativeAI(this.API_KEY);
            this.model = client.getGenerativeModel({ model: this.MODEL_NAME });
            console.log('✅ Gemini Model Ready');
        } catch (error) {
            console.error('Model initialization error:', error);
            this.addMessage('System: AI SDK failed to load.', 'error');
        }
    }

    setupEventListeners() {
        // Toggle Chat
        this.elements.toggle.addEventListener('click', () => this.toggleChat());

        // Send Message
        this.elements.sendBtn.addEventListener('click', () => this.handleSend());

        // Enter Key
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Mobile Focus Fix
        if (window.innerWidth < 768) {
            this.elements.input.addEventListener('focus', () => {
                setTimeout(() => this.scrollToBottom(), 300);
            });
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.elements.window.classList.toggle('hidden');

        if (this.isOpen) {
            this.elements.input.focus();
            this.scrollToBottom();
        }
    }

    async handleSend() {
        const text = this.elements.input.value.trim();
        if (!text || this.isLoading) return;

        // Clear input
        this.elements.input.value = '';

        // Add User Message
        this.addMessage(text, 'user');

        // Set Loading
        this.setLoading(true);

        try {
            const response = await this.generateResponse(text);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Generation Error:', error);
            this.addMessage('Sorry, something went wrong. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async generateResponse(userMessage) {
        if (!this.model) {
            await this.init(); // Try to lazy init
            if (!this.model) throw new Error('Model not initialized');
        }

        // Prepare History for API
        const apiHistory = [
            {
                role: 'user',
                parts: [{ text: `You are a helpful AI assistant for the "3D Learning Hub" educational website. Context: ${this.contextData} Answer concisely.` }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I am ready to help with questions about 3D models, anatomy, and engineering." }]
            },
            ...this.history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        ];

        const chat = this.model.startChat({ history: apiHistory });
        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text();

        // Update Local History
        this.history.push({ role: 'user', content: userMessage });
        this.history.push({ role: 'bot', content: responseText });

        return responseText;
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = 'flex gap-3 animate-fade-in-up';

        const isUser = sender === 'user';
        const isError = sender === 'error';

        if (isUser) {
            div.innerHTML = `
                <div class="ml-auto bg-brand/20 text-brand rounded-lg p-3 max-w-xs border border-brand/30">
                    <p class="text-sm">${this.escapeHtml(text)}</p>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="w-8 h-8 rounded-full ${isError ? 'bg-red-500/20' : 'bg-brand/20'} flex items-center justify-center flex-shrink-0">
                    <span class="text-brand text-sm">${isError ? '⚠️' : '🤖'}</span>
                </div>
                <div class="bg-gray-800 rounded-lg p-3 max-w-xs border ${isError ? 'border-red-500/50' : 'border-gray-700'}">
                    <p class="text-sm ${isError ? 'text-red-400' : 'text-gray-300'}">${this.escapeHtml(text)}</p>
                </div>
            `;
        }

        this.elements.messages.appendChild(div);
        this.scrollToBottom();
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            this.elements.loading.classList.remove('hidden');
        } else {
            this.elements.loading.classList.add('hidden');
        }
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatBot();
});
