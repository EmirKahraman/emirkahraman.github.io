document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    const input = document.querySelector('.command-input');
    const sidebar = document.getElementById('sidebar');
    
    let commandHistory = [];
    let historyIndex = 0;
    
    // Initial message
    addOutput('Website Terminal v1.0 - Type "help" for commands');
    
    // Focus input on terminal click
    terminal.addEventListener('click', () => {
      input.focus();
    });
    
    // Handle input events
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processCommand(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
        e.preventDefault();
      }
    });
    
    window.processCommand = processCommand;
    
    // Core function to run terminal commands
    // This function will process the command and execute the corresponding action
    function processCommand(command) {
      if (!command.trim()) return;
      
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      
      addOutput(`$ ${command}`, 'command');
      
      const args = command.split(' ');
      const cmd = args[0].toLowerCase();
      
      switch(cmd) {
        case 'help':
            addOutput(`Available commands:
            - help: Show this help
            - clear: Clear terminal
            - nav [section]: Navigate to section (home, about, work)
            - sidebar [open|close|toggle]: Control mobile sidebar
            - title [text]: Change page title
            - color [element] [color]: Change element color
            - theme [light/dark]: Change theme`);
            break;
            
        case 'clear':
            output.innerHTML = '';
            break;
        
        // Navigate to a section
        case 'nav':
            if (args.length < 2) {
                addOutput('Usage: nav [section]');
                return;
            }
            
            const target = document.getElementById(args[1]);
            if (!target) {
                addOutput(`Section not found: ${args[1]}`);
                return;
            }
            
            target.scrollIntoView({ behavior: 'smooth' });
            addOutput(`Scrolling to ${args[1]} section...`);
            break;

        // Open/close/toggle the sidebar
        case 'sidebar':
            if (args.length < 2) {
                addOutput('Usage: sidebar [open|close|toggle]');
                return;
            }
            
            if (!sidebar) {
                addOutput('Sidebar element not found');
                return;
            }
            
            const action = args[1].toLowerCase();
            switch(action) {
                case 'open':
                    sidebar.style.display = 'block';
                    addOutput('Sidebar opened');
                    break;
                case 'close':
                    sidebar.style.display = 'none';
                    addOutput('Sidebar closed');
                    break;
                case 'toggle':
                    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
                    addOutput(`Sidebar ${sidebar.style.display === 'block' ? 'opened' : 'closed'}`);
                    break;
                default:
                    addOutput('Invalid action. Use open, close, or toggle');
            }
            break;
         
        // Change the title of the website and header text
        case 'title':
            if (args.length < 2) {
                addOutput('Usage: title [new title]');
                return;
            }
            
            const headerText = document.getElementById('header-text');
            if (!headerText) {
                addOutput('Header text element not found');
                return;
            }
            
            const newTitle = args.slice(1).join(' ');
            headerText.textContent = newTitle;
            addOutput(`Title changed to: ${newTitle}`);
            break;
            
        // Change the color of an element
        case 'color':
            if (args.length < 3) {
                addOutput('Usage: color [element] [color]');
                return;
            }
            
            const colorElement = document.getElementById(args[1]) || document.querySelector(args[1]);
            if (!colorElement) {
                addOutput(`Element not found: ${args[1]}`);
                return;
            }
            
            colorElement.style.color = args[2];
            addOutput(`Changed ${args[1]} color to ${args[2]}`);
            break;
            
        // Change the theme of the website
        case 'theme':
            if (args.length < 2) {
                addOutput('Usage: theme [light/dark]');
                return;
            }
            
            const body = document.body;
            if (args[1] === 'light') {
                body.style.backgroundColor = '#f5f5f5';
                body.style.color = '#333';
                addOutput('Changed theme to light');
            } else if (args[1] === 'dark') {
                body.style.backgroundColor = '#222';
                body.style.color = '#eee';
                addOutput('Changed theme to dark');
            } else {
                addOutput('Invalid theme. Use "light" or "dark"');
            }
            break;
            
        default:
            addOutput(`Command not found: ${cmd}`);
      }
    }

    function addOutput(text, className = '') { // Add output to the terminal
        const line = document.createElement('div');
        if (className) line.className = className;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    document.addEventListener('click', (e) => { // Close sidebar on outside click
        if (window.innerWidth <= 992 && sidebar && sidebar.style.display === 'block') {
            if (!sidebar.contains(e.target) && !document.querySelector('.w3-bar .w3-button.w3-right').contains(e.target)) {
                sidebar.style.display = 'none';
            }
        }
    });
});