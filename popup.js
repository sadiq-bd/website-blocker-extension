const siteInput = document.getElementById('siteInput');
const addSiteButton = document.getElementById('addSite');
const sitesList = document.getElementById('sitesList');

// Load blocked sites and display them in the list
chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
  if (!blockedSites) blockedSites = [];
  blockedSites.forEach(site => addSiteToList(site));
});

// Add a site when the user clicks the "Add" button
addSiteButton.addEventListener('click', () => {
  const site = siteInput.value.trim();

  if (!site) return; // Ignore empty input

  chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
    if (!blockedSites) blockedSites = [];

    // Avoid duplicates
    if (!blockedSites.includes(site)) {
      const updatedSites = [...blockedSites, site];
      chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
        addSiteToList(site);
      });
    }
  });

  siteInput.value = '';
});

// Helper function to display the blocked site in the list
function addSiteToList(site) {
  const li = document.createElement('li');
  li.textContent = site;

  const removeButton = document.createElement('span');
  removeButton.textContent = 'Remove';
  removeButton.classList.add('remove');
  removeButton.addEventListener('click', () => {
    removeSite(site);
    li.remove();
  });

  li.appendChild(removeButton);
  sitesList.appendChild(li);
}

// Remove site from the list and update the storage
function removeSite(site) {
  chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
    const updatedSites = blockedSites.filter(s => s !== site);
    chrome.storage.sync.set({ blockedSites: updatedSites });
  });
}
