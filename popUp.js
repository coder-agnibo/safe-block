document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('blockButton');
    const unblockButton = document.getElementById('unblockButton'); 
    const reset = document.getElementById('reset'); 
    const input = document.getElementById('urlInput'); 

    
    input.addEventListener('focus', function() {
        input.setAttribute('placeholder', '');
    })


    input.addEventListener('blur', function() {
        input.setAttribute('placeholder', 'Enter website to block');
    })


    button.addEventListener('click', function() {
        const url = document.getElementById('urlInput').value; 
        if (url) {
            chrome.runtime.sendMessage({ action: "blockSite", url: url });
        };
    });

    unblockButton.addEventListener('click', function() {
        const url = document.getElementById('urlInput').value; 
        if (url) {
            chrome.runtime.sendMessage({ action: "unblockSite", url: url });
        }
    });

    reset.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "resetRules" });
    });

});


