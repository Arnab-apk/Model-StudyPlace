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
        title: 'Jet Engine', // Switching to GLB for Native AR
        category: 'Aerospace Engineering',
        type: 'glb', // ENABLE NATIVE AR
        // Using reliable Google Model Viewer asset (Astronaut) as placeholder for AR demo
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
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
        // New: Hotspots for this model
        hotspots: [
            {
                name: 'bond-1',
                position: '0.2 0.5 0.1',
                normal: '0 1 0',
                label: 'Hydrogen Bond',
                desc: 'Hydrogen bonds between base pairs hold the two strands of the DNA double helix together. These weak bonds allow the strands to separate for replication.'
            },
            {
                name: 'bond-2',
                position: '-0.2 0.3 -0.1',
                normal: '1 0 0',
                label: 'Phosphate Backbone',
                desc: 'The sugar-phosphate backbone forms the structural framework of nucleic acids, including DNA and RNA. It is composed of alternating sugar and phosphate groups.'
            }
        ]
        // Sketchfab handles hotspots internally, so we remove the manual array
    },
    {
        id: 'anatomy_complete',
        title: 'Complete Human Anatomy',
        category: 'Biology',
        type: 'sketchfab',
        modelUrl: 'c904a5a65ae145a0bc535645c7e693af',
        description: 'A detailed 3D model of the complete human anatomy, allowing for in-depth study of the skeletal, muscular, and organ systems.',
        facts: [
            'Includes all major organ systems.',
            'Accurate skeletal structure.',
            'Perfect for medical education.'
        ]
    },
    {
        id: 'local_ar',
        title: 'Local AR Viewer',
        category: 'Tools',
        type: 'local',
        modelUrl: '', // Will be set dynamically
        description: 'Load your own .glb files to view them in Augmented Reality. Files remain on your device.',
        facts: [
            'Supports .glb and .gltf formats.',
            'No server upload required.',
            'Instant AR preview.'
        ]
    },
    {
        id: 'skull_explode',
        title: 'Exploded Skull',
        category: 'Anatomy',
        type: 'sketchfab',
        modelUrl: '252887e2e755427c90d9e3d0c6d3025f',
        description: 'A detailed interactive view of the human skull, showing individual bones in an exploded view for clear identification.',
        facts: [
            'Shows all cranial bones separated.',
            'Interactive rotation and zoom.',
            'Great for learning bone relationships.'
        ]
    }
];

// DOM Elements
const viewer = document.getElementById('viewer');
const sketchfabViewer = document.getElementById('sketchfab-viewer'); // New Element
const moduleList = document.getElementById('module-list');
const loader = document.getElementById('loader');
const fileInput = document.getElementById('file-input'); // Local File Input

