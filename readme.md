# Mastering PhoneGap Mobile Application Development Code Bundle

This repository stores the code for the book entitled Mastering PhoneGap Mobile Application Development published by Packt Publishing. You can purchase the book at [Packt's Site](https://www.packtpub.com/application-development/mastering-phonegap-mobile-application-development). If you obtained the code package from Packt, you should download the package from GitHub in order to receive the most recent changes. The package is available at <https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package>.

## Table of Contents

* [Reporting Bugs / Issues / Errata](#bugs)
* [Snippets](#snippets)
* [Demo Application](#demo-application)
* [Chapter/Project Lookup](#chapterproject-lookup)
* [Useful Directories](#useful-directories)
* [Using PhoneGap Build](#using-phonegap-build)
* [License](#license)

## [Reporting Bugs / Issues / Errata](id:bugs)

If you find a bug or issue in the code package, please [file an issue](https://github.com/kerrishotts/Mastering-PhoneGap-Code-Package/issues). If you find an errata, you may report it as an issue, or report it at [Packt's site](https://www.packtpub.com/books/content/errata).

## [Snippets](id:snippets)

This code package includes an interactive playground you can use to play around with several of the code snippets included in the book. The interactive playground includes snippets from *most* but not *all* of the chapters.

To learn more about the interactive playground, see [the interactive playground readme](./snippets/readme.md).


## [Demo Application](id:demoapplication)

The demonstration application demonstrates many of the same techniques used in the book. The app itself is intended to be a simple dictionary app: the user can search for words and see associated definitions.

![Logology, our demo app (iPad / Landscape)](./design/screenshots/iOS/2048x1536/SearchViewController.png)

For an more in-depth discussion of the demonstration app, see [Logology's readme](./logology-readme.md).

There are several versions of this project -- with each version change matching what was discussed in the corresponding chapter, except for chapters nine and ten. The final version of the project is in the `logology-v12/` directory. Development actually continues in the `logology` directory -- so if you wish to contribute to or watch further development, this is where it future changes will be made.

Although the app is technically complete, there's a lot of ways you could improve it. Here's some ideas to get you started:

* Search results are limited to a specific number of records (determined in the app's settings). Consider enabling infinite scrolling so that the number of returned results doesn't matter. As an added feature, allow the user to scroll through _all_ the words in the dictionary.

* The WordNet database used for this project contains a _lot_ of information about the words and associated definitions. Consider adding this information into the app.

* Create dictionaries for other languages and allow the app to install them.

**NOTE**: The code herein is not a complete Cordova project. The build artifacts such as `build/`, `platforms/`, etc. are ignored. Only the `package.json` file and `src/`, `config/`, `gulp/`, `test/`, and `test-ui/` directories and other assets for each project are provided. In order to execute any of these projects, you'll need to ensure you have the appropriate prerequisites installed (see [requirements](./requirements.md)) and then execute the following to create the build artifacts, after which you can `gulp build` as normal:

```sh
$ gulp init && gulp copy   # bash
$ gulp init; and gulp copy # fish
> gulp init                % 
> gulp copy                % WINDOWS
```


## [Chapter/Project Lookup](id:chapterproject-lookup)

|    Chapter | Title                              | Project Readme                            |
|-----------:|:---------------------------------- |:------------------------------------------|
|          - | Logology In-Depth                  | [Logology](./logology-readme.md) |
|          1 | Task Automation                    | [Logology, v1](./logology-v01/readme.md)  |
|          2 | ES2015 and Browserify              | [Logology, v2](./logology-v02/readme.md)  |
|          3 | Sassy CSS                          | [Logology, v3](./logology-v03/readme.md)  |
|          4 | More Responsive Design             | [Logology, v4](./logology-v04/readme.md)  |
|          5 | Accessibility                      | [Logology, v5](./logology-v05/readme.md)  |
|          6 | Testing and UI Automation          | [Logology, v6](./logology-v06/readme.md)  |
|          7 | IndexedDB                          | [Logology, v7](./logology-v07/readme.md)  |
|          8 | SQLite                             | [Logology, v8](./logology-v08/readme.md)  |
|          9 | File Transfer                      | N/A                                       |
|         10 | Performance                        | N/A                                       |
|         11 | Graphical Assets                   | [Logology, v11](./logology-v11/readme.md) |
|         12 | Deployment                         | [Logology, v12](./logology-v12/readme.md) |
|          - | Logology Current Development       | [Logology, v13](./logology/readme.md) |

### [Application Demos](id:application-demos)

I've taken the time to upload the final version of Logology to both the Apple App Store and the Google Play Market. Links are as follows:

* [Apple App Store](https://geo.itunes.apple.com/us/app/logology/id1068733478?mt=8)
* [Google Play Market](https://play.google.com/store/apps/details?id=com.packtpub.logology)

The app itself is available for free without advertisements.

## [Useful Directories](id:useful-directories)

Other than the actual code for each project, the following directories may be of interest to you:

* `design/`
  * Contains icons and splash screen for each project. Also contains design documents for each project in PDF and OmniGraffle format.
* `blank/`
  * Contains the template we used to create each project (`cordova create ... --copy-from ./template`).
* `logology/`
  * Current development continues on Logology; this is where that development lives.

## [Using PhoneGap Build](id:using-phonegap-build)

The projects as delivered are *Cordova* projects. They are not designed to be utilized with PhoneGap Build, an in-the-cloud compilation service. You can, no doubt, make the appropriate changes to the project files if you wish, however. You would need to address the following:

* `config.xml` is generated dynamically as part of the initial build steps. Once you have a `build` directory generated, however, you could use that `config.xml` along with the `build/www` directory to upload to PhoneGap Build.

## [License](id:license)

The code herein is licensed under the MIT license. You are free to do with it as you will, provided the requirements of said license are met.

```
Copyright (c) 2016 Packt Publishing
Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
Portions Copyright various third parties where noted.

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

Portions of this repository use definitions from WordNet. See [WordNet License](./wordnet/LICENSE-WordNet.md).

