/*globals FileTransfer*/
function reportProgress(progressEvent) {
    if (progressEvent.lengthComputable) {
        document.getElementById("progressBar").setAttribute("value",
          (progressEvent.loaded / progressEvent.total));
    }
}

function downloadError(err) {
    console.log(`Encountered a download error: ${JSON.stringify(err, null, 2)}`);
}

function downloadSuccess(entry) {
    console.log(`Download completed successfully. ${JSON.stringify(entry, null, 2)}`);
}

function go() {
    let assetURL = "https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package/zipball/master";
    let downloadLocation = "cdvfile://localhost/temporary/index.zip";
    console.log(`getting ready to download ${assetURL}`);

    let fileTransfer = new FileTransfer();

    document.getElementById("cancelDownload").addEventListener("click", () => {
        fileTransfer.abort();
    });

    fileTransfer.onprogress = reportProgress;
    fileTransfer.download( assetURL, downloadLocation, downloadSuccess, downloadError);
}

document.addEventListener("deviceready", go);
