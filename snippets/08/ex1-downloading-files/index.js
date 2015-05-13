/*globals FileTransfer*/
function downloadError(err) {
    console.log(`Encountered a download error: ${JSON.stringify(err, null, 2)}`);
}

function downloadSuccess(entry) {
    console.log(`Download completed successfully. ${JSON.stringify(entry, null, 2)}`);
}


function go() {
    let assetURL = "http://kerrishotts.github.io/Mastering-PhoneGap-Code-Package/index.html";
    let downloadLocation = "cdvfile://localhost/temporary/index.html";
    console.log(`getting ready to download ${assetURL}`);

    let fileTransfer = new FileTransfer();
    fileTransfer.download( assetURL, downloadLocation, downloadSuccess, downloadError);
}

document.addEventListener("deviceready", go);


