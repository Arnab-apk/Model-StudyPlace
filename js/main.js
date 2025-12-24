/**
 * 3D Learning Hub - Main Application Logic
 * Handles model loading, UI state, and navigation.
 */

// Data Configuration
// NOTE: Replace 'modelUrl' with your local paths or direct GLB links.
// Current generic URLs provided by Google Model Viewer for demonstration.
const modules = [
    {
        id: 'engine',
        title: 'Jet Engine', // Updated to Jet Engine
        category: 'Aerospace Engineering',
        type: 'sketchfab', // Switched to Sketchfab
        modelUrl: 'fe3794fdc4ac49df910cecd007bfaaa3', // User provided ID
        description: 'A gas turbine engine commonly used in aircraft. It creates thrust by taking in a large amount of air, compressing it, mixing it with fuel, igniting it, and exhausting the hot gases.',
        facts: [
            'Operates on the Brayton cycle.',
            'Compresses air to high pressures before combustion.',
            'Produces immense thrust for high-speed flight.'
        ]
    },
    {
        id: 'heart',
        title: 'Human Body Anatomy', // Updated per user request
        category: 'Biology',
        type: 'sketchfab', // New type field
        // Using "Robot Expressive" to show animation and complex parts
        modelUrl: '9b0b079953b840bc9a13f524b60041e4', // Sketchfab ID from user
        description: 'A comprehensive view of human anatomy, showcasing the intricate systems of muscles, bones, and organs working in harmony.',
        facts: [
            'Includes detailed muscular and skeletal systems.',
            'Demonstrates the complexity of human biology.',
            'Interactive model allows for deep exploration.'
        ]
    },
    {
        id: 'dna',
        title: 'DNA Double Helix', // Updated title
        category: 'Genetics',
        type: 'sketchfab', // Switched to Sketchfab
        modelUrl: '60e95170b37549e3b45ee490b74bb112', // User specific ID
        description: 'The molecule that carries genetic instructions. This model visualizes the double helix structure, formed by base pairs attached to a sugar-phosphate backbone.',
        facts: [
            'Discovered by Watson and Crick in 1953.',
            'Contains code for all cellular functions.',
            'Capable of self-replication during cell division.'
        ],
        // Sketchfab handles hotspots internally, so we remove the manual array
    }
];

// DOM Elements
const viewer = document.getElementById('viewer');
const sketchfabViewer = document.getElementById('sketchfab-viewer'); // New Element
const moduleList = document.getElementById('module-list');
const loader = document.getElementById('loader');

// Mobile Menu Elements
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarBtn = document.getElementById('close-sidebar');

// Mobile Menu Toggle Logic
function toggleSidebar(show) {
    if (show) {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleSidebar(true));
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
    closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
}

// Info Panel Elements
const uiElements = {
    title: document.getElementById('info-title'),
    category: document.getElementById('info-category'),
    desc: document.getElementById('info-desc'),
    facts: document.getElementById('info-facts')
};

// Add transition classes for smooth updates
Object.values(uiElements).forEach(el => {
    el.classList.add('transition-all', 'duration-300', 'ease-out');
});

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();

    // Check for saved topic from Landing Page
    const startTopic = localStorage.getItem('startTopic') || 'engine';
    loadModule(startTopic);

    // Clear storage to prevent sticking
    localStorage.removeItem('startTopic');
});

// Render Sidebar Navigation
function initSidebar() {
    moduleList.innerHTML = '';
    modules.forEach(mod => {
        const btn = document.createElement('button');
        btn.className = `nav-item w-full text-left px-4 py-3 rounded-lg flex items-center text-gray-400 hover:text-white hover:bg-white/5 transition-all group`;
        btn.dataset.id = mod.id;
        btn.onclick = () => {
            loadModule(mod.id);
            // Close sidebar on mobile when item selected
            if (window.innerWidth < 768) {
                toggleSidebar(false);
            }
        };

        btn.innerHTML = `
            <svg class="w-4 h-4 mr-3 text-gray-600 group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 0 00-1.022-.547l-2.384-.477a6 0 00-3.86.517l-.318.158a6 0 01-3.86.517L6.05 15.21a2 0 00-1.806.547M8 4h8l-1 1v5.172a2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 0 009 10.172V5L8 4z" />
            </svg>
            <span class="font-medium">${mod.title}</span>
        `;

        moduleList.appendChild(btn);
    });
}

