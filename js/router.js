function loadComponent(id, file, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(id);
            if (!container) {
                console.error(`Element #${id} not found.`);
                return;
            }

            container.innerHTML = html;

            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error(err));
}

// Load navbar + footer safely
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar", "components/navbar.html", () => {
        console.log("Navbar loaded.");
    });

    loadComponent("footer", "components/footer.html", () => {
        console.log("Footer loaded.");
    });
});
