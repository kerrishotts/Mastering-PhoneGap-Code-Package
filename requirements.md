# Requirements

Generally, PhoneGap / Cordova is capable of running on reasonably modest hardware as long as you can test on physical devices.
Running your app in a simulator or emulatore, however, will require more substantial hardware. Furthermore, if you intend on using
an IDE like WebStorm or the like, you'll need a machine capable of running that IDE.

> **Important**: if you plan on building any of the code for iOS and running it on a physical device, you'll need to be a member of
> Apple's iOS Developer program, which costs $99/year. You'll also need a recent Mac running 10.9.4 or later and Xcode 6.1 or higher.

# Hardware Requirements

If you intend on using a simulator or emulator, you'll need reasonable hardware. The following is simply a recommendation, and you
may be able to get by on less if you test solely on a physical device.

* Intel-based CPU with virtualization support (VT-x or AMD-V); 64-bit highly recommended
* 2GB RAM (8GB recommended)
* 1024x768 minimum screen resolution (1920x1080 or better recommended)
* 8GB storage space
* OpenGL 2.0 capable video card for emulators

# Operating System Requirements

The following operating systems can be used:

* Microsoft Windows XP or higher
* Linux: Any modern distro supporting: GNU C library 2.7+, if 64-bit, must be able to run 32-bit apps. Ubunutu must be 8.04+
* OS X: 10.9.4 ("Mavericks") or higher

> **Important**: To build for iOS, you **must** have OS X, as well as Xcode 6 or higher. Building for Android can be done on any of
> the above platforms.

# Software Requirements

## General Requirements

You'll need the following in order to get started with the book:

* Node v0.10 or better (<https://nodejs.org>)
* Cordova / PhoneGap 3.6 or higher (<http://cordova.apache.org> or <http://www.phonegap.com>)
* Xcode 6.1 or higher for iOS builds
* Android SDK (API level 19 or better) for Android builds (<http://developer.android.com/sdk/index.html>)

## Chapter-specific

In addition to the above, each chapter will introduce new requirements. These will be mentioned in each chapter, 
so you don't need them installed in advance. Note that each chapter generally builds upon the requirements of the
previous chapters. As such, we only list the first chapter where certain software is required.

| Chapter |    Software         | Min Version | Website                                                     |
|:-------:|:--------------------|:-----------:|:------------------------------------------------------------|
|    1    | cordova-lib         | 4.2.0+      | <https://www.npmjs.com/package/cordova-lib>                 |
|         | cordova-ios         | 3.7.0+      | <https://www.npmjs.com/package/cordova-ios>                 |
|         | cordova-android     | 3.7.0+      | <https://www.npmjs.com/package/cordova-android>             |
|         | gulp                | 3.8.10+     | <https://www.npmjs.com/package/gulp>                        |
|         | gulp-babel          | 4.0.0+      | <https://www.npmjs.com/package/gulp-babel>                  |
|         | gulp-bump           | 0.1.13+     | <https://www.npmjs.com/package/gulp-bump>                   |
|         | gulp-concat         | 2.4.3+      | <https://www.npmjs.com/package/gulp-concat>                 |
|         | gulp-jscs           | 1.4.0+      | <https://www.npmjs.com/package/gulp-jscs>                   |
|         | gulp-jshint         | 1.9.1+      | <https://www.npmjs.com/package/gulp-jshint>                 |
|         | gulp-livereload     | 3.6.0+      | <https://www.npmjs.com/package/gulp-livereload>             |
|         | gulp-plumber        | 0.6.6+      | <https://www.npmjs.com/package/gulp-plumber>                |
|         | gulp-rename         | 1.2.0+      | <https://www.npmjs.com/package/gulp-rename>                 |
|         | gulp-replace-task   | 0.1.0+      | <https://www.npmjs.com/package/gulp-replace-task>           |
|         | gulp-sourcemaps     | 1.3.0+      | <https://www.npmjs.com/package/gulp-sourcemaps>             |
|         | gulp-uglify         | 1.1.0       | <https://www.npmjs.com/package/gulp-uglify>                 |
|         | gulp-util           | 3.0.2       | <https://www.npmjs.com/package/gulp-util>                   |
|         | merge-stream        | 0.1.7+      | <https://www.npmjs.com/package/merge-stream>                |
|         | rimraf              | 2.2.8+      | <https://www.npmjs.com/package/rimraf>                      |
|         | st                  | 0.5.2+      | <https://www.npmjs.com/package/st>                          |
|         | tiny-lr             | 0.1.5+      | <https://www.npmjs.com/package/tiny-lr>                     |
|    2    | babelify            | 5.0.3+      | <https://www.npmjs.com/package/babelify>                    |
|         | browserify          | 8.1.3+      | <https://www.npmjs.com/package/browserify>                  |
|         | vinyl-buffer        | 1.0.0+      | <https://www.npmjs.com/package/vinyl-buffer>                |
|         | vinyl-source-stream | 1.0.0+      | <https://www.npmjs.com/package/vinyl-source-stream>         |
|         | babel               | 4.0.1+      | <https://www.npmjs.com/package/babel>                       |
|         | yasmf-h             | 0.1.3+      | <https://www.npmjs.com/package/yasmf-h>                     |
|    3    | gulp-sass           | 1.3.3+      | <https://www.npmjs.com/package/gulp-sass>                   |
|         | node-reset-scss     | 1.0.1+      | <https://www.npmjs.com/package/node-reset-scss>             |
|    6    | Indexed DB Plugin   | 0.1.0+      | <http://plugreg.com/plugin/DickvdBrink/cordova-indexeddb>   |
|    7    | SQLite Plugin       | 1.0.5+      | <http://plugreg.com/plugin/brodysoft/Cordova-SQLitePlugin>  |
|    8    | File Transfer Plugin| 0.5.0+      | <http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer> |
|    9    | InAppPurchase Plugin| 3.10.0+     | <http://plugreg.com/plugin/j3k0/cordova-plugin-purchase>    |
|   11    | Adobe Illustrator   | CC 2014\*   | <http://www.adobe.com/products/illustrator.html>            |
|         | Adobe Photoshop     | CC 2014\*   | <http://www.adobe.com/products/photoshop.html>              |

> \* Adobe Illustrator is a vector editing program. You can use any vector editor with a similar feature set. Adobe Photoshop
> is a reaster graphics editor (with some vector editing bolted on). You can use any raster graphics editor with a similar
> feature set.

# Device Requirements

If you're planning on testing the code in this book on your device, you'll need a device that meets the following minimum requirements:

* Android Device: Android 4.4 or higher
* iPhone / iPad: iOS 7 or higher
