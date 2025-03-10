// Available commands
window.commands = {
    'help': 'Available commands: help, clear, goHome, goAbout, goWork, changeHeader <text>, openSidebar, closeSidebar, date',
  
    'clear': () => {
      terminal.innerHTML = '';  // Clears terminal content
      commandHistory = [];      // Clears command history
      historyIndex = 0;         // Resets history index
      return '';  // No output, just clear the terminal
    },
  
    'goHome': () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });  // Scroll to the top (Home)
      return 'Navigating to the homepage...';
    },
  
    'goAbout': () => {
      const aboutSection = document.getElementById('about');
      aboutSection.scrollIntoView({ behavior: 'smooth' });  // Scroll to the About section
      return 'Navigating to the About section...';
    },
  
    'goWork': () => {
      const workSection = document.getElementById('work');
      workSection.scrollIntoView({ behavior: 'smooth' });  // Scroll to the Work section
      return 'Navigating to the Work section...';
    },
  
    'changeHeader': (input) => {
      const newHeaderText = input.substring(13).trim(); // Remove "changeHeader " from the input
      if (newHeaderText) {
        currentHeaderText = newHeaderText;
        headerDesktop.innerHTML = '';  // Clear existing text in header
        headerMobile.innerHTML = '';   // Clear existing text in mobile header
        let index = 0;
  
        function typeWriter() {
          if (index < newHeaderText.length) {
            headerDesktop.innerHTML += newHeaderText.charAt(index);
            headerMobile.innerHTML += newHeaderText.charAt(index);
            index++;
            setTimeout(typeWriter, 150); // Adjust typing speed here
          }
        }
        typeWriter(); // Start typing new text
        return `Header changed to: "${newHeaderText}"`;
      } else {
        return 'Please provide a new header text after the command.';
      }
    },
  
    'openSidebar': () => {
      mySidebar.style.display = 'block';  // Open the sidebar
      return 'Sidebar is now open.';
    },
  
    'closeSidebar': () => {
      mySidebar.style.display = 'none';  // Close the sidebar
      return 'Sidebar is now closed.';
    },
  
    'date': () => {
      const now = new Date();
      return `Current date and time: ${now.toLocaleString()}`;
    }
  };
  