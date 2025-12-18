/* 
   MODAL LOGIC (UPDATED)
   Handles Images, Documents (.docx), and Missing Artifact Explanations
*/

const modal = document.getElementById('project-modal');
const body = document.body;

// Elements to populate
const mTitle = document.getElementById('m-title');
const mRole = document.getElementById('m-role');
const mDesc = document.getElementById('m-desc');
const mBullets = document.getElementById('m-bullets');
const mTags = document.getElementById('m-tags');
const mGallery = document.getElementById('m-gallery');

// DATABASE OF RESOURCES
// Maps project IDs to your specific files
const artifactsDB = {
    'chronobox': [
        { type: 'img', src: 'assets/resources/CIAB-Diagram.png', caption: 'System Topology: Local Private Cloud Architecture' }
    ],
    'fedc': [
        { type: 'img', src: 'assets/resources/FEDC-1.png', caption: 'Homepage: Executive Design System' },
        { type: 'img', src: 'assets/resources/FEDC-2.png', caption: 'Responsive Mobile Navigation' },
        { type: 'img', src: 'assets/resources/FEDC-3.png', caption: 'Interactive Components & QUAILS Initiative' }
    ],
    'tracker': [
        { type: 'img', src: 'assets/resources/Return-ER.png', caption: 'Database Schema: Entity Relationship Diagram (PostgreSQL)' }
    ],
    'network': [
        { type: 'file', src: 'assets/resources/Boyer-NetworkDesignProposal.docx', caption: 'Enterprise Network Design Proposal' }
    ],
    'paper': [
        { type: 'file', src: 'assets/resources/Final-Research-BBoyer25.docx', caption: 'Full Research Paper: A New Era of Cloud Computing' }
    ],
    // PROJECTS WITH NO VISUALS (Will trigger text explanation)
    'tjx': [],
    'ibm': [],
    'msp': []
};

// TEXT EXPLANATIONS FOR MISSING VISUALS
const missingVisualsText = {
    'tjx': "Due to strict NDA and corporate data policies, internal screenshots of ServiceNow workflows, Jira backlogs, and Confluence documentation cannot be shared publicly. Key artifacts produced included a 'Fun Friday' Engagement Deck and standardized API Governance Templates.",
    'ibm': "This project involved proprietary Client Engineering prototypes for the insurance sector. The work focused on backend logic (Regex/Python) and WatsonX Assistant architecture, which contains sensitive client data.",
    'msp': "Security remediation work was performed on live client environments involving Azure Entra ID and physical FIDO key deployments. Due to the sensitive nature of security compliance, visual artifacts are not available."
};

function openModal(projectId) {
    const card = document.querySelector(`.project-card[data-id="${projectId}"]`);
    if(!card) return;

    // 1. Extract Data from HTML Attributes
    const title = card.getAttribute('data-title');
    const role = card.getAttribute('data-role');
    const desc = card.getAttribute('data-desc');
    const stack = card.getAttribute('data-stack').split(', ');
    const bullets = card.getAttribute('data-bullets').split('|');

    // 2. Populate Text Content
    mTitle.textContent = title;
    mRole.textContent = role;
    mDesc.textContent = desc;

    // Populate Bullets
    mBullets.innerHTML = '';
    bullets.forEach(txt => {
        const li = document.createElement('li');
        li.textContent = txt;
        mBullets.appendChild(li);
    });

    // Populate Tags
    mTags.innerHTML = '';
    stack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tech;
        mTags.appendChild(span);
    });

    // 3. Populate Gallery / Resources
    mGallery.innerHTML = '';
    const resources = artifactsDB[projectId] || [];
    
    if (resources.length > 0) {
        resources.forEach(item => {
            if (item.type === 'img') {
                // Render Image
                const div = document.createElement('div');
                div.className = 'artifact';
                div.innerHTML = `
                    <img src="${item.src}" alt="Artifact">
                    <div class="artifact-caption">${item.caption}</div>
                `;
                mGallery.appendChild(div);
            } else if (item.type === 'file') {
                // Render File Download Card (DOCX/PDF)
                const link = document.createElement('a');
                link.className = 'artifact-file-card';
                link.href = item.src;
                link.target = "_blank"; // Tries to download or open in new tab
                link.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <span class="file-name">${item.caption}</span>
                        <span class="file-type">Document Download</span>
                    </div>
                `;
                mGallery.appendChild(link);
            }
        });
    } else {
        // Render Text Explanation for missing visuals
        const explanation = missingVisualsText[projectId] || "Visual artifacts for this project are currently offline.";
        mGallery.innerHTML = `
            <div class="missing-artifact-notice">
                <strong>Confidentiality Notice:</strong><br>
                ${explanation}
            </div>
        `;
    }

    // 4. Show Modal
    modal.classList.add('show-modal');
    body.classList.add('modal-open');
}

function closeModal() {
    modal.classList.remove('show-modal');
    body.classList.remove('modal-open');
}

// Close on clicking background
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});