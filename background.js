chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "blockSite") {
        updateBlockingRules(message.url);
    }  
    else if (message.action === "unblockSite") {
        removeBlockingRule(message.url);
    } 
    else if (message.action === "resetRules") {
        clearAllDynamicRules();
    }
});

function updateBlockingRules(url) {
    const ruleId = generateRuleId(); //a method to generate a unique ID

    // const rule = {
    //     id: ruleId,
    //     priority: 1,
    //     action: { type: "block" },
    //     condition: { urlFilter: `||${url}^`, 
    //     resourceTypes: ["main_frame"] }
    // };

    const rule = {
        id: ruleId,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: `${url}`, 
        resourceTypes: ["main_frame"] }
    };

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule]
    });

    let obj = {};
    obj[url] = ruleId;
    chrome.storage.local.set(obj, function() {
        console.log(`Rule ID ${ruleId} stored for URL: ${url}`);
    });

}


function generateRuleId() {
const random = Math.floor(Math.random() * 1000);
return random;  
}



function removeBlockingRule(url) {
    // Retrieve the rule ID using the URL
    chrome.storage.local.get(url, function(result) {
        if (result[url]) {
            const ruleId = result[url];

            // Remove the rule with the retrieved ID
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error removing rule: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log(`Rule with ID ${ruleId} removed for ${url}`);

                    // Optionally, remove the URL and rule ID mapping from storage
                    chrome.storage.local.remove(url, function() {
                        console.log(`Removed mapping for URL: ${url}`);
                    });
                }
            });
        } else {
            console.log(`No stored rule ID found for ${url}`);
        }
    });
}


// Reset functionality is not working yet! 

function clearAllDynamicRules() {

 // Fetch all the dynamic rules
 chrome.declarativeNetRequest.getDynamicRules((rules) => {
    if (chrome.runtime.lastError) {
        console.error(`Error fetching rules: ${chrome.runtime.lastError.message}`);
        return;
    }

    // Extract the IDs of all the rules
    const ruleIds = rules.map(rule => rule.id);

    // Remove all the rules using their IDs
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error removing rules: ${chrome.runtime.lastError.message}`);
        } else {
            console.log("All dynamic rules cleared.");

            // Clear the local storage after the rules have been cleared
            chrome.storage.local.clear(() => {
                if (chrome.runtime.lastError) {
                    console.error(`Error clearing local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("Local storage cleared.");
                }
            });
        }
    });
});
}


