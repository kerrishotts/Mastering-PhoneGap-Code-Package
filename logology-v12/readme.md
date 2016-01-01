# Logology v12.0.0

This is the final version of the Logology project, and it corresponds with Chapter 12, Deployment. 

## Important changes

* `build.json` has been added to support key signing. You'll need a `.release.keystore` file, as described in the chapter in order
  to build a release version of the app.

* Gulp tasks have been updated to support `build.json`.

## Apple App Store Distribution Notes

The version of the application in the Apple App Store has been modified in the following manner in order to support the iPad Pro and
to properly fit on smaller devices:

 - General

     - Remove the `Icon File` property from the `Logology-Info.plist` file.

 - iOS 9 Multitasking Support

     - Requires the creation of a Launch Screen storyboard

         - File > New > iOS > User Interface > Launch Screen

         - The two labels created automatically were removed

         - An IMAGE VIEW was added to the view.

         - The image in `/designs/iOS Launch Screen Variation 2-3072.png` was added to the Xcode project's `Resources/` directory.

         - the new IMAGE VIEW's properties were set to the following:

             - Image: iOS Launch Screen variation 2-3072.png

             - Mode: Aspect Fill

         - Added the following constraints to the IMAGE VIEW:

             - Margins (TRBL): 0 (View), -20 (View), 0 (Bottom Layout Guide), -20 (View)

             - Alignment: Horizontally and Vertically in container

    - Settings changed in the Logology Target:

        - Deployment Info, iPad

            - Ensure `Requires Full Screen` is **UNCHECKED**

            - Ensure all orientations are **CHECKED**

        - App Icons and Launch Images

            - Launch Screen File: Launch Screen

 - Small Screen Support

     - On older devices with smaller screens, when the soft keyboard is visible, landscape mode is very nearly unusable simply due
     to the limited real-estate. In order to avoid this problem, we explicitly disabled rotation for phones.

     - Settings changed in the Logology Target:

         - Deployment Info, iPhone

             - Ensure only `Portrait` orientation is **CHECKED**; all others should be **UNCHECKED**.
 
 - iPad Pro Support

     - In order to support the iPad Pro, a launch screen storyboard is required. We've already added this for multi-tasking support.

     - A new icon had to be added to the AppIcon section in the `Resources/Images.xcassets` catalog. The icon is `167 x 167`, though
     it is referred to as `83.5pt`. We had to resize our iTunes artwork icon to this new resolution and then drag and drop the image
     in the appropriate location.

 - iPhone 6(s)+ Support

     - For some reason, the small icon for @3x didn't copy over. We copied it manually to the AppIcon section in the 
     `Resources/Images.xcassets` catalog.


