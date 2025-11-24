// Resume page handling
document.addEventListener('DOMContentLoaded', function() {
    const resumeIframe = document.querySelector('.resume-iframe');
    const resumeFallback = document.querySelector('.resume-fallback');

    // Check if iframe loaded successfully
    if (resumeIframe) {
        // Set timeout to detect if PDF failed to load
        setTimeout(() => {
            try {
                // Try to access iframe content
                const iframeDoc = resumeIframe.contentDocument || resumeIframe.contentWindow.document;
                
                // If we can't access the content or it's empty, show fallback
                if (!iframeDoc || !iframeDoc.body || iframeDoc.body.children.length === 0) {
                    showFallback();
                }
            } catch (e) {
                // Cross-origin or other errors - show fallback
                showFallback();
            }
        }, 2000);

        // Also handle load errors
        resumeIframe.addEventListener('error', showFallback);
    }

    function showFallback() {
        if (resumeIframe) {
            resumeIframe.style.display = 'none';
        }
        if (resumeFallback) {
            resumeFallback.style.display = 'block';
        }
    }
});