// Modal Elements
const modal = document.getElementById('detail-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.getElementById('close-modal');

// Modal Logic
function openModal(title, description, isHtml = false) {
    modalTitle.textContent = title;
    if (isHtml) {
        modalDesc.innerHTML = description;
    } else {
        modalDesc.textContent = description;
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('.glass-panel').classList.remove('scale-95');
    modal.querySelector('.glass-panel').classList.add('scale-100');
}

function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.glass-panel').classList.add('scale-95');
    modal.querySelector('.glass-panel').classList.remove('scale-100');
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Global About Button Logic
const aboutModelBtn = document.getElementById('about-model-btn');
let currentModuleId = null; // Track current module

if (aboutModelBtn) {
    aboutModelBtn.addEventListener('click', () => {
        const mod = modules.find(m => m.id === currentModuleId);
        if (mod) {
            const factsHtml = mod.facts.map(f => `<li class="flex items-start mb-1"><span class="mr-2 text-brand">•</span>${f}</li>`).join('');
            const content = `
                <p class="mb-4">${mod.description}</p>
                <div class="bg-white/5 p-3 rounded-lg">
                    <h4 class="text-xs uppercase tracking-widest text-gray-500 mb-2">Key Facts</h4>
                    <ul class="text-sm text-gray-300">
                        ${factsHtml}
                    </ul>
                </div>
            `;
            openModal(mod.title, content, true);
        }
    });
}

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
    currentModuleId = id; // Update global tracker
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

        // Custom Description Logic for Local AR
        if (mod.type === 'local') {
            uiElements.desc.innerHTML = `
                ${mod.description}<br><br>
                <button onclick="document.getElementById('file-input').click()" class="bg-brand text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors w-full">
                    Upload .glb File
                </button>
            `;
        } else {
            uiElements.desc.textContent = mod.description;
        }

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

    // View Logic
    if (mod.type === 'sketchfab') {
        const arBtn = document.getElementById('ar-btn');
        // Hide AR button for Sketchfab if desired, or keep it generic
        // Based on previous code, we kept it but made it trigger the overlay
        // However, for anatomy, maybe we just hide GLB viewer
        viewer.classList.add('opacity-0', 'pointer-events-none');
        sketchfabViewer.classList.remove('opacity-0', 'pointer-events-none');

        // Panel minimized on mobile
        if (window.innerWidth < 768) {
            const panel = document.getElementById('info-panel');
            if (panel) panel.classList.add('panel-minimized');
        }

        setTimeout(() => {
            sketchfabViewer.src = `https://sketchfab.com/models/${mod.modelUrl}/embed?autostart=1&camera=0&ui_theme=dark&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_hint=2`;
            setTimeout(() => {
                loader.classList.add('opacity-0', 'pointer-events-none');
            }, 1000);
        }, 100);

        // Update AR Button for Sketchfab (Standard View in AR link or just guide)
        const arBtnText = document.getElementById('ar-btn-text');
        arBtnText.textContent = "View in AR";
        const newBtn = arBtn.cloneNode(true);
        arBtn.parentNode.replaceChild(newBtn, arBtn);
        const arGuide = document.getElementById('ar-guide');
        newBtn.addEventListener('click', () => {
            arGuide.classList.remove('opacity-0', 'pointer-events-none');
        });

    } else if (mod.type === 'local') {
        // Local AR Mode
        sketchfabViewer.classList.add('opacity-0', 'pointer-events-none');
        sketchfabViewer.src = '';
        viewer.classList.remove('opacity-0', 'pointer-events-none');

        // Reset Viewer Source if switching to this module freshly
        // But if we already loaded a file, maybe keep it? 
        // For now, let's clear it to ensure user knows to upload
        if (currentModuleId !== 'local_ar') {
            viewer.src = '';
            viewer.alt = "Upload a model to view";
        }

        // Hide loader immediately
        loader.classList.add('opacity-0', 'pointer-events-none');

        // Setup AR Button
        const arBtn = document.getElementById('ar-btn');
        const arBtnText = document.getElementById('ar-btn-text');

        // Initial State: Load Model
        arBtnText.textContent = "Load Model";

        const newBtn = arBtn.cloneNode(true);
        arBtn.parentNode.replaceChild(newBtn, arBtn);

        // Define behaviors
        const handleLoad = () => {
            document.getElementById('file-input').click();
        };

        const handleAR = () => {
            if (viewer.canActivateAR) {
                viewer.activateAR();
            } else {
                alert("AR is not supported on this device/browser.");
            }
        };

        // If a model is already loaded (from previous file input), show AR button
        if (viewer.src && viewer.src !== window.location.href) { // Simple check
            arBtnText.textContent = "View in AR";
            newBtn.onclick = handleAR;
        } else {
            newBtn.onclick = handleLoad;
        }

        // Global listener for file input to update button state
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                viewer.src = url;

                // Update Button to AR mode
                const btn = document.getElementById('ar-btn');
                const txt = document.getElementById('ar-btn-text');
                txt.textContent = "View in AR";

                // Remove old listener and add new one
                // Cloning again to be clean
                const updateBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(updateBtn, btn);
                updateBtn.addEventListener('click', () => {
                    if (viewer.canActivateAR) {
                        viewer.activateAR();
                    } else {
                        alert("AR is not supported on this device/browser.");
                    }
                });
            }
        };

    } else {
        // Standard GLB Mode (Jet Engine)
        sketchfabViewer.classList.add('opacity-0', 'pointer-events-none');
        sketchfabViewer.src = '';
        viewer.classList.remove('opacity-0', 'pointer-events-none');

        setTimeout(() => {
            viewer.src = mod.modelUrl;
        }, 100);

        const arBtn = document.getElementById('ar-btn');
        const arBtnText = document.getElementById('ar-btn-text');
        arBtnText.textContent = "Open Camera (AR)";
        const newBtn = arBtn.cloneNode(true);
        arBtn.parentNode.replaceChild(newBtn, arBtn);
        newBtn.addEventListener('click', () => {
            if (viewer.canActivateAR) {
                viewer.activateAR();
            }
        });

        // Hotspots Logic (Reused from previous)
        const existingHotspots = viewer.querySelectorAll('[slot^="hotspot-"]');
        existingHotspots.forEach(el => el.remove());
        if (mod.hotspots) {
            mod.hotspots.forEach(hs => {
                const button = document.createElement('button');
                button.className = 'bg-brand/20 backdrop-blur-md rounded-full px-3 py-1 text-xs border border-brand text-white hover:bg-brand hover:text-black transition-colors font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)] animate-pulse';
                button.slot = `hotspot-${hs.name}`;
                button.dataset.position = hs.position;
                button.dataset.normal = hs.normal;
                button.textContent = hs.label;
                button.onclick = () => openModal(hs.label, hs.desc);
                viewer.appendChild(button);
            });
        }
    }
}

// File Input Event Listener
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        viewer.src = url;
        // Update Title to match file name (optional but nice)
        // uiElements.title.textContent = file.name;
    }
});

// Model Viewer Events
viewer.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('opacity-0', 'pointer-events-none');
        // Reset loader content
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

viewer.addEventListener('error', (e) => {
    if (!loader.classList.contains('opacity-0')) {
        console.error("Error loading model:", e);
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

