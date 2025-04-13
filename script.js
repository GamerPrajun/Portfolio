// Custom cursor functionality
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Hide default cursor
document.body.style.cursor = 'none';

// Mouse move event
document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    
    // Smooth follower movement
    setTimeout(() => {
        cursorFollower.style.left = x + 'px';
        cursorFollower.style.top = y + 'px';
    }, 80);
});

// Click effects
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Hover effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .social-link');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.border = '2px solid var(--primary-color)';
        cursorFollower.style.backgroundColor = 'transparent';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.border = '2px solid var(--primary-color)';
        cursorFollower.style.backgroundColor = 'var(--primary-color)';
    });
});

// Terminal functionality
document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.querySelector('.terminal-body');
    let currentInput = null;
    let lastCommandLine = null;

    // Store original content
    const originalContent = {
        nameDisplay: document.querySelector('.name-display').outerHTML,
        aboutContent: document.querySelector('.about-content').outerHTML,
        skillsGrid: document.querySelector('.skills-grid').outerHTML,
        contactContent: document.querySelector('.contact-content').outerHTML
    };

    function createNewCommandLine() {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `
            <span class="prompt">root@prajun:~#</span>
            <input type="text" class="command-input" spellcheck="false">
        `;
        
        // Remove previous input if it exists
        if (currentInput) {
            const oldCommandLine = currentInput.closest('.command-line');
            if (oldCommandLine) {
                const commandText = document.createElement('span');
                commandText.className = 'command-text';
                commandText.textContent = currentInput.value;
                currentInput.replaceWith(commandText);
            }
        }
        
        terminalBody.appendChild(commandLine);
        currentInput = commandLine.querySelector('.command-input');
        currentInput.focus();
        lastCommandLine = commandLine;
        
        return commandLine;
    }

    function executeCommand(command) {
        const output = document.createElement('div');
        output.className = 'output';
        
        switch(command.toLowerCase()) {
            case 'help':
                output.innerHTML = `Available commands:
• help - Show this help message
• clear - Clear the terminal
• whoami - Show user information
• cat about.txt - Show about information
• ls skills/ - List skills
• cat contact.txt - Show contact information`;
                break;
                
            case 'clear':
                // Clear everything except hidden content
                const hiddenContent = document.querySelector('.hidden-content');
                terminalBody.innerHTML = '';
                terminalBody.appendChild(hiddenContent);
                createNewCommandLine();
                return;
                
            case 'whoami':
                output.innerHTML = originalContent.nameDisplay;
                break;
                
            case 'cat about.txt':
                output.innerHTML = originalContent.aboutContent;
                break;
                
            case 'ls skills/':
                output.innerHTML = originalContent.skillsGrid;
                break;
                
            case 'cat contact.txt':
                output.innerHTML = originalContent.contactContent;
                break;
                
            default:
                output.innerHTML = `Command not found: ${command}
Type 'help' for available commands`;
                output.className = 'output error-message';
        }
        
        if (lastCommandLine) {
            lastCommandLine.after(output);
        } else {
            terminalBody.appendChild(output);
        }
    }

    // Handle command input
    function handleCommand(e) {
        if (e.key === 'Enter') {
            const command = e.target.value.trim();
            if (command) {
                executeCommand(command);
                createNewCommandLine();
            }
        }
    }

    // Initialize first command line
    createNewCommandLine();

    // Event delegation for command inputs
    terminalBody.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('command-input')) {
            handleCommand(e);
        }
    });

    // Focus input when clicking terminal
    terminalBody.addEventListener('click', () => {
        if (currentInput) {
            currentInput.focus();
        }
    });
}); 
