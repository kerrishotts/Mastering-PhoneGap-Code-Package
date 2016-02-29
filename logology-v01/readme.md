# Logology v1.0.0

This is the first project for the book, and we're focusing on the build system for the first three chapters. As such, the code for
the project is correspondingly simple. The main code is in the `gulp/` directory.

> NOTE: There are two Gulp configurations. In the book, we start out with putting everything in a single file and then transition
> to a modular format. The `gulpfile.all.in.one.js` shows an example of just why this is important -- it's large, unwieldy, and
> hard to follow. The modular format makes it easier to maintain the various tasks we need to use, and it's easier to grasp.

The configuration lives in `./config.js` -- this object specifies the various paths and objects that need to be transformed by the
build process. The `./settings.js` handles _most_ of the command-line arguments. All the code for each task lives under `tasks/`
in separate files. In the book we focused solely on the code, but you'll note that in the package, we've also included help texts.

To get started with this project, and each project that follows, you can follow these simple steps, assuming you have Node.js and
Gulp installed globally:

1. `npm install` -- installs all dependencies as defined in `package.json`
2. `gulp init` -- creates the `build/` directory and initial Cordova project. Adds platforms and plugins.
3. `gulp copy` -- runs the transformation step of the build process; output is in `builds/www`. Make sure you can successfully
                  execute this command before continuing.
4. `gulp emulate --platform ios|android` -- Builds the app and runs it in the simulator/emulator. 

It is possible you'll encounter errors during any of the above steps depending upon your system configuration. If you do, please
file an issue at <https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package/issues> so that we can fix any issues you may
encounter.


