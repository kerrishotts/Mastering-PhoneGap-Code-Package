This directory is used to store device testing profiles. The form is as follows:

```js
exports.profile = {
    parameter: value, ...
}
```

You need to specify the following parameters

* `platformName`: `iOS` or `Android`
* `platformVersion`: Operation system version to use
* `deviceName`: Name of device, as follows:
    * Physical iOS Device: `iPhone`, etc.
    * iOS Simulator: `iPhone Simulator`
    * Android: `device`
* `app`: Absolute path to the IPA (iOS) or APK (Android) bundle.

For Android, if the device's pixel ratio is not `1`, be sure to also include `pixelRatio` in the configuration with the appropriate setting.

## iOS Example

```js
exports.profile = {
    platformName: "iOS",
    platformVersion: "8.4",
    deviceName: "iPhone",
    app: __dirname + "/../../../build/platforms/ios/build/device/Logology.ipa"
}
```

## iOS Simulator Example

```js
exports.profile = {
    platformName: "iOS",
    platformVersion: "9.2",
    deviceName: "iPhone Simulator",
    app: __dirname + "/../../../build/platforms/ios/build/emulator/Logology.app"
}
```

## Android Example

```js
exports.profile = {
    platformName: "Android",
    platformVersion: "5.1.0",
    deviceName: "device",
    pixelRatio: 3.5,
    app: __dirname + "/../../../build/platforms/android/build/outputs/apk/android-debug.apk"
}
```

# Using with Gulp

You can select a profile using the 
