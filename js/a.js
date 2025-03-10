function createTerminal() {
    const terminal = document.getElementById('terminal');
    
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';
  
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = '$';
  
    const inputEl = document.createElement('input');
    inputEl.className = 'terminal-input';
    inputEl.type = 'text';
    inputEl.autocomplete = 'off';
  
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
  
    // Append the prompt, input field, and cursor to the input line.
    inputLine.appendChild(promptSpan);
    inputLine.appendChild(inputEl);
    inputLine.appendChild(cursorSpan);
  
    // Append the input line to the terminal.
    terminal.appendChild(inputLine);
  
    // Focus the new input field.
    inputEl.focus();
  
    // Attach the keydown event listener.
    inputEl.addEventListener('keydown', handleInputKeyDown);
  }
  
  // Initialize the terminal when the page loads.
  createTerminal();