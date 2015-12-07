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

In addition to the above, each chapter will introduce new requirements. These will be mentioned in each chapter, so you don't need them installed in advance (you can install them all using `npm install` in the project directory. Note that each chapter generally builds upon the requirements of the previous chapters.

## Device Requirements

If you're planning on testing the code in this book on your device, you'll need a device that meets the following minimum requirements:

* Android Device: Android 4.4 or higher
* iPhone / iPad: iOS 7 or higher
