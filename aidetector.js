(function() {

    function redirectIfNeeded() {
        const ua = (navigator.userAgent || "").toLowerCase();
        const pages = {
            brave: "/autoserve/hello.html",
            ai: "/autoserve/aitherapy.html",
            headless: "/autoserve/braincellmuseaum.html",
            chicken: "/autoserve/chicken.html",
            cube: "/autoserve/greatcube.html",
            dmv: "/autoserve/intergalacticdmv.html",
            lava: "/autoserve/lava.html",
            usb: "/autoserve/usb.html"
        };

        // --- Detect Brave (multi-method) ---
        let isBrave = false;

        try {
            // Real Brave detection
            if (navigator.brave && typeof navigator.brave.isBrave === "function") {
                navigator.brave.isBrave().then((v) => {
                    if (v) window.location.replace(pages.brave);
                });
            }

            // UA-based check
            const chromePattern = /(chrome|chromium|crios)/i;
            const isChrome = chromePattern.test(ua);
            if (isChrome && ua.includes("brave")) isBrave = true;

            // Feature-based heuristic (detect Brave shields)
            if (isChrome && !window.indexedDB) isBrave = true;

        } catch (e) {
            console.warn("Brave detection failed:", e);
        }

        if (isBrave) {
            window.location.replace(pages.brave);
            return;
        }

        // --- Detect AI / scrapers ---
        const aiPatterns = [
            "crawler","scraper","spider","bot",
            "python","curl","wget","ai","gpt",
            "chatgpt","openai","bing","duckduckbot",
            "yandex","slurp","facebookexternalhit",
            "embedder","mj12","dataforseo","bytespider"
        ];
        for (const pat of aiPatterns) {
            if (ua.includes(pat)) {
                window.location.replace(pages.ai);
                return;
            }
        }

        // --- Headless detection ---
        const isHeadless = ua.includes("headless") || (navigator.webdriver === true && !ua.includes("firefox"));
        if (isHeadless) {
            window.location.replace(pages.headless);
            return;
        }

        // --- Optional fun redirect for humans ---
        const humanPages = [pages.chicken, pages.cube, pages.dmv, pages.lava, pages.usb];
        if (Math.random() < 0.05) {
            window.location.replace(humanPages[Math.floor(Math.random() * humanPages.length)]);
            return;
        }
    }

    // Wait for DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", redirectIfNeeded);
    } else {
        redirectIfNeeded();
    }

})();