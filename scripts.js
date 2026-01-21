const USER_ID = "1393281918526558288";
const API_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`;
const FALLBACK_PFP = "./images/throbber.gif";

const STATUS_COLORS = {
    online:"#43b581",
    idle:"#faa61a",
    dnd:"#f04747",
    offline:"#747f8d"
};

function updatePresence(){
    fetch(API_URL)
        .then(r => r.json())
        .then(j => {
            if (!j.success) return;
            const d = j.data;

            const pfp = document.getElementById("pfp");
            pfp.onerror = () => pfp.src = FALLBACK_PFP;
            pfp.src = d.discord_user.avatar
                ? `https://cdn.discordapp.com/avatars/${USER_ID}/${d.discord_user.avatar}.png?size=256`
                : FALLBACK_PFP;

            document.getElementById("username").textContent = d.discord_user.username;

            const status = d.discord_status || "offline";
            const icon = document.querySelector(".discordstatus");
            const color = STATUS_COLORS[status];
            icon.style.color = color;
            icon.style.backgroundColor = color;

            const thought = document.querySelector(".discordthoughtbubble");
            const custom = d.activities.find(a => a.type === 4);

            if (custom && (custom.state || custom.emoji)) {
                let emoji = "";

                if (custom.emoji) {
                    if (custom.emoji.id) {
                        emoji = `<img src="https://cdn.discordapp.com/emojis/${custom.emoji.id}.png" style="height:1em;vertical-align:-0.15em;"> `;
                    } else {
                        emoji = `${custom.emoji.name} `;
                    }
                }

                thought.innerHTML = emoji + (custom.state || "");
                thought.style.display = "block";
            } else {
                thought.style.display = "none";
            }

            const gName = document.getElementById("activity-name");
            const gState = document.getElementById("activity-state");
            const gDetail = document.getElementById("activity-detail");
            const gBig = document.getElementById("activity-big-image");
            const gSmall = document.querySelector(".activity-small-image");

            const game = d.activities.find(a => a.type === 0) || null;

            if (game) {
                gName.textContent = game.name || "";
                gState.textContent = game.state || "";
                gDetail.textContent = game.details || "";

                if (game.assets?.large_image) {
                    gBig.src = game.assets.large_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${game.assets.large_image.replace("mp:","")}`
                        : `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`;
                } else {
                    gBig.src = "images/throbber.gif";
                }

                if (game.assets?.small_image) {
                    gSmall.src = game.assets.small_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${game.assets.small_image.replace("mp:","")}`
                        : `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.small_image}.png`;
                    gSmall.style.display = "block";
                } else {
                    gSmall.style.display = "none";
                }
            } else {
                gName.textContent = "No activity";
                gState.textContent = "";
                gDetail.textContent = "";
                gBig.src = "images/throbber.gif";
                gSmall.style.display = "none";
            }

            const sCard = document.querySelector(".spotify-card");

            if (d.spotify && d.spotify.song) {
                sCard.classList.remove("hidden");
                sCard.querySelector(".spotify-track").textContent = d.spotify.song;
                sCard.querySelector(".spotify-artist").textContent = d.spotify.artist;
                sCard.querySelector(".spotify-album").textContent = d.spotify.album;
                sCard.querySelector(".spotify-album-art").src = d.spotify.album_art_url;
            } else {
                sCard.classList.add("hidden");
            }
        })
        .catch(() => {
            document.getElementById("pfp").src = FALLBACK_PFP;
        });
}

updatePresence();
setInterval(updatePresence, 5000);
(function(){
    // Pick a random background once per tab
    if(!sessionStorage.getItem("bgIndex")){
        let index = Math.floor(Math.random() * 9) + 1;
        sessionStorage.setItem("bgIndex", index);
    }

    const bgIndex = sessionStorage.getItem("bgIndex");
    const bgUrl = `/images/background-${bgIndex}.png`;

    const img = new Image();
    img.src = bgUrl;

    img.onload = function(){
        // Set the background image
        document.body.style.backgroundImage = `url('${bgUrl}')`;

        // Analyze brightness
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;

        let r, g, b, brightness;
        let totalBrightness = 0;
        const sampleStep = 4 * 1000;

        for(let i=0; i<data.length; i+=sampleStep){
            r = data[i];
            g = data[i+1];
            b = data[i+2];
            brightness = (r*0.299 + g*0.587 + b*0.114);
            totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (data.length / sampleStep);

        // Dim overlay if the image is bright
        if(avgBrightness > 127){
            const overlay = document.getElementById("background-overlay");
            if(overlay){
                overlay.style.backgroundColor = "rgba(0,0,0,0.5)"; // 50% dark
            }
        }
    }
})();