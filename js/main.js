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
        title: 'Jet Engine',
        category: 'Aerospace Engineering',
        type: 'glb',
        modelUrl: 'assets/models/jet_engine.glb',
        icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        description: 'A comprehensive look inside a modern high-bypass turbofan jet engine. This marvel of engineering powers most commercial airliners today. The model breaks down the core components: the massive front fan that bypasses most air for efficiency, the low and high-pressure compressors that squeeze air to incredible densities, the combustion chamber where fuel ignites at 2000°C, and the turbines that extract energy to keep the cycle running. Understanding this cycle—Suck, Squeeze, Bang, Blow—is fundamental to aerospace engineering.',
        facts: [
            'Operates on the Brayton thermodynamic cycle.',
            'The high-pressure turbine blades spin at over 10,000 RPM.',
            'Inside temperatures can exceed the melting point of the metal parts, requiring advanced cooling.',
            'Modern engines achieve bypass ratios of 10:1 or higher for fuel efficiency.',
            'Generates tens of thousands of pounds of thrust.'
        ]
    },
    {
        id: 'heart',
        title: 'Human Body Anatomy',
        category: 'Biology',
        type: 'sketchfab',
        modelUrl: '9b0b079953b840bc9a13f524b60041e4',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        description: 'An interactive exploration of the human upper body anatomy, featuring the complex interplay between the muscular and skeletal systems. This model highlights the major muscle groups of the chest, shoulders, and arms (Pectoralis Major, Deltoids, Biceps Brachii) and their attachment points on the skeletal structure (Sternum, Clavicle, Humerus). Perfect for students studying kinesiology, medicine, or artistic anatomy, offering a clear view of how structure dictates function in the human body.',
        facts: [
            'The Pectoralis Major has two heads: Clavicular and Sternocostal.',
            'The Deltoid muscle consists of three distinct fibers: Anterior, Lateral, and Posterior.',
            'Bones act as levers while muscles provide the force for movement.',
            'The human skeleton regenerates completely every 10 years.',
            'Muscles make up approximately 40% of total body weight.'
        ]
    },
    {
        id: 'dna',
        title: 'DNA Double Helix',
        category: 'Genetics',
        type: 'sketchfab',
        modelUrl: '60e95170b37549e3b45ee490b74bb112',
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        description: 'Deoxyribonucleic acid (DNA) is the molecule that carries the genetic instructions for all known living organisms and many viruses. This 3D model visualizes the famous double helix structure discovered by Watson and Crick. It shows two strands coiling around each other, composed of a sugar-phosphate backbone and connected by base pairs (Adenine-Thymine and Guanine-Cytosine). This elegant structure allows DNA to replicate itself during cell division and store vast amounts of information in a microscopic space.',
        facts: [
            'DNA structure was first described in 1953.',
            'Human DNA is approximately 99.9% identical between individuals.',
            'If uncoiled, the DNA in a single cell would stretch about 2 meters long.',
            'Adenine always pairs with Thymine, and Guanine with Cytosine.',
            'A single gram of DNA could theoretically store 215 petabytes of data.'
        ],
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
    },
    {
        id: 'anatomy_complete',
        title: 'Complete Human Anatomy',
        category: 'Biology',
        type: 'sketchfab',
        modelUrl: 'c904a5a65ae145a0bc535645c7e693af',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        description: 'Use this detailed model to navigate through the layers of the human body. From the external integumentary system (skin) down to the skeletal core. This model allows you to visualize the relative positions of major organs including the heart, lungs, liver, and intestines. Understanding spatial anatomy is crucial for medical diagnostics and surgical planning. Notice how the rib cage protects the vital thoracic organs and how the pelvic girdle supports the abdominal viscera.',
        facts: [
            'The adult human body has 206 bones.',
            'The skin is the largest organ of the body.',
            'The small intestine is about 20 feet long in adults.',
            'The human brain contains approximately 86 billion neurons.',
            'Blood makes up about 7% of your body weight.'
        ]
    },
    {
        id: 'skull_explode',
        title: 'Exploded Skull',
        category: 'Anatomy',
        type: 'sketchfab',
        modelUrl: '252887e2e755427c90d9e3d0c6d3025f',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5.67 1.5 1.5S7.83 14 7 14s-1.5-.67-1.5-1.5S6.17 11 7 11zm3.5 4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S9 17.33 9 16.5s.67-1.5 1.5-1.5zm5-4c.83 0 1.5.67 1.5 1.5S16.17 14 15.33 14 13.83 13.33 13.83 12.5s.67-1.5 1.5-1.5z',
        description: 'This "exploded view" dismantles the human skull to reveal the complex mosaic of 22 individual bones. You can see the Cranium (which protects the brain) and the Facial bones (which structure the face). Key bones to identify include the Frontal bone (forehead), Parietal bones (top sides), Temporal bones (temples), and the complex Sphenoid bone which sits at the base. This view is essential for understanding how these bones interlock via sutures.',
        facts: [
            'The human skull consists of 22 bones (excluding ear bones).',
            'The mandible (jawbone) is the only movable bone in the skull.',
            'Sutures are fibrous joints that connect skull bones.',
            'The skull contains holes called foramina for nerves and blood vessels.',
            'Infant skulls have soft spots called fontanelles.'
        ]
    },
    {
        id: 'local_ar',
        title: 'Local AR Viewer',
        category: 'Tools',
        type: 'local',
        modelUrl: '',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        description: 'Transform your learning space by bringing your own 3D models into reality. This tool allows you to upload .glb or .gltf files directly from your device and view them through our Augmented Reality interface. Whether you are a student visualizing a project, a teacher demonstrating a concept, or a hobbyist, this viewer inspects your layout without uploading data to a server—ensuring privacy and speed.',
        facts: [
            'Supports standard .glb and .gltf binary formats.',
            'Files are processed locally in your browser for privacy.',
            'Requires an ARCore (Android) or ARKit (iOS) compatible device for AR mode.',
            'Perfect for previewing models before 3D printing.',
            'Zero latency interactive preview.'
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
            <svg class="w-5 h-5 mr-3 text-gray-600 group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${mod.icon}" />
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
    const arBtn = document.getElementById('ar-btn');

    // Default: Hide AR button for all modules initially
    if (arBtn) arBtn.style.display = 'none';

    if (mod.type === 'sketchfab') {
        // Ensure AR button remains hidden or remove AR logic for Sketchfab

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

        // We explicitly do NOT show the AR button here anymore per user request.

    } else if (mod.type === 'local') {
        // Local AR Mode
        // Show AR button for this mode ONLY
        if (arBtn) arBtn.style.display = 'flex';

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
        const arBtnText = document.getElementById('ar-btn-text');

        // Initial State: Load Model
        arBtnText.textContent = "Load Model";

        const newBtn = arBtn.cloneNode(true);
        arBtn.parentNode.replaceChild(newBtn, arBtn);
        // Re-fetch after replace
        const updatedArBtn = document.getElementById('ar-btn');
        updatedArBtn.style.display = 'flex'; // Ensure visibility

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
        if (viewer.src && viewer.src !== window.location.href && viewer.src !== '') { // Simple check
            arBtnText.textContent = "View in AR";
            updatedArBtn.onclick = handleAR;
        } else {
            updatedArBtn.onclick = handleLoad;
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
                const finalBtn = document.getElementById('ar-btn');
                finalBtn.style.display = 'flex';

                finalBtn.addEventListener('click', () => {
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

        loader.classList.remove('opacity-0', 'pointer-events-none');
        viewer.src = mod.modelUrl;

        viewer.addEventListener('load', () => {
            loader.classList.add('opacity-0', 'pointer-events-none');
        }, { once: true });

        // Explicitly hide AR button by default, BUT enable for Jet Engine as requested
        if (arBtn) {
            if (mod.id === 'engine') {
                arBtn.style.display = 'flex';
                const arBtnText = document.getElementById('ar-btn-text');
                arBtnText.textContent = "View in AR"; /* Or "Open Camera (AR)" */

                // Re-bind click listener just in case it was overwritten
                const newBtn = arBtn.cloneNode(true);
                arBtn.parentNode.replaceChild(newBtn, arBtn);
                newBtn.onclick = () => {
                    if (viewer.canActivateAR) {
                        viewer.activateAR();
                    } else {
                        alert("AR is not supported on this device/browser.");
                    }
                };

            } else {
                arBtn.style.display = 'none';
            }
        }
    }      // Hotspots Logic (Reused from previous)
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

