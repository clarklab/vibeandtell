// Dark mode functionality
(function() {
    // Check for saved theme preference or default to system preference
    const getThemePreference = () => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply theme to HTML and body elements
    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        
        // Ensure documentElement exists
        if (document.documentElement) {
            document.documentElement.classList.toggle('dark', isDark);
        }
        
        // Ensure body exists, if not wait for it
        if (document.body) {
            document.body.classList.toggle('dark', isDark);
        } else {
            // If body doesn't exist yet, wait for DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.toggle('dark', isDark);
            }, { once: true });
        }
        
        // Update the toggle state (only when DOM is ready)
        const updateToggle = () => {
            const toggle = document.querySelector('.dark-toggle input[type="checkbox"]');
            if (toggle) {
                toggle.checked = isDark;
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateToggle, { once: true });
        } else {
            updateToggle();
        }
    };

    // Save theme preference
    const saveThemePreference = (theme) => {
        localStorage.setItem('theme', theme);
    };

    // Initialize theme on page load
    const initTheme = () => {
        const theme = getThemePreference();
        applyTheme(theme);
    };

    // Toggle theme
    const toggleTheme = () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveThemePreference(newTheme);
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Initialize theme as early as possible but safely
    const safeInit = () => {
        try {
            initTheme();
        } catch (error) {
            console.warn('Dark mode initialization failed:', error);
            // Fallback to light mode
            if (document.documentElement) {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    // Try to initialize immediately, but with error handling
    if (document.readyState === 'loading') {
        // Script is in head, DOM not ready yet
        document.addEventListener('DOMContentLoaded', safeInit, { once: true });
    } else {
        // DOM is already ready
        safeInit();
    }

    // Set up event listener when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const toggleButton = document.querySelector('.dark-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }
    });
})();
