function generateHtmlListing(text) {
    const lines = text.split('\n');
    let htmlOutput = "<ul>\n";
    let sublistOpen = false;
    const sublistPattern = /^o\s/;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (sublistPattern.test(line)) {
            if (!sublistOpen) {
                htmlOutput += "    <ul>\n";
                sublistOpen = true;
            }
            htmlOutput += `        <li>${line.substring(2)}</li>\n`;
        } else {
            if (sublistOpen) {
                htmlOutput += "    </ul>\n";
                sublistOpen = false;
            }
            htmlOutput += `    <li>${line}</li>\n`;
        }
    }

    if (sublistOpen) {
        htmlOutput += "    </ul>\n";
    }
    htmlOutput += "</ul>";

    return htmlOutput;
}

function convertText() {
    const inputText = document.getElementById('input').value;
    const htmlOutput = generateHtmlListing(inputText);
    const outputElement = document.querySelector('#output code');
    outputElement.textContent = htmlOutput;
    Prism.highlightElement(outputElement);

    // Select the copy button
    const copyButton = document.getElementById('copyButton');

    // Check if the copyButton is found
    if (copyButton) {
        copyButton.classList.toggle('hidden'); // Toggle the 'hidden' class
    } else {
        console.error('Nincs meg a gomb');
    }
}

function copyToClipboard() {
    const outputElement = document.querySelector('#output code');
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = outputElement.textContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert('A kért kód másolásra került.');
}

// Developer mode activation
let devModeActive = false;
const devControls = document.querySelector('.dev-controls');

document.addEventListener('keydown', function(event) {
    // Activate dev mode with Ctrl + Shift + D
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        devModeActive = !devModeActive;
        devControls.classList.toggle('visible', devModeActive);
        event.preventDefault();
    }
});

// Configurable tracking card animation
const card = document.querySelector('.tracking-card');
const container = document.querySelector('.card-container');
const tiltIntensityInput = document.getElementById('tilt-intensity');
const animationSpeedInput = document.getElementById('animation-speed');

function updateCardAnimation() {
    const tiltIntensity = 100 / tiltIntensityInput.value;
    const animationSpeed = animationSpeedInput.value;
    
    card.style.transition = `transform ${animationSpeed}ms ease`;

    container.onmousemove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / tiltIntensity;
        const rotateY = (centerX - x) / tiltIntensity;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    container.onmouseleave = () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
    };
}

tiltIntensityInput.oninput = updateCardAnimation;
animationSpeedInput.oninput = updateCardAnimation;

//
