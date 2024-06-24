document.addEventListener('DOMContentLoaded', function() {
    const inputElement = document.getElementById('input');
    const charCountElement = document.getElementById('charCount');

    // Function to update character count in real-time
    function updateCharacterCount() {
        const inputText = inputElement.value;
        const charCount = inputText.length;
        charCountElement.textContent = charCount;
    }

    // Event listener for input changes in the textarea
    inputElement.addEventListener('input', updateCharacterCount);

    // Function to generate HTML listing based on input text
    function generateHtmlListing(text) {
        // Split input text into lines
        const lines = text.split('\n');
        let htmlOutput = '';
        let currentListType = null;
        let listStack = [];

        // Regular expressions to identify different list types
        const listTypes = {
            ul: /^-\s/,
            ol: /^\d+\.\s/,
            subul: /^o\s/
        };

        // Function to open a new list of given type
        function openList(type) {
            listStack.push(type);
            htmlOutput += `<${type}>\n`;
        }

        // Function to close the current list
        function closeList() {
            const type = listStack.pop();
            htmlOutput += `</${type}>\n`;
        }

        // Process each line of input text
        for (let line of lines) {
            line = line.trim(); // Remove leading and trailing whitespace
            if (!line) continue; // Skip empty lines

            let newListType = null;

            // Check which list type (ul, ol, subul) matches the current line
            for (let type in listTypes) {
                if (listTypes[type].test(line)) {
                    newListType = type;
                    break;
                }
            }

            // If a new list type is found and it's different from the current one,
            // close any open lists and start a new one of the new type
            if (newListType && newListType !== currentListType) {
                while (listStack.length) {
                    closeList();
                }
                currentListType = newListType;
                openList(currentListType);
            }

            // Generate HTML list item based on the detected list type
            switch (newListType) {
                case 'ul':
                    htmlOutput += `    <li>${line.substring(2)}</li>\n`;
                    break;
                case 'ol':
                    htmlOutput += `    <li>${line.replace(/^\d+\.\s/, '')}</li>\n`;
                    break;
                case 'subul':
                    if (!listStack.includes('ul')) {
                        openList('ul');
                    }
                    htmlOutput += `    <ul><li>${line.substring(2)}</li></ul>\n`;
                    break;
                default:
                    // If no list type is detected, assume it's a plain list item
                    if (!currentListType) {
                        openList('ul'); // Default to unordered list
                        currentListType = 'ul';
                    }
                    htmlOutput += `    <li>${line}</li>\n`;
            }
        }

        // Close any remaining open lists
        while (listStack.length) {
            closeList();
        }

        return htmlOutput;
    }

    // Function to convert input text to HTML and display in output area
    function convertText() {
        const inputText = inputElement.value;
        const htmlOutput = generateHtmlListing(inputText);

        // Display generated HTML code with syntax highlighting using Prism.js
        const outputElement = document.querySelector('#output code');
        outputElement.textContent = htmlOutput;
        Prism.highlightElement(outputElement);

        // Show copy button after generating HTML code
        const copyButton = document.getElementById('copyButton');
        if (copyButton) {
            copyButton.classList.remove('hidden');
        } else {
            console.error('Copy button element not found.');
        }
    }

    // Function to copy generated HTML code to clipboard
    function copyToClipboard() {
        const outputElement = document.querySelector('#output code');
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = outputElement.textContent;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        alert('A kért kód másolásra került.'); // Alert user after successful copy
    }

    // Event listener for convert button click
    const convertButton = document.querySelector('.button-group button');
    if (convertButton) {
        convertButton.addEventListener('click', convertText);
    } else {
        console.error('Convert button element not found.');
    }

    // Event listener for copy button click
    const copyButton = document.getElementById('copyButton');
    if (copyButton) {
        copyButton.addEventListener('click', copyToClipboard);
    } else {
        console.error('Copy button element not found.');
    }

    // Developer mode activation on Ctrl+Shift+D
    let devModeActive = false;
    const devControls = document.querySelector('.dev-controls');
    document.addEventListener('keydown', function(event) {
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

    // Function to update card animation based on inputs
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

    // Event listeners for input changes in animation controls
    tiltIntensityInput.addEventListener('input', updateCardAnimation);
    animationSpeedInput.addEventListener('input', updateCardAnimation);

    // Initial call to update card animation based on default inputs
    updateCardAnimation();

    // Function to update character count initially and on input change
    updateCharacterCount();
});
