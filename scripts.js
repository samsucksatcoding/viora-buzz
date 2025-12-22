document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.querySelector('.cli-input');
    const history = document.getElementById('history');

    async function streamText(text, targetElement = null) {
        if (!text) return;
        const wordSpeed = 60;
        
        if (!targetElement) {
            targetElement = document.createElement('p');
            targetElement.classList.add('cli');
            history.appendChild(targetElement);
        }

        const words = text.split(" ");
        targetElement.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;> "; 

        for (const word of words) {
            targetElement.innerHTML += word + " ";
            await new Promise(resolve => setTimeout(resolve, wordSpeed));
        }
    }

    inputField.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.toLowerCase().trim();
            inputField.value = '';
            
            if (command === '') return;

            const cmdLine = document.createElement('p');
            cmdLine.classList.add('cli');
            cmdLine.innerHTML = `&nbsp;&nbsp;&nbsp;sam@cloud:~$ ${command}`;
            history.appendChild(cmdLine);

            if (command === 'clear') {
                history.innerHTML = '';
                return;
            }

            if (command === 'neofetch') {
                const neoContainer = document.createElement('div');
                neoContainer.className = 'neofetch-container';
                
                const logoHtml = `⠀⠀⠀⣤⣴⣾⣿⣿⣿⣿⣿⣶⡄⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⣠⡄
⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⢰⣦⣄⣀⣀⣠⣴⣾⣿⠃
⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⠀
⠀⠀⣼⣿⡿⠿⠛⠻⠿⣿⣿⡇⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠀⠀⠉⠀⠀⠀⢀⠀⠀⠀⠈⠁⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀
⠀⠀⣠⣴⣶⣿⣿⣿⣷⣶⣤⠀⠀⠀⠈⠉⠛⠛⠛⠉⠉⠀⠀⠀
⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⣶⣦⣄⣀⣀⣀⣤⣤⣶⠀⠀
⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
⢠⣿⡿⠿⠛⠉⠉⠉⠛⠿⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀
⠘⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⠛⠀⠀⠀`;
                
                const specsHtml = `<span style="color: #00adef">OS:</span> Windows 10 Pro\n<span style="color: #00adef">CPU:</span> Intel Core I3-6100\n<span style="color: #00adef">RAM:</span> 8GB DDR4 2133MHz\n<span style="color: #00adef">DISK:</span> TOSHIBA MQ01ABD100\n<span style="color: #00adef">NET:</span> 192.168.0.3\n<span style="color: #00adef">GPU:</span> Intel HD Graphics 530`;

                neoContainer.innerHTML = `
                    <pre class="ascii-logo">${logoHtml}</pre>
                    <div class="specs">${specsHtml}</div>
                `;
                
                history.appendChild(neoContainer);
            } else {
                let response = '';
                switch (command) {
                    case 'help':
                    case 'commands':
                        response = 'available: [about, social, neofetch, discord, clear]';
                        break;
                    case 'about':
                        response = 'I am a front-end web developer, I own this and orbitt.sbs I make many projects (available on my github)';
                        break;
                    case 'social':
                        response = 'find me on github: @samsucksatcoding';
                        break;
                    case 'discord':
                        response = 'Opening Discord invite...';
                        window.open('https://discord.gg/nj5eqhWqbm', '_blank');
                        break;
                    default:
                        response = `command not found: ${command}`;
                }
                await streamText(response);
            }
            
            inputField.scrollIntoView({ behavior: 'smooth' });
        }
    });

    async function start() {
        await streamText("welcome to my corner of the internet", document.getElementById('typewriter-1'));
        await streamText("i don't even know anymore", document.getElementById('typewriter-2'));
    }
    
    start();
});