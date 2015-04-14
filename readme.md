# Mastering PhoneGap Code Bundle

This repository stores the code for the book entitled Mastering PhoneGap Mobile Application Development published by
Packt Publishing. You can purchase the book at
[Packt's Site](http://www.packtpub.com/mastering_phonegap-mobile-application-development-hotshot/book). If you obtained
the code package from Packt, you may wish to download the package from GitHub in order to receive the most recent changes.
The package is available at <https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package>

> **NOTE:** This book is under active development. As such, the contents of this repository are not yet finalized.

The code herein is not a complete Cordova project. The build artifacts (namely the `platforms`, `plugins`, etc., directories)
are ignored. Only the `src` directory,`config.xml`, and assets for each project are provided. In order to execute any of these
projects, you'll need to create a new Cordova project and copy the relevant files from this repository into your project.

> You should also check out [notes.md](./notes.md) within this repository -- there are important issues and discussions of
which you should be aware.

# Table of Contents

* [Chapter/Project Lookup](#chapterproject-lookup)
* [Application Demos](#application-demos)
* [Useful Directories](#useful-directories)
* [Useful Scripts](#useful-scripts)
* [Using PhoneGap Build](#using-phonegap-build)
* [Additional Project Information](#additional-project-information)
* [License](#license)

## [Chapter/Project Lookup](id:chapterproject-lookup)

|    Chapter | Title                              | Project             | App.io Demo
|-----------:|:---------------------------------- |:--------------------|:------------
|          1 | Task Automation                    | [LogologyV1](#v1)   | N/A
|          2 | Modules                            | [LogologyV2](#v2)   | N/A
|          3 | Sassy CSS                          | [LogologyV3](#v3)   | N/A
|          4 | More Responsive Design             | [LogologyV4](#v4)   | N/A
|          5 | Accessibility                      | [LogologyV5](#v5)   | N/A
|          6 | IndexedDB                          | [LogologyV6](#v6)   | N/A
|          7 | SQLite                             | [LogologyV7](#v7)   | N/A
|          8 | File Transfer                      | [LogologyV8](#v8)   | N/A
|          9 | In-App Purchases                   | [LogologyV9](#v9)   | N/A
|         10 | Developing Custom Plugins          | [LogologyV10](#v10) | N/A
|         11 | Graphical Assets                   | [LogologyV11](#v11) | N/A
|         12 | Deployment                         | [LogologyV12](#v12) | [Demo](https://app.io/kAxEF4) (offsite)

## [Application Demos](id:application-demos)

I've taken the time to upload the final versions of Logology to [App.io](http://www.app.io).
**Note:** It is not possible to simulate all aspects of each app; pay attention to what features are not available.

* [Logology V12](https://app.io/kAxEF4) (offsite)
  * The simulator does not provide for in-app purchases or accessibility settings.

## [Useful Directories](id:useful-directories)

Other than the actual code for each project, the following directories may be of interest to you:

* `/design`
  * Contains icons and splash screen for each project. Also contains design documents for each project in PDF and
    OmniGraffle format.
* `/template`
  * Contains the template we used to create each project (`cordova create ... --copy-from ./template`).
* `/framework`
  * Contains the version of the YASMF-Next framework that was used to build the projects. You are welcome to update the
    framework version at any time, but it is always possible that new framework versions might break the apps.

## [Useful Scripts](id:useful-scripts)

Contained within the top level of this project are several useful scripts. **NOTE:** Your use of these scripts is at
your own risk. Neither the author of the book and code nor Packt Publishing can be held liable for the use, abuse,
or misuse of these scripts.

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

