chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0]
    const url = new URL(tab.url)
    const domain = url.hostname
    if (domain !== 'github.com') {
        const alertMessage = document.querySelector('#alertMessage')
        const buttons = document.querySelectorAll('.btn')
        alertMessage.classList.remove('d-none')
        buttons.forEach((button) => {
            button.disabled = true
        })
    }
})

const openAll = document.querySelector('#openAll');
const closeAll = document.querySelector('#closeAll');
const checkAll = document.querySelector('#checkAll');
const unCheckAll = document.querySelector('#unCheckAll');

openAll.addEventListener("click", async () => {
    chrome.storage.sync.set({ visibility: 'open' });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: manageFilesVisibility,
    });
});

closeAll.addEventListener("click", async () => {
    chrome.storage.sync.set({ visibility: 'close' });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: manageFilesVisibility,
    });
});

checkAll.addEventListener("click", async () => {
    chrome.storage.sync.set({ status: 'check' });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: manageFilesStatus,
    });
});

unCheckAll.addEventListener("click", async () => {
    chrome.storage.sync.set({ status: 'unCheck' });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: manageFilesStatus,
    });
});

manageFilesVisibility = () => {
    chrome.storage.sync.get("visibility", ({ visibility }) => {
        document.querySelectorAll('.js-details-target').forEach((file) => {
            const isFileExpanded = file.getAttribute('aria-expanded')
            if (visibility === 'open') {
                if (isFileExpanded === 'false') {
                    file.click()
                }
            } else {
                if (isFileExpanded === 'true') {
                    file.click()
                }
            }
        })
    });
}

manageFilesStatus = () => {
    chrome.storage.sync.get("status", ({ status }) => {
        document.querySelectorAll(".js-reviewed-toggle").forEach((file) => {
            const fileContent = file.firstElementChild
            if (status === "check") {
                if (!fileContent.checked) {
                    fileContent.click()
                }
            } else {
                if (fileContent.checked) {
                    fileContent.click()
                }
            }
        })
    });
}