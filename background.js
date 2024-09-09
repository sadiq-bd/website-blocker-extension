// Function to update blocked sites by creating new rules
function updateBlockedSites() {
  chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
    if (!blockedSites) blockedSites = [];

    // Retrieve all current dynamic rules
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map(rule => rule.id);
      const newRuleIds = Array.from({ length: blockedSites.length }, (_, i) => i + 1);

      // Remove all existing rules (we will re-add them with the correct sites)
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds // Remove all current rules
      }, () => {
        // Create new rules for sites currently in the blocked list
        const newRules = blockedSites.map((site, index) => ({
          id: index + 1, // Make sure each new rule has a unique ID
          priority: 1,
          action: { type: "block" },
          condition: { urlFilter: `*://*${site}/*`, resourceTypes: ["main_frame"] }
        }));

        // Add the new rules
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: newRules
        });
      });
    });
  });
}

// Initialize the blocking rules when the extension loads
chrome.runtime.onInstalled.addListener(updateBlockedSites);
chrome.runtime.onStartup.addListener(updateBlockedSites);

// Listen for changes in the blockedSites in storage and update rules accordingly
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    updateBlockedSites();
  }
});