// Load a specific module
function loadModule(id) {
    const mod = modules.find(m => m.id === id) || modules[0];

    // Update Active State in Sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.dataset.id === id) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Show Loader
    loader.classList.remove('opacity-0', 'pointer-events-none');

    // Fade out text
    [uiElements.title, uiElements.category, uiElements.desc, uiElements.facts].forEach(el => {
        el.classList.add('opacity-0', 'translate-y-2');
        el.classList.remove('opacity-100', 'translate-y-0');
    });

    // Update Content after short delay for fade out
    setTimeout(() => {
        // Update Data
        uiElements.title.textContent = mod.title;
        uiElements.category.textContent = mod.category;
        uiElements.desc.textContent = mod.description;

        // Update Facts
        uiElements.facts.innerHTML = mod.facts.map((fact, index) => `
            <li class="flex items-start text-xs text-gray-400 opacity-0 translate-x-4 animate-[slideInRight_0.3s_ease-out_forwards]" style="animation-delay: ${index * 100}ms">
                <svg class="w-3 h-3 text-brand mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                ${fact}
            </li>
        `).join('');

        // Fade In text
        [uiElements.title, uiElements.category, uiElements.desc, uiElements.facts].forEach(el => {
            el.classList.remove('opacity-0', 'translate-y-2');
            el.classList.add('opacity-100', 'translate-y-0');
        });

    }, 300);

    // Hybrid Viewer Logic
    if (mod.type === 'sketchfab') {
        // Switch to Iframe
        viewer.classList.add('opacity-0', 'pointer-events-none');
        sketchfabViewer.classList.remove('opacity-0', 'pointer-events-none');

        // Set Source (with slight delay for smoothness)
        setTimeout(() => {
            sketchfabViewer.src = `https://sketchfab.com/models/${mod.modelUrl}/embed?autostart=1&camera=0&ui_theme=dark`;
            // Fake load completion for iframe since we can't easily track it X-domain
            setTimeout(() => {
                loader.classList.add('opacity-0', 'pointer-events-none');
            }, 1000);
        }, 100);

    } else { // Default to GLB viewer
        // Switch to GLB Viewer
        sketchfabViewer.classList.add('opacity-0', 'pointer-events-none');
        sketchfabViewer.src = ''; // Clear iframe to stop audio/video
        viewer.classList.remove('opacity-0', 'pointer-events-none');

        // Load Model
        setTimeout(() => {
            viewer.src = mod.modelUrl;
        }, 100);

        // -- UPDATE HOTSPOTS --
        // 1. Clear existing generic hotspots (keep the slot="progress-bar")
        const existingHotspots = viewer.querySelectorAll('[slot^="hotspot-"]');
        existingHotspots.forEach(el => el.remove());

        // 2. Add new hotspots from data
        if (mod.hotspots) {
            mod.hotspots.forEach(hs => {
                const button = document.createElement('button');
                button.className = 'bg-brand/20 backdrop-blur-md rounded-full px-3 py-1 text-xs border border-brand text-white hover:bg-brand hover:text-black transition-colors font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)] animate-pulse';
                button.slot = `hotspot-${hs.name}`;
                button.dataset.position = hs.position;
                button.dataset.normal = hs.normal;
                button.textContent = hs.label;
                viewer.appendChild(button);
            });
        }
    }
}

// Model Viewer Events
viewer.addEventListener('load', () => {
    // Hide Loader when model is ready
    setTimeout(() => {
        loader.classList.add('opacity-0', 'pointer-events-none');
        // Clear any previous error messages
        loader.innerHTML = `
            <div class="flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 text-brand mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-xs uppercase tracking-widest text-brand animate-pulse">Initializing Environment</span>
            </div>
        `;
    }, 500);
});

// Handle Errors
viewer.addEventListener('error', (e) => {
    // Only show error if the loader is still visible (meaning load hasn't finished)
    if (!loader.classList.contains('opacity-0')) {
        console.error("Error loading model:", e);
        // Don't overwrite if it's just a warning, but for now we assume simple failure
        // We will only show error if it persists.

        // Sometimes model-viewer throws an error for a missing texture but the model works.
        // We'll add a 'Retry' button instead of just text.
        loader.innerHTML = `
            <div class="text-center">
                <p class="text-red-500 mb-2">Error Loading Model Asset</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
                    Retry Connection
                </button>
            </div>
        `;
    }
});
