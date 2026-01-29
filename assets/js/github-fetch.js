async function fetchGitHubProjects() {
  const username = 'EmirKahraman';
  const engineeringContainer = document.getElementById('engineering-container');
  const programmingContainer = document.getElementById('programming-container');

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
    const repos = await response.json();

    // Clear loading messages
    engineeringContainer.innerHTML = '';
    programmingContainer.innerHTML = '';

    repos.forEach(repo => {
      // Logic: If repo has 'engineering' topic, put it there. 
      // Otherwise, put it in programming if it has 'programming' or 'web' topics.
      const topics = repo.topics || [];
      
      const projectHTML = `
        <div class="w3-padding-16">
          <h5>${repo.name.replace(/-/g, ' ')}</h5>
          <div class="w3-row-padding" style="margin:8px 0">
            ${topics.map(t => `<span class="w3-tag w3-black" style="margin-right:4px">${t}</span>`).join('')}
          </div>
          <p>${repo.description || 'No description available.'}</p>
          <a href="${repo.html_url}" target="_blank" class="w3-button w3-light-grey w3-small">
            <i class="fa fa-github w3-margin-right"></i> View on GitHub
          </a>
        </div>
        <hr style="border-top: 1px solid #eee;">
      `;

      if (topics.includes('engineering')) {
        engineeringContainer.innerHTML += projectHTML;
      } else if (topics.includes('programming') || topics.includes('web-dev')) {
        programmingContainer.innerHTML += projectHTML;
      }
    });

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    engineeringContainer.innerHTML = '<p>Error loading projects. Please check GitHub.</p>';
  }
}

// Initialize the fetch
fetchGitHubProjects();