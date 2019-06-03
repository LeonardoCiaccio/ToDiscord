const channelWebhookUrl = browser.i18n.getMessage("channelWebHookUrl");
const myWebhookUrl = browser.i18n.getMessage("discordMyUrl");
function send(url, content) {
    //verify and replace empty content
    content = content || "Hello World!";

    //create a json from the data
    var jsonData = JSON.stringify({
        "content": content,
        "ttl": false
    });

    //send request to discord webhook
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(jsonData);

    //read and log the response
    var response = xhr.response;
    console.log("Discord Response: " + response);

}

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

/*
Called when the url has been set in storage.
We'll just log success here.
*/
function onSuccess() {
    console.log("Url set successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
    console.log(`Error: ${error}`);
}

/*
Create all the context menu items.
*/
browser.menus.create({
    id: "send_to_discord_channel",
    title: browser.i18n.getMessage("menuItemSendToDiscordChannel"),
    contexts: ["selection", "link"]
}, onCreated);

browser.menus.create({
    id: "send_to_discord_me",
    title: browser.i18n.getMessage("menuItemSendToMe"),
    contexts: ["selection", "link"]
}, onCreated);

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "send_to_discord_channel":
            var data = info.linkUrl != null ? info.linkUrl : info.selectionText;
            send(channelWebhookUrl, data);
            break;
        case "send_to_discord_me":
            var data = info.linkUrl != null ? info.linkUrl : info.selectionText;
            send(myWebhookUrl, data);
            break;
    }
});