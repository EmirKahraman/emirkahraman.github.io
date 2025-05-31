// This script handles the terminal functionality for the website, including command processing, output display, and event handling.

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal-body');
    const output = document.getElementById('terminal-content');
    const input = document.getElementById('terminal-input');
    const sidebar = document.getElementById('sidebar');
    
    let commandHistory = [];
    let historyIndex = 0;

    // ================= TERMINAL FUNCTIONS =================
    function processCommand(command) {
        if (!command.trim()) return;    // Ignore empty commands
        
        commandHistory.push(command);           // Add command to history
        historyIndex = commandHistory.length;   // Reset history index
        
        const [cmd, ...args] = command.split(' ');  // Split command into command and arguments
        
        if (!commands[cmd]) {   // Check if command exists
            addOutput(`Command not found: ${cmd}`);
            return;
        }

        try {                   // Execute command
            const result = commands[cmd].execute(args);
            if (result) addOutput(result);
        } catch (error) {
            addOutput(`Error: ${error.message}\nUsage: ${cmd} ${commands[cmd].args.join(' ')}`);
        }

        setTimeout(() => {      // Scroll terminal to bottom and focus input
            terminal.scrollTop = terminal.scrollHeight;
            input.setSelectionRange(input.value.length, input.value.length);
        }, 10);
    }

    function addOutput(text, className = '') {  // Add output to terminal
        const line = document.createElement('div');
        if (className) line.className = className;
        line.style.whiteSpace = 'pre-wrap'; // This makes \n work
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    // ================= EVENT LISTENERS =================
    // Initial message
    addOutput('Website Terminal v1.0 - Type "help" for commands');
    processCommand('time');
    processCommand('date');
    processCommand('openmenu projects');
    //processCommand('nav home');
    
    terminal.addEventListener('click', () => input.focus());
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {            // Process command on Enter
            addOutput(`$ ${input.value}`, 'command');   // Display command
            processCommand(input.value);    // Process command
            input.value = '';               // Clear input field    
        } 
        else if (e.key === 'ArrowUp') {     // Navigate command history
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } 
        else if (e.key === 'ArrowDown') {   // Navigate command history
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
            e.preventDefault();
        } 
        else if (e.key === 'Tab') {         // Autocomplete command or argument
            e.preventDefault();
            const text = input.value.trim();
            const [cmd, ...args] = text.split(' ');
            
            // Command completion
            if (!cmd || args.length === 0) {
                const matches = Object.keys(commands).filter(c => c.startsWith(cmd));
                if (matches.length === 1) {
                    input.value = matches[0] + (commands[matches[0]].args.length ? ' ' : '');
                } else if (matches.length > 1) {
                    addOutput(`Possible commands: ${matches.join(', ')}`);
                }
            }
            // Argument completion
            else if (commands[cmd]) {
                const argIndex = args.length - 1;
                if (argIndex < commands[cmd].args.length) {
                    const expectedArg = commands[cmd].args[argIndex];
                    if (expectedArg.includes('|')) {
                        const options = expectedArg.split('|');
                        const matches = options.filter(o => o.startsWith(args[argIndex]));
                        if (matches.length === 1) {
                            args[argIndex] = matches[0];
                            input.value = [cmd, ...args].join(' ') + (argIndex < commands[cmd].args.length - 1 ? ' ' : '');
                        }
                    }
                }
            } 
        }
    });

    // Close sidebar on outside click using processCommand
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && sidebar.style.display === 'block') {
            if (
                !sidebar.contains(e.target) &&
                !document.querySelector('.w3-bar .w3-button.w3-right').contains(e.target)
            ) {
                processCommand('sidebar close');
            }
        }
    });

    // Apply saved theme on page load
    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('websiteTheme') || 'dark';
        if (savedTheme !== 'dark') {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        // Set initial theme in terminal
        if (typeof processCommand === 'function') {
            processCommand(`theme ${savedTheme}`);
        }
    });
    
    // Make processCommand available globally for HTML onclick handlers
    window.processCommand = processCommand;
});