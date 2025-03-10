// Global variables for command history and header text
let commandHistory = [];
let historyIndex = 0;
const terminal = document.getElementById('terminal');
const headerDesktop = document.getElementById("typing");
const headerMobile = document.getElementById("typing-mobile");

const defaultHeaderText = "Hello I'm Emir Kahraman,";  // Default text for the header
let currentHeaderText = defaultHeaderText;  // Store current header text

const mySidebar = document.getElementById("mySidebar");

// Step 1: Create the terminal with an initial input line
function createTerminal() {
  terminal.innerHTML = ''; // Clear any existing content
  createInputLine(); // Create the first input line
}

// Creates a new input line in the terminal
function createInputLine() {
  const inputLine = document.createElement('div');
  inputLine.classList.add('input-line');

  const prompt = document.createElement('span');
  prompt.textContent = '$ ';
  inputLine.appendChild(prompt);

  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.classList.add('command-input');
  inputEl.addEventListener('keydown', handleInputKeyDown);
  inputLine.appendChild(inputEl);

  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  cursor.textContent = '|';
  inputLine.appendChild(cursor);

  terminal.appendChild(inputLine);
  inputEl.focus();
}

// Step 2: Handle key events: Enter to process command, Arrow keys for history navigation
function handleInputKeyDown(event) {
  const inputEl = event.target;
  if (event.key === 'Enter') {
    const command = inputEl.value.trim();
    // Save non-empty commands in history.
    if (command !== '') {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
    }
    // Disable the current input to simulate command submission.
    inputEl.disabled = true;
    // Hide the blinking cursor in the current line.
    const cursor = inputEl.parentElement.querySelector('.cursor');
    if (cursor) {
      cursor.style.display = 'none';
    }
    // Process command and display its output.
    const output = processCommand(command);
    if (output !== undefined && output !== '') {
      const outputLine = document.createElement('div');
      outputLine.textContent = output;
      terminal.appendChild(outputLine);
    }
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      inputEl.value = commandHistory[historyIndex];
    }
    event.preventDefault();
  } else if (event.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputEl.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      inputEl.value = '';
    }
    event.preventDefault();
  }
}

// Step 3: Process the command and display output
function processCommand(command) {
  if (command === '') return;

  const baseCommand = command.split(' ')[0];
  let output = '';

  // Process the command (commands are handled in another file)
  if (window.commands.hasOwnProperty(baseCommand)) {
    const cmd = window.commands[baseCommand];
    output = typeof cmd === 'function' ? cmd(command) : cmd;
  } else {
    output = `Command not found: ${command}`;
  }

  // Append command and output to the terminal
  if (output) {
    const commandLine = document.createElement('div');
    commandLine.textContent = `$ ${output}`;
    terminal.appendChild(commandLine);
  }

  terminal.scrollTop = terminal.scrollHeight; // Auto-scroll to the latest output
}

// Initialize the terminal when the page loads.
createTerminal();
