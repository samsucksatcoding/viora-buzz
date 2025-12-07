document.addEventListener("DOMContentLoaded", () => {

    // ------------------ Tree Rendering ------------------
    function renderTree(parentId, childrenId) {
        const parentLi = document.getElementById(parentId);
        const childrenUl = document.getElementById(childrenId);
        if (!parentLi || !childrenUl) return;

        childrenUl.style.display = "none";

        const container = document.createElement("ul");
        container.style.listStyle = "none";
        container.style.paddingLeft = "0";
        container.style.margin = "0";

        const items = Array.from(childrenUl.children);

        items.forEach((li, index) => {
            const childLi = document.createElement("li");
            const isLast = index === items.length - 1;
            const symbol = isLast ? "┖ " : "┠ ";

            if (li.getAttribute("onclick")) {
                childLi.setAttribute("onclick", li.getAttribute("onclick"));
            }

            childLi.append(symbol);

            for (const node of Array.from(li.childNodes)) {
                childLi.append(node.cloneNode(true));
            }

            container.appendChild(childLi);
        });

        parentLi.after(container);

        parentLi.style.cursor = "pointer";
        parentLi.addEventListener("click", () => {
            parentLi.style.background =
                parentLi.style.background === "lightblue" ? "" : "lightblue";
        });

        container.style.display = "block";
    }

    renderTree("me-parent", "me-children");
    renderTree("site-parent", "site-children");
    renderTree("links-parent", "links-children");

    // ------------------ Stretching Function ------------------
    function stretchToTallest() {
        const aside = document.querySelector('aside');
        const main = document.querySelector('main');
        const sidebar = document.querySelector('.sidebar');

        // reset height first
        aside.style.height = 'auto';
        main.style.height = 'auto';
        sidebar.style.height = 'auto';

        // find tallest
        const maxHeight = Math.max(
            aside.offsetHeight,
            main.offsetHeight,
            sidebar.offsetHeight
        );

        // apply tallest height
        aside.style.height = maxHeight + 'px';
        main.style.height = maxHeight + 'px';
        sidebar.style.height = maxHeight + 'px';
    }

    // Run once after tree renders
    stretchToTallest();

    // ------------------ Periodic Stretching ------------------
    // Keep heights in sync in case Lanyard/Clock changes sidebar height
    setInterval(stretchToTallest, 500);
    window.addEventListener('resize', stretchToTallest);
});

// ------------------ Lanyard & Clock Code (unchanged) ------------------
const DISCORD_ID = "1393281918526558288";  
const LASTFM_CACHE_KEY = "last_listened_song";

const el = {
    status: document.querySelector(".status span:nth-of-type(2)"),
    feeling: document.querySelector(".feeling span:nth-of-type(2)"),
    playing: document.querySelector(".playing span:nth-of-type(2)"),
    watching: document.querySelector(".watching span:nth-of-type(2)"),
    reading: document.querySelector(".reading span:nth-of-type(2)"),
    listening: document.querySelector(".listening span:nth-of-type(2)"),
    myTime: document.querySelector(".mytime span:nth-of-type(2)"),
    yourTime: document.querySelector(".mytime span:nth-of-type(4)")
};

async function fetchLanyard() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        const info = json.data;

        el.status.textContent = info.discord_status;

        const customStatus = info.activities.find(a => a.type === 4);
        el.feeling.textContent = customStatus?.state || "none";

        const playing = info.activities.find(a => a.type === 0);
        el.playing.textContent = playing?.name || "nothing";

        const watching = info.activities.find(a => a.type === 3);
        el.watching.textContent = watching?.name || "nothing";

        const reading = info.activities.find(a => a.state && a.name === "Reading");
        el.reading.textContent = reading?.state || "nothing";

        if (info.spotify) {
            const track = `${info.spotify.song} – ${info.spotify.artist}`;
            el.listening.textContent = track;
            localStorage.setItem(LASTFM_CACHE_KEY, track);
        } else {
            el.listening.textContent = localStorage.getItem(LASTFM_CACHE_KEY) || "nothing";
        }

    } catch (err) {
        console.error("Lanyard fetch error:", err);
    }
}

function updateClock() {
    const chicago = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    el.myTime.textContent = chicago;

    const visitor = new Date().toLocaleTimeString();
    el.yourTime.textContent = visitor;
}

// ------------------ Intervals ------------------
setInterval(fetchLanyard, 1000);
setInterval(updateClock, 1000);

fetchLanyard();
updateClock();