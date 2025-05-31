// Command definitions for the terminal.js terminal

const terminal = document.getElementById('terminal-body');
const output = document.getElementById('terminal-content');
//const input = document.getElementById('terminal-input');
//const sidebar = document.getElementById('sidebar');

// ================= COMMAND DEFINITIONS =================
const commands = {
    man: {
        desc: "Show command documentation",
        args: ["command"],
        execute: ([command]) => {
            if (!command) {             // If no command specified, show all commands
                return `Available commands:\n${
                    Object.keys(commands)
                        .filter(cmd => !commands[cmd].hidden)
                        .sort()
                        .join(', ')
                }\n\nUse 'man <command>' for details`;
            }

            if (!commands[command]) {   // Check if command exists 
                return `No manual entry for '${command}'\nTry 'help' for available commands`;
            }

            const cmd = commands[command];
            let manual = `NAME\n    ${command} - ${cmd.desc}\n\n` +
                        `SYNOPSIS\n    ${command}`;
            
            if (cmd.args.length) {      // Only add args if they exist
                manual += ` ${cmd.args.map(arg => `<${arg}>`).join(' ')}`;
            }

            manual += `\n\nDESCRIPTION\n    ${cmd.desc}\n\n`;

            if (cmd.args.length) {      // Only add if there are arguments
                manual += `ARGUMENTS\n`;
                cmd.args.forEach(arg => {
                    manual += `    ${arg}\n`;
                    if (cmd.argDescriptions?.[arg]) {
                        manual += `        ${cmd.argDescriptions[arg]}\n`;
                    }
                });
                manual += `\n`;
            }

            if (cmd.examples?.length) { // Only add if examples exist
                manual += `EXAMPLES\n`;
                cmd.examples.forEach(example => {
                    manual += `    ${example}\n`;
                });
            }

            if (cmd.hidden) {       // Add hidden command note
                manual += `\nNote: This is a hidden command\n`;
            }
            return manual;
        }
    },
    help: {
        desc: "Show brief help for all commands",
        args: [],  // Explicitly define args as empty array
        argDescriptions: {}, // Add empty argDescriptions
        examples: [
            "help - List all available commands"
        ],
        execute: () => {
            let helpText = "Available commands:\n";
            for (const [cmd, config] of Object.entries(commands)) {
                // Skip hidden commands
                if (config.hidden) continue;
                
                helpText += `• ${cmd}`;
                
                // Only show args if they exist
                if (config.args && config.args.length) {
                    helpText += ` ${config.args.join(' ')}`;
                }
                
                helpText += `: ${config.desc}\n`;
            }
            return helpText;
        }
    },
    clear: {    // Clear terminal
        desc: "Clear the terminal screen",
        args: [],
        argDescriptions: {},
        examples: [
            "clear - Reset the terminal display"
        ],
        execute: () => {
            output.innerHTML = '';
        }
    },
    nav: {      // Navigate to sections
        desc: "Navigate to specific section of the website",
        args: ["section"],
        argDescriptions: {
            "section": "Available sections: home, about, work, terminal"
        },
        examples: [
            "nav home - Scroll to the home section",
            "nav about - Scroll to the about section"
        ],
        execute: ([section]) => {
            const target = document.getElementById(section);
            if (!target) throw new Error(`Section not found: ${section}`);
            target.scrollIntoView({ behavior: 'smooth' });
            return `Navigating to ${section} section...`;
        }
    },
    sidebar: {  // Control mobile sidebar
        desc: "Control the mobile navigation sidebar",
        args: ["action"],
        argDescriptions: {
            "action": "open, close, toggle"
        },
        examples: [
            "sidebar open - Force open sidebar",
            "sidebar toggle - Change current state"
        ],
        execute: ([action]) => {
            if (!sidebar) throw new Error("Sidebar element not found");
            action = action.toLowerCase();
            
            if (action === 'open') {
                sidebar.style.display = 'block';
                return 'Sidebar opened';
            } else if (action === 'close') {
                sidebar.style.display = 'none';
                return 'Sidebar closed';
            } else if (action === 'toggle') {
                sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
                return `Sidebar ${sidebar.style.display === 'block' ? 'opened' : 'closed'}`;
            }
            throw new Error('Invalid action. Use open, close, or toggle');
        }
    },
// WRITE THIS COMMAND WITHOUT TABLINK
    openmenu: {
        desc: "Switch between work categories",
        args: ["category"],
        argDescriptions: {
            "category": "Available categories: " + Array.from(document.querySelectorAll('.menu'))   // Get all menu categories from the DOM
                .map(menu => menu.id)   
                .join(', ')
        },
        examples: [
            "openmenu projects - Show all projects",
            "openmenu articles - Show some articles"
        ],
        execute: ([category]) => {
            if (!category) throw new Error("Please specify a category");
            
            // Get all existing menu categories from the DOM
            const menus = Array.from(document.querySelectorAll('.menu'));
            const validCategories = menus.map(menu => menu.id);
            
            // Validate category
            if (!validCategories.includes(category.toLowerCase())) {
                throw new Error(`Invalid category '${category}'. Available: ${validCategories.join(', ')}`);
            }
            
            // Hide all menus
            menus.forEach(menu => {
                menu.style.display = 'none';
            });
            
            // Show selected menu
            const menu = document.getElementById(category);
            if (!menu) throw new Error(`Menu element not found for ${category}`);
            menu.style.display = 'block';
            
            return `Opening ${category}...`;
        }
    },
    title: {
        desc: "Change the main header title text",
        args: ["text"],
        argDescriptions: {
            "text": "New title to display"
        },
        examples: [
            "title Hello World! - Sets header text",
            "title 'John Doe, Developer' - Use quotes for spaces"
        ],
        execute: ([...newTitle]) => {
            const headerText = document.getElementById('header-text');
            if (!headerText) throw new Error("Header text element not found");
            headerText.textContent = newTitle.join(' ');
            return `Title changed to: ${newTitle.join(' ')}`;
        }
    },
    time: {   // Display current time
        desc: "Display the current time",
        args: [],
        argDescriptions: {
            "": "Displays the current time in HH:MM:SS format"
        },
        examples: [
            "time - Display the current time"
        ],  
        execute: () => {
            return new Date().toLocaleTimeString();
        }
    },
    date: {   // Display current date
        desc: "Display the current date",
        args: [],
        argDescriptions: {
            "": "Displays the current date in YYYY-MM-DD format"
        },
        examples: [
            "date - Display the current date"
        ],
        execute: () => {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    },
    echo: {   // Echo text back
        desc: "Echo the provided text",
        args: ["text"],
        argDescriptions: {
            "text": "Text to echo back"
        },
        examples: [
            "echo Hello World! - Outputs 'Hello World!'",
            "echo 'This is a test' - Use quotes for multi-word text"
        ],
        execute: ([...text]) => {
            return text.join(' ');
        }
    },
// THIS COMMAND NEEEDS WORK
/*
    theme: {
        desc: "Change website color theme - type 'theme list' for options",
        args: ["color-preset|list"],
        argDescriptions: {
            "color-preset": "Name of color theme (e.g., engineer, dark, light, yildiz)",
            "list": "Show all available themes"
        },
        examples: [
            "theme list - Show all color themes",
            "theme engineer - Professional engineering theme (default)",
            "theme yildiz - Yıldız Technical University colors"
        ],
        execute: ([preset]) => {
            const themes = {
                engineer: {
                    bg: '#101010',
                    text: '#FFFFFF',
                    accent: '#4CAF50',
                    navbar: '#000000',
                    highlight: '#2196F3'
                },
                yildiz: {
                    bg: '#0a192f',
                    text: '#e6f1ff',
                    accent: '#FFD700',
                    navbar: '#002366',
                    highlight: '#64ffda'
                },
                dark: {
                    bg: '#121212',
                    text: '#e0e0e0',
                    accent: '#BB86FC',
                    navbar: '#1E1E1E',
                    highlight: '#03DAC6'
                },
                light: {
                    bg: '#f5f5f5',
                    text: '#212121',
                    accent: '#6200EE',
                    navbar: '#FFFFFF',
                    highlight: '#018786'
                }
            };

            if (!preset) {
                return "Current active theme\n" +
                    "Available presets: " + Object.keys(themes).join(', ') + 
                    "\nTry 'theme list' for previews";
            }

            if (preset === 'list') {
                let preview = "Available themes:\n";
                for (const [name, colors] of Object.entries(themes)) {
                    preview += `\n${name.padEnd(10)} ` +
                            `■ ${colors.bg} (background)\n`.padStart(25) +
                            ' '.repeat(11) +
                            `■ ${colors.text} (text)\n`.padStart(25) +
                            ' '.repeat(11) +
                            `■ ${colors.accent} (accent)\n`.padStart(25);
                }
                return preview;
            }

            if (!themes[preset]) {
                throw new Error(`Unknown theme '${preset}'\nTry: ${Object.keys(themes).join(', ')}`);
            }

            const { bg, text, accent, navbar, highlight } = themes[preset];
            document.body.style.backgroundColor = bg;
            document.body.style.color = text;
            
            // Update navbar
            const navbars = document.querySelectorAll('.w3-bar');
            navbars.forEach(nav => {
                nav.style.backgroundColor = navbar;
            });
            
            // Update links and accents
            document.querySelectorAll('a, .w3-text-teal').forEach(el => {
                el.style.color = accent;
            });
            
            document.querySelectorAll('.w3-opacity, .w3-text-grey').forEach(el => {
                el.style.color = highlight;
            });
            
            return `Theme set to ${preset}:\n` +
                `Background: ${bg}\n` +
                `Text: ${text}\n` +
                `Accent: ${accent}\n` +
                `Navbar: ${navbar}`;
        }
    },
    theme: {
        desc: "Change website theme - type 'theme list' for options",
        args: ["theme-name"],
        argDescriptions: {
            "theme-name": "Available: dark, light, yildiz, contrast"
        },
        examples: [
            "theme light - Switch to light theme",
            "theme list - Show all available themes"
        ],
        execute: ([themeName]) => {
            const availableThemes = {
                dark: "Default dark theme",
                light: "Light mode",
                yildiz: "Yildiz Technical University colors",
                contrast: "High contrast theme"
            };

            if (!themeName || themeName === 'list') {
                let themeList = "Available themes:\n";
                for (const [name, desc] of Object.entries(availableThemes)) {
                    themeList += `• ${name.padEnd(8)} - ${desc}\n`;
                }
                return themeList + "\nCurrent theme: " + 
                    (document.documentElement.getAttribute('data-theme') || 'dark');
            }

            if (!availableThemes[themeName]) {
                throw new Error(`Invalid theme. Available: ${Object.keys(availableThemes).join(', ')}`);
            }

            // Set theme in localStorage for persistence
            localStorage.setItem('websiteTheme', themeName);
            
            // Apply theme
            if (themeName === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', themeName);
            }

            return `Theme changed to ${themeName}`;
        }
    }
*/
    cv: {
        desc: "Display my professional information",
        args: ["section"],
        argDescriptions: {
            "section": "[education|experience|skills|languages|all]"
        },
        examples: [
            "cv education - Show my academic background",
            "cv all - Display complete CV"
        ],
        execute: ([section]) => {
            const cvData = {
                education: `
                YILDIZ TECHNICAL UNIVERSITY
                Bachelor of Science in Electrical Engineering
                • 4th Semester (Expected Graduation: 2026)
                • Istanbul, Türkiye
                `,
                
                experience: `
                ALAS ELEKTRİK AYDINLATMA AR-GE (Intern)
                • Jul 2024 - Aug 2024
                • Lighting product testing (IEC/EN standards)
                • Technical documentation creation
                
                YILDIZ TECHNICAL UNIVERSITY (Lab Assistant)
                • Nov 2023 - Present
                • Electrical/electronics lab support
                • PV panel measurements and analysis
                `,
                
                skills: `
                TECHNICAL SKILLS:
                • Testing: Battery/Composite materials, PV systems
                • Standards: IEC, EN, IEEE
                • Software: PSIM, MATLAB, AutoCAD, SOLIDWORKS
                • Programming: Python, Java, C, Rust, PLC
                `,
                
                languages: `
                LANGUAGES:
                • Turkish (Native)
                • English (Fluent)
                • German (Basic)
                • French (Basic)
                `,
                
                contact: `
                CONTACT:
                • Email: emirkah001@hotmail.com
                • Phone: [REDACTED]
                • LinkedIn: linkedin.com/in/emirkah001
                • GitHub: github.com/EmirKahraman
                `
            };

            if (!section || section === 'all') {
                return Object.values(cvData).join('\n\n');
            }
            
            if (!cvData[section]) {
                throw new Error(`Invalid CV section. Available: ${Object.keys(cvData).join(', ')}`);
            }
            
            return cvData[section];
        }
    },
    ls: {
        desc: "List website sections and resources",
        args: [],
        examples: [
            "ls - Show available sections"
        ],
        execute: () => {
            return `
            SITE STRUCTURE:
            
            /home         - Landing page
            /about        - Professional profile
            /work         - Experience & projects
            /terminal     - This interactive terminal
            
            RESOURCES:
            /cv           - Professional CV
            /contact      - Contact information
            /projects     - Technical projects
            
            Use 'nav <section>' to navigate
            `;
        }
    },
    yildiz: {
        desc: "Information about Yıldız Technical University",
        args: [],
        examples: [
            "yildiz - Show university information"
        ],
        execute: () => {
            return `
            YILDIZ TECHNICAL UNIVERSITY
            
            • Founded: 1911
            • Location: Istanbul, Turkey
            • My Program: BSc Electrical Engineering
            • Expected Graduation: 2026
            
            Notable Features:
            - Strong engineering programs
            - Modern research facilities
            - International collaborations
            
            Website: https://www.yildiz.edu.tr
            `;
        }
    }
};