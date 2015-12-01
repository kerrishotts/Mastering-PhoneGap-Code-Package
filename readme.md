# Mastering PhoneGap Code Bundle

This repository stores the code for the book entitled Mastering PhoneGap Mobile Application Development published by Packt
Publishing. You can purchase the book at [Packt's
Site](http://www.packtpub.com/mastering_phonegap-mobile-application-development-hotshot/book). If you obtained the code package from
Packt, you may wish to download the package from GitHub in order to receive the most recent changes. The package is available at
<https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package>

> **NOTE:** This book is under active development. As such, the contents of this repository are not yet finalized.

The demonstration app in this code package makes heavy use of Gulp -- a JavaScript task runner. In the book, we put everything in
one large `gulpfile.js`, which serves as the project's Gulp cmonfiguration script. In real life this is hard to maintain and grok,
and so we've made our Gulp configuration modular. The version of the Gulp configuration used in the book is present in each
directory as `gulpfile.all.in.one.js`. The modular tasks live under the `gulp/` directory.

The code herein is not a complete Cordova project. The build artifacts such as `build/`, `platforms/`, etc. are ignored. Only the
`src` directory, `config.xml`, and other assets for each project are provided. In order to execute any of these projects, you'll need to
ensure you have the appropriate prerequisites installed (see [PREREQUISITES](./prerequisites.md)) and then execute the following to
create the build artifacts, after which you can build as normal:

```
$ gulp init && gulp copy   // bash
$ gulp init; and gulp copy // fish
> gulp init                % 
> gulp copy                % WINDOWS
```

# Table of Contents

* [Snippets](#snippets)
* [Demo Application](#demo-application)
* [Chapter/Project Lookup](#chapterproject-lookup)
* [Application Demos](#application-demos)
* [Useful Directories](#useful-directories)
* [Useful Scripts](#useful-scripts)
* [Using PhoneGap Build](#using-phonegap-build)
* [Additional Project Information](#additional-project-information)
* [License](#license)

## [Snippets](id:snippets)

Most of the chapters in the book contain several code snippets. Most of these snippets can be run within a desktop environment so
that you can play around with the snippets and get a feel for what happens when you change certain things. There are, however, some
chapters that do **NOT** support snippets because the code isn't functional within a browser-based context.

The following chapters have snippets available in a browser context:

* Chapter 1, Task Automation

* Chapter 2, ES2015 and Browserify

* Chapter 3, Sassy CSS

* Chapter 4, More Responsive Design

* Chapter 5, Accessibility

* Chapter 7, IndexedDB

* Chapter 8, SQLite

* Chapter 9, File Transfer

> NOTE: Chapters 9 through 11 do not have snippets available in a browser context.

Assuming you already have Google Chrome installed, running the snippets requires the following steps:

```
$ cd snippets
$ npm install
$ npm start
```

At this point, an instance of Google Chrome should load. If it doesn't, you can start a fresh instance with the following
command line arguments:

```
$ /path/to/chrome/chrome --no-first-run --no-default-browser-check --disable-translate --disable-default-apps
--disable-web-security --user-data-dir=tmp http://localhost:5000/
```

> **NOTE**: It is vital that you use the created instance of Chrome only for playing with snippets. The settings configure Chrome to
> be less secure so that the snippets can work from your local machine, but by doing so, any other pages you visit in the same
> Chrome instance would not receive the normal web security mechanisms.

Once Chrome is available, you should see a JSBin-like page load. Give it a few seconds to finish loading (it's pulling in several
megabytes of supporting code!), and once everything is ready, there should be two drop-downs in the navigation bar, along with
several editors visible.

Selecting your desired snippet is easy:

* Select the chapter from the first dropdown

* Select the desired snippet from the second dropdown

* Wait a couple of seconds while the resources load and transpile. Results are visible on the right-hand pane and in the JavaScript
  Console.

> **NOTE**: Some snippets only generate content in the JavaScript Console.

Each snippet comes with its own preferred layout, but you can enable or disable any of the editors as you like by clicking the
`Toggle` items in the upper right corner of the page. 

One last note: the snippets have occasionally been modified slightly to work better within the snippet environment. Due to the way
the environment works, `console.log` behaves somewhat differently, for example, and so the snippets have been updated to reflect
that. Sometimes multiple snippets are in one file, and so arrangements are made for each smaller example to co-exist within the same
context.

See the [LICENSE](./snippets/LICENSE) file for information on the various libraries used to build the snippets tool.

## [Demo Application](id:demoapplication)

The demonstration application demonstrates many of the same techniques used in the book. The app itself is intended to be a simple
dictionary app: the user can search for words and see associated definitions.

There are _twelve_ versions of this project -- with each version change matching what was discussed in the corresponding chapter.
The final version of the project is in the `logology-v12/` directory.

Although the app is technically complete, there's a lot of ways you could improve it. Here's some ideas to get you started:

* Definitions are typically listed in _sense order_. That is, the first definition for "cat" typically relates to a feline mammal.
In this version, however, definitions are listed in internal order, which does not typically match the expected order. Consider
adding code and indexes so that the app can list definitions in the appropriate order.

* Search results are limited to a specific number of records (determined in the app's settings). Consider enabling infinite
scrolling so that the number of returned results doesn't matter. As an added feature, allow the user to scroll through _all_ the
words in the dictionary.

* Within the DOM structure, the favorite, share, and edit action items are repeated for each word. This isn't necessary -- a new
action item could instead be created when a swipe is initiated. As such, the DOM structure could be drastically simplified. Consider
adding code to simplify the DOM structure while _not_ impacting performance (since changing the DOM will result in a reflow).

* The WordNet database used for this project contains a _lot_ of information about the words and associated definitions. Consider
adding this information into the app.

* Create dictionaries for other languages and allow the app to install them.

## [Chapter/Project Lookup](id:chapterproject-lookup)

|    Chapter | Title                              | Project             | App.io Demo
|-----------:|:---------------------------------- |:--------------------|:------------
|          1 | Task Automation                    | [LogologyV1](#v1)   | N/A
|          2 | ES2015 and Browserify              | [LogologyV2](#v2)   | N/A
|          3 | Sassy CSS                          | [LogologyV3](#v3)   | N/A
|          4 | More Responsive Design             | [LogologyV4](#v4)   | N/A
|          5 | Accessibility                      | [LogologyV5](#v5)   | N/A
|          6 | Testing and UI Automation          | [LogologyV6](#v6)   | N/A
|          7 | IndexedDB                          | [LogologyV7](#v7)   | N/A
|          8 | SQLite                             | [LogologyV8](#v8)   | N/A
|          9 | File Transfer                      | [LogologyV9](#v9)   | N/A
|         10 | Performance                        | [LogologyV10](#v10) | N/A
|         11 | Graphical Assets                   | [LogologyV11](#v11) | N/A
|         12 | Deployment                         | [LogologyV12](#v12) | [Demo](#) (offsite)

## [Application Demos](id:application-demos)

I've taken the time to upload the final version of Logology to both the Apple App Store and the Google Play Market. Links are as
follows:

* [Apple App Store](#)
* [Google Play Market](#)

## [Useful Directories](id:useful-directories)

Other than the actual code for each project, the following directories may be of interest to you:

* `design/`
  * Contains icons and splash screen for each project. Also contains design documents for each project in PDF and
    OmniGraffle format.
* `blank/`
  * Contains the template we used to create each project (`cordova create ... --copy-from ./template`).

## [Using PhoneGap Build](id:using-phonegap-build)

The projects as delivered are *Cordova* projects. In order to utilize them with PhoneGap build, you will need to follow these steps:

* Copy `config.xml` from the application root to the `www` directory.
* Add the required plugins to `config.xml`, using the form:

```
<gap:plugin name="reverse.domain.id"/>
```
* If you want to add the icon and splash screen assets to the project, you'll need to copy the appropriate icons from the `design` directory into the project's `www` directory, and then update `config.xml` using [these directions](http://docs.build.phonegap.com/en_US/configuring_icons_and_splash.md.html#Icons%20and%20Splash%20Screens).
* Upload the project to PhoneGap Build by using `phonegap remote build android` (or `ios`).

## [Additional Project Information](id:additional-project-information)

### [Logology V1](id:v1)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V2](id:v2)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V3](id:v3)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V4](id:v4)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V5](id:v5)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V6](id:v6)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V7](id:v7)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V8](id:v8)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V9](id:v9)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V10](id:v10)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V11](id:v11)

#### Global Packages Required

#### Development Packages Required

#### Packages Required

#### Plugins Required

### [Logology V12](id:v12)

#### Global Packages Required

* Java JDK

    * version 7 is available from <http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html>
    * version 8 is available from <http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html>

* node 5.0.0 (or better)

    * Available from <https://nodejs.org/>
    * You should use a version manager, like `nvm`.

* npm 3.3.6 (or better)

    * Comes with Node.js

* gulp 3.9.0 (or better)

      npm install -g gulp

* cordova 5.4.0 (or better) or phonegap 5.3.7 (or better

      npm install -g cordova
      npm install -g phonegap

* ant 1.9.4 (or better)

    * If not already installed, available from <https://ant.apache.org/bindownload.cgi>

* Android SDK (building Android apps)

    * Available from <http://developer.android.com/sdk/index.html>

* Xcode 7.1 or better (building iOS apps)

    * Available from the Mac App Store

* appium 1.4.11 (or better)

      npm install -g appium 

    * Explorer available from <http://appium.io>

* ios-webkit-debug-proxy 

    * Installation instructions <https://github.com/google/ios-webkit-debug-proxy#installation>

#### Development Packages Required

> NOTE: These can be installed via `npm install`

* babel-eslint 4.1.5, MIT

      npm install --save-dev babel-eslint

* babelify 6.4.0, MIT

      npm install --save-dev babelify

* browser-sync 2.10.0 (or better), Apache 2.0

      npm install --save-dev browser-sync

* browserify 11.2.0 (or better), MIT

      npm install --save-dev browserify

* chai 3.4.1 (or better), MIT

      npm install --save-dev chai

* chai-as-promised 5.1.0 (or better), WTFPL

      npm install --save-dev chai-as-promised

* colors 1.1.2 (or better), MIT

      npm install --save-dev colors

* cordova-android 4.1.1 (or better), Apache 2.0

      npm install --save-dev cordova-android

* cordova-ios 3.9.2 (or better), Apache 2.0

      npm install --save-dev cordova-ios

* cordova-lib 5.4.0 (or better)

      npm install --save-dev cordova-lib

* cordova-tasks 0.2.0 (or better), MIT

      npm install --save-dev cordova-tasks

* desassify 0.1.8 (or better), BSD (2 clause)

      npm install --save-dev desassify

* eslint 1.10.1 (or better), MIT

      npm install --save-dev eslint

* gulp 3.9.0 (or better), MIT

      npm install --save-dev gulp

* gulp-autoprefixer 2.3.1 (or better), MIT

      npm install --save-dev gulp-autoprefixer

* gulp-bump 0.3.1 (or better), MIT

      npm install --save-dev gulp-bump

* gulp-changed-in-place 2.0.3 (or better), MIT

      npm install --save-dev gulp-changed-in-place

* gulp-concat 2.6.0 (or better), MIT

      npm install --save-dev gulp-concat

* gulp-eslint 1.1.0 (or better), MIT

      npm install --save-dev gulp-eslint

* gulp-jscs 2.0.0 (or better), MIT

      npm install --save-dev gulp-jscs

* gulp-license-finder 0.3.2 (or better), MIT

      npm install --save-dev gulp-license-finder

* gulp-mocha 2.2.0 (or better), MIT

      npm install --save-dev gulp-mocha

* gulp-notify 2.2.0 (or better), MIT

      npm install --save-dev gulp-notify

* gulp-plumber 1.0.1 (or better), MIT

      npm install --save-dev gulp-plumber

* gulp-rename 1.2.2 (or better), MIT

      npm install --save-dev gulp-rename

* gulp-replace-task 0.10.1 (or better), MIT

      npm install --save-dev gulp-replace-task

* gulp-sass 2.1.0 (or better), MIT

      npm install --save-dev gulp-sass

* gulp-sourcemaps 1.6.0 (or better), ISC

      npm install --save-dev gulp-sourcemaps

* gulp-uglify 1.5.1 (or better), MIT

      npm install --save-dev gulp-uglify

* gulp-util 3.0.7 (or better), MIT

      npm install --save-dev gulp-util

* licensify 2.0.1 (or better), MIT

      npm install --save-dev licensify

* merge-stream 1.0.0 (or better), MIT

      npm install --save-dev merge-stream

* q 1.4.1 (or better), MIT

      npm install --save-dev q

* require-all 1.1.0 (or better), MIT

      npm install --save-dev require-all

* rimraf 2.4.4 (or better), ISC

      npm install --save-dev rimraf

* sprintf-js 1.0.3 (or better), BSD (3 clause)

      npm install --save-dev sprintf-js

* vinyl-buffer 1.0.0 (or better), MIT

      npm install --save-dev vinyl-buffer

* vinyl-buffer-stream 1.1.0 (or better), MIT

      npm install --save-dev vinyl-buffer-stream

* wd 0.3.12 (or better), Apache 2.0

      npm install --save-dev wd

#### Packages Required

> NOTE: These can be installed via `npm install --production`

* babel 5.8.34 (not compatible with 6.x)

      npm install babel

* globalize 1.1.0-rc.6 (or better), MIT

      npm install globalize

* hammerjs 2.0.4 (or better), MIT

      npm install hammerjs

* keypather 1.10.1 (or better), MIT

      npm install keypather

* matches-selector 1.0.0 (or better), MIT

      npm install matches-selector

* node-reset-scss 1.0.1 (or better), public domain

      npm install node-reset-scss

* once 1.3.3 (or better), ISC

      npm install once

* open-iconic

      npm install https://github.com/iconic/open-iconic

* prefix-property 1.0.23 (or better), MIT

      npm install prefix-property

* svg-injector 1.1.3 (or better), MIT

      npm install svg-injector

* whatwg-fetch 0.10.1 (or better), MIT

      npm install whatwg-fetch

* yasmf-emitter 0.1.5 (or better), MIT

      npm install yasmf-emitter

* yasmf-h 0.1.4 (or better), MIT

      npm install yasmf-h

* yasmf-localization 0.0.2 (or better), MIT

      npm install yasmf-localization

* cldr-data 28.0.3 (or better), MIT

      npm install cldr-data

#### Plugins Required

> NOTE: These will be automatically installed if using the build system accompanying the code package for this book.

* Device 1.0.1 (or better)

      cordova plugin add cordova-plugin-device

* Network Information 1.0.1 (or better)

      cordova plugin add cordova-plugin-network-information

* Globalization 1.0.1 (or better)

      cordova plugin add cordova-plugin-globalization

* Whitelist 1.1.0 (or better)

      cordova plugin add cordova-plugin-whitelist

* Mobile Accessibility

      cordova plugin add https://github.com/phonegap/phonegap-mobile-accessibility

* Keyboard 1.0.7 (or better)

      cordova plugin add ionic-plugin-keyboard

* SQLite 0.8.0 (or better)

      cordova plugin add cordova-sqlite-ext

* Splashscreen 2.1.0 (or better)

      cordova plugin add cordova-plugin-splashscreen

* Status bar 1.0.1 (or better)

      cordova plugin add cordova-plugin-statusbar

* Inappbrowser 1.0.1 (or better)

      cordova plugin add cordova-plugin-inappbrowser

* Email / Sharing plugin...

## [License](id:license)

The code herein is licensed under the MIT license. You are free to do with it as you will, provided the
requirements of said license are met.

```
Copyright (c) 2015 Packt Publishing
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```

### WordNet License

Portions of this repository use definitions from WordNet. See [./LICENSE-WordNet.md](WordNet License).

