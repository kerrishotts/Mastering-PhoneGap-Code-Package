<?php
/*
 * This file accepts the upload data
 */

// configuration
$maximumFileSize = 5 * 1024 * 1024;        // We won't take a file over 5MB
                                           // of course, post_max_size and upload_max_filesize
                                           // have to be set appropriately as well in php.ini
$uploadLocation = "../upload/";            // where we want our files stored
$validMimeTypes = array("text/plain",      // accept plain text files
                        "text/html",       // HTML files
                        "image/png",       // PNG files
                        "image/jpeg");     // JPG files

// copy out the file data, including errors, size, and types
$uploadedFile = $_FILES['file'];
$uploadedFileError = $uploadedFile['error'];
$uploadedFileSize = $uploadedFile['size'];
$uploadedFileType = $uploadedFile['type'];
$uploadedFilePath = $uploadedFile['tmp_name'];

// error checking based on http://php.net/manual/en/features.file-upload.php#114004
try {
    // first, let's check to make sure someone's not trying to pull something funny
    if(!isset($uploadedFileError) || is_array($uploadedFileError)) {
        throw new RuntimeException("Invalid arguments");
    }

    // check the file upload error.
    switch($uploadedFileError) {
        case UPLOAD_ERR_OK:
            // not really an error; the file is now on our filesystem
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException("No file sent");
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException("File too large");
            break;
        default:
            throw new RuntimeException("Unknown error");
    }

    // don't rely upon any maximum size defined in php.ini or anywhere else;
    // let's be explicit
    if ($uploadedFileSize > $maximumFileSize) {
        throw new RuntimeException("File too large");
    }

    // double check the mimetype. We can check $uploadedFileType, but it
    // can be overridden by the client. So we should also check the real
    // mime type. Keep in mind that it's still possible for the file to
    // be malicious, so you should perform additional verification on it.
    // (but this is beyond the scope of the chapter).

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actualFileType = finfo_file($finfo, $uploadedFilePath);

    if (!in_array($uploadedFileType, $validMimeTypes) ||
        !in_array($actualFileType, $validMimeTypes)) {
        throw new RuntimeException("File format isn't valid");
    }

    // create the new filename -- NEVER use the filename supplied by the
    // client; you may encounter filename collisions (or worse)
    $newFileName = "upload_" . uniqid();

    // move the uploaded file from the temporary location to the new location
    // if we don't, the uploaded file will be removed
    if(move_uploaded_file($uploadedFilePath, $uploadLocation.$newFileName)) {
        echo "File uploaded successfully!";
    } else {
        throw new RuntimeException("File failed to upload (".error_get_last().")");
    }
} catch (RuntimeException $err) {
    // generate a 500 server error
    http_response_code(500);
    // and give some error information
    echo $err->getMessage();
}
?>
