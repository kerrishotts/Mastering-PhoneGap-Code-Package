/*globals FileTransfer, FileUploadOptions*/

function reportProgress(progressEvent) {
    if (progressEvent.lengthComputable) {
        console.log("Progress " + ((progressEvent.loaded / progressEvent.total) * 100));
    } else {
        console.log("Working...");
    }
}

function uploadError(err) {
    console.log(`Encountered an upload error: ${JSON.stringify(err, null, 2)}`);
}

function uploadSuccess(r) {
    console.log(`Upload completed successfully. ${JSON.stringify(r, null, 2)}`);
}

function doUpload() {
    let fileToUpload = "cdvfile://localhost/temporary/index.html";
    let uploadURL = encodeURI("https://mastering-phonegap-ch8-server-kerrishotts.c9.io/upload.php");
    console.log(`getting ready to upload ${uploadURL}`);

    let options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = "index.html";
    options.mimeType = "text/html";
    // method defaults to POST; to use PUT use options.httpMethod = "PUT"
    // defaults to chunked sending; use options.chunkedMode = false to turn off
    // params can be passed in with options.params
    // and headers can e passed in with options.headers

    let fileTransfer = new FileTransfer();
    fileTransfer.onprogress = reportProgress;
    fileTransfer.upload( fileToUpload, uploadURL, uploadSuccess, uploadError, options);
}


function downloadError(err) {
    console.log(`Encountered a download error: ${JSON.stringify(err, null, 2)}`);
}

function downloadSuccess(entry) {
    console.log(`Download completed successfully. ${JSON.stringify(entry, null, 2)}`);

    // now let's upload a file!
    doUpload();
}

function go() {
    let assetURL = encodeURI("http://kerrishotts.github.io/Mastering-PhoneGap-Code-Package/index.html");
    let downloadLocation = "cdvfile://localhost/temporary/index.html";
    console.log(`getting ready to download ${assetURL}`);

    let fileTransfer = new FileTransfer();
    fileTransfer.onprogress = reportProgress;
    fileTransfer.download( assetURL, downloadLocation, downloadSuccess, downloadError);
}

document.addEventListener("deviceready", go);


