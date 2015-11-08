# Mastering PhoneGap Code Bundle

This repository stores the code for the book entitled Mastering PhoneGap Mobile Application Development published by Packt
Publishing. You can purchase the book at [Packt's
Site](http://www.packtpub.com/mastering_phonegap-mobile-application-development-hotshot/book). If you obtained the code package from
Packt, you may wish to download the package from GitHub in order to receive the most recent changes. The package is available at
<https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package>

> **NOTE:** This book is under active development. As such, the contents of this repository are not yet finalized.

The code herein is not a complete Cordova project. The build artifacts such as `build/`, `platforms/`, etc. are ignored. Only the
`src` directory,`config.xml`, and assets for each project are provided. In order to execute any of these projects, you'll need to
ensure you have the appropriate prerequisites installed (see [PREREQUISITES](./prerequisites.md)) and then execute the following to
create the build artifacts:

```
$ gulp init && gulp copy   // bash
$ gulp init; and gulp copy // fish
> gulp init                % 
> gulp copy                % WINDOWS
```

# Table of Contents

* [Snippets](#snippets)
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

Chapters 6 and 9 through 11 do not have snippets available in a browser context.

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

#### Plugins Required
```
```

### [Logology V2](id:v2)

#### Plugins Required
```
```

### [Logology V3](id:v3)

#### Plugins Required
```
```

### [Logology V4](id:v4)

#### Plugins Required
```
```

### [Logology V5](id:v5)

#### Plugins Required
```
```

### [Logology V6](id:v6)

#### Plugins Required
```
```

### [Logology V7](id:v7)

#### Plugins Required
```
```

### [Logology V8](id:v8)

#### Plugins Required
```
```

### [Logology V9](id:v9)

#### Plugins Required
```
```

### [Logology V10](id:v10)

#### Plugins Required
```
```

### [Logology V11](id:v11)

#### Plugins Required
```
```

### [Logology V12](id:v12)

#### Plugins Required
```
```

## [License](id:license)

The code herein is licensed under the MIT license. You are free to with it as you will, provided the
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

