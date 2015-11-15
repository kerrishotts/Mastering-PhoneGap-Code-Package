# Requirements

Generally, PhoneGap / Cordova is capable of running on reasonably modest hardware as long as you can test on physical devices.
Running your app in a simulator or emulator, however, will require more substantial hardware. Furthermore, if you intend on using
an IDE like WebStorm or the like, you'll need a machine capable of running that IDE.

> **Important**: if you plan on building any of the code for iOS and running it on a physical device, you'll need Xcode 7 or better,
> as well as a recent Mac running OS X 10.10.5 or better.

## Hardware Requirements

If you intend on using a simulator or emulator, you'll need reasonable hardware. The following is simply a recommendation, and you
may be able to get by on less if you test solely on a physical device.

* Intel-based CPU with virtualization support (VT-x or AMD-V); 64-bit highly recommended
* 2GB RAM (8GB recommended)
* 1280x800 minimum screen resolution (1920x1080 or better recommended)
* 8GB storage space
* OpenGL 2.0 capable video card for emulators

## Operating System Requirements

The following operating systems can be used:

* Microsoft Windows Vista or better (32 or 64-bit)
* Linux: Any modern distro supporting: GNU C library 2.15+, if 64-bit, must be able to run 32-bit apps. Ubunutu must be 14.04+
* OS X: 10.10.5 ("Yosemite") or better

> **Important**: To build for iOS, you **must** have OS X, as well as Xcode 7 or higher. Building for Android can be done on any of
> the above platforms.

## Software Requirements

### General Requirements

You'll need the following in order to get started with the book:

* ANT 1.9.4 or better; download at <http://ant.apache.org/bindownload.cgi>
* Java 7 Development Kit (JDK); download at <http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html>.
* Node v0.12 or better; download at <https://nodejs.org>, or use NVM <https://github.com/creationix/nvm>.
* Cordova / PhoneGap 5.4 or higher; download at <http://cordova.apache.org> or <http://www.phonegap.com>.
* Xcode 7 or better for iOS builds; download from the Mac App Store.
* Android SDK (API level 19 or better) for Android builds; download at <http://developer.android.com/sdk/index.html>.

### Chapter-specific

In addition to the above, each chapter will introduce new requirements. These will be mentioned in each chapter, so you don't need them installed in advance (you can install them all using `npm install` in the project directory. Note that each chapter generally builds upon the requirements of the previous chapters. As such, we only list the first chapter where certain software is required.

| Chapter |    Software         | Min Version | Website                                                     |
|:-------:|:--------------------|:-----------:|:------------------------------------------------------------|
|    1    | babel-eslint        | 4.1.3       | <https://www.npmjs.com/package/babel-eslint>                |
|         | cordova-lib         | 5.4.x       | <https://www.npmjs.com/package/cordova-lib>                 |
|         | cordova-ios         | 3.9.1       | <https://www.npmjs.com/package/cordova-ios>                 |
|         | cordova-android     | 4.1.1       | <https://www.npmjs.com/package/cordova-android>             |
|         | cordova-tasks       | 0.2.0       | <https://www.npmjs.com/package/cordova-tasks>               |
|         | gulp                | 3.9.0       | <https://www.npmjs.com/package/gulp>                        |
|         | gulp-babel          | 5.2.1 (NOT 6.x)      | <https://www.npmjs.com/package/gulp-babel>                  |
|         | gulp-bump           | 1.0.0       | <https://www.npmjs.com/package/gulp-bump>                   |
|         | gulp-concat         | 2.6.0       | <https://www.npmjs.com/package/gulp-concat>                 |
|         | gulp-jscs           | 3.0.0       | <https://www.npmjs.com/package/gulp-jscs>                   |
|         | gulp-eslint         | 1.0.0       | <https://www.npmjs.com/package/gulp-eslint>                 |
|         | gulp-notify         | 2.2.0       | <https://www.npmjs.com/package/gulp-notify>                 |
|         | gulp-plumber        | 1.0.1       | <https://www.npmjs.com/package/gulp-plumber>                |
|         | gulp-rename         | 1.2.2       | <https://www.npmjs.com/package/gulp-rename>                 |
|         | gulp-replace-task   | 0.11.0      | <https://www.npmjs.com/package/gulp-replace-task>           |
|         | gulp-sourcemaps     | 1.6.0       | <https://www.npmjs.com/package/gulp-sourcemaps>             |
|         | gulp-uglify         | 1.4.1       | <https://www.npmjs.com/package/gulp-uglify>                 |
|         | gulp-util           | 3.0.6       | <https://www.npmjs.com/package/gulp-util>                   |
|         | merge-stream        | 1.0.0       | <https://www.npmjs.com/package/merge-stream>                |
|         | rimraf              | 2.4.3       | <https://www.npmjs.com/package/rimraf>                      |
|         | sprintf-js          | 1.0.3       | <https://www.npmjs.com/package/sprintf>                     |
|         | tiny-lr             | 0.1.5       | <https://www.npmjs.com/package/tiny-lr>                     |
|    2    | babel               | 5.8.23 (NOT 6.x)      | <https://www.npmjs.com/package/babelify>                    |
|         | babelify            | 6.3.0       | <https://www.npmjs.com/package/babelify>                    |
|         | browserify          | 11.2.0      | <https://www.npmjs.com/package/browserify>                  |
|         | vinyl-buffer        | 1.0.0       | <https://www.npmjs.com/package/vinyl-buffer>                |
|         | vinyl-source-stream | 1.1.0       | <https://www.npmjs.com/package/vinyl-source-stream>         |
|         | yasmf-h             | 0.1.3       | <https://www.npmjs.com/package/yasmf-h>                     |
|    3    | desassify           | 0.1.8       | <https://www.npmjs.com/package/desassify>                   |
|         | gulp-sass           | 2.0.4       | <https://www.npmjs.com/package/gulp-sass>                   |
|         | node-reset-scss     | 1.0.1       | <https://www.npmjs.com/package/node-reset-scss>             |
|    7    | Indexed DB Plugin   | 0.1.0       | <http://plugreg.com/plugin/DickvdBrink/cordova-indexeddb>   |
|    8    | SQLite Plugin       | 1.0.5       | <http://plugreg.com/plugin/brodysoft/Cordova-SQLitePlugin>  |
|    9    | File Transfer Plugin| 0.5.0       | <http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer> |
|   11    | Adobe Illustrator   | CC 2014\*   | <http://www.adobe.com/products/illustrator.html>            |
|         | Adobe Photoshop     | CC 2014\*   | <http://www.adobe.com/products/photoshop.html>              |

> \* Adobe Illustrator is a vector editing program. You can use any vector editor with a similar feature set. Adobe Photoshop
> is a reaster graphics editor (with some vector editing bolted on). You can use any raster graphics editor with a similar
> feature set.

## Device Requirements

If you're planning on testing the code in this book on your device, you'll need a device that meets the following minimum requirements:

* Android Device: Android 4.4 or higher
* iPhone / iPad: iOS 7 or higher
