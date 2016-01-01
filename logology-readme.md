# Logology Application Structure

You can find the demonstration app, Logology, in various stages of completion in the directories `logology-v04` through
`logology-v12`. The final version is in `logology-v12`. This document describes
the final version (12), with notes for the other versions as applicable.

## Design

The visual design is fairly standard for an app that displays lists of data. You
can see [the visual design PDF](design/visual design and flow.pdf), which
describes the appearance and functionality at a very high level. Alternatively,
you can refer to the screen captures below, which show the app as it actually
renders.

As of this writing, Logology has the following features:

 - Search for words in a dictionary
 - View definitions for a word
 - Add a word to favorites (or remove)
 - Create / Edit notes for a word (or remove)
 - Change Settings (Including Accessibility, Readability, About)

Internally, the application itself demonstrates several uses that hybrid
applications can use:

 - Accessibility
 - Responsive design
 - Complex layout using Flex-Box
 - Gesture support and fast click via Hammer.js
 - Persistent storage using localStorage, IndexedDB, and SQLite
 - Management of the Status Bar using the Cordova Status Bar plugin
 - Management of the Launch Image using the Cordova Splash Screen plugin
 - Soft-keyboard avoidance using the Ionic Keyboard plugin
 - Adjustment of settings and visual appearance based on device platform using
 the Cordova Device plugin

 Visually the application consists of five screens:


## Structure



### Directory Structure

```text
build/                     # Build directory; considered a build artifact
config/                    # Configuration for eslint, code checking
gulp/                      # Gulp configuration and tasks
  tasks/                     # Gulp tasks
    build.js                   # Builds the project by copying and transforming code and executing cordova build
    clean.js                   # Deletes build/
    code-style.js              # Verifies coding style
    copy-assets.js             # Copies assets that don't require any transformations
    copy-code.js               # Transforms and copies ES2015 code
    copy-config.js             # Transforms and copies src/config.xml
    copy-reload.js             # Copies files and reloads BrowserSync-attached browsers
    copy-scss.js               # Transforms and copies SCSS code
    copy.js                    # Executes all copy tasks (save copy-reload)
    cordova-build.js           # Executes cordova build command (as on CLI)
    cordova-emulate.js         # Executes cordova emulate command (as on CLI)
    cordova-prepare.js         # Executes cordova prepare command (as on CLI); useful after `gulp copy` when testing in an IDE
    cordova-run.js             # Executes cordova run command (as on CLI)
    default.js                 # Default task; right now starts up a BrowserSync server and watches for changes.
    emulate.js                 # Emulates the project
    find-licenses.js           # Finds the licenses used in the project (node modules)
    help.js                    # Stub
    init.js                    # Initializes the Cordova project in build/
    lint.js                    # Checks code against eslint
    run.js                     # Runs project on device
    serve.js                   # Creates a Browsersync instance (without change watching)
    show-config.js             # Displays configuration settings from gulp/config.js
    show-settings.js           # Displays command line settings
    test-phantom.js            # Runs code tests in test/ using PhantomJS and Browserify-test
    test-ui.js                 # Runs automation tests using Appium
    test.js                    # Runs code tests using Node.
    version-bump-major.js      # Bump the package.json version by a major release
    version-bump-minor.js      # Bump the package.json version by a minor release
    version-bump-patch.js      # Bump the package.json version by a patch release
    watch.js                   # Watch for code changes and reload when detected
  utils/                     # Utilities
    bump.js                    # Bumps package.json verison
    cordova-tasks              # Stub for cordova-tasks npm module
    paths.js                   # Pathname utilities
  config.js                  # Path configuration
  help.js                    # Help task
  settings.js                # Command-line settings
  tasks.js                   # Tasks stub (plugs in Help as well)
src/                       # App source
  res/                       # Resources (icons, splash)
    icon/                      # App Icons
      android/                   # for Android
      ios/                       # for iOS
    splash/                    # Launch screens
      android/                   # for Android
      ios/                       # for iOS
  www/                       # App source code
    img/                       # Images in various dpi formats
    js/                        # JavaScript code
      app/                       # Application-specific code
        controllers/               # View Controllers
          AboutViewController.js     # Renders the About View chrome and manages the About View itself
          DefinitionViewController   # Renders the Definition View chrome and manages the Definition View
           .js
          GenericViewController.js   # A generic view controller with a default navigation bar and basic events
          MenuViewController.js      # Not used anymore
          NotesViewController.js     # Renders the Notes editor View chrome and manages the editor itself
          SearchViewController.js    # Renders the Search View chrome, accepts input from the user, and manages the search results
          SettingsViewController.js  # Renders the Settings View chrome and manages the Settings View itself
        lib/                       # Utility modules
          indexedDBKVStore.js        # key-value store using IndexedDB  (through chapter 7)
          KVStore.js                 # key-value store that can accept different storage mechanisms
          LocalStorageKVStore.js     # key-value store using LocalStore (early chapters)
          WebSQLKVStore.js           # key-value store using Web SQL (chapter 8 and beyond)
        localization/              # Translations
          root/                      # Root messages
            messages.json              # Default translations (English)
          localization.js            # Localization stub
        models/                    # Data Models
          Definition.js              # Represents a single definition
          Definitions.js             # Represents a collection of definitions.
          Dictionaries.js            # Represents a collection of dictionaries.
          Dictionary.js              # Represents a dictionary based on an Array
          Favorites.js               # Represents favorite words (uses the key-value stores in app/lib/)
          Note.js                    # Represents a single note (uses the key-value stores in app/lib/)
          Notes.js                   # Represents notes for words (uses the key-value stores in app/lib/)
          Settings.js                # Represents the app's settings (uses localStorage for persistence)
          SQLDictionary.js           # Represents a dictionary using a Web SQL database as the source
          StarterDictionary.js       # A simple dictionary of only a few words; based on the basic Dictionary.js
          XHRDictionary.js           # Represents a dictionary using an Array; retrieves the data using XHR
        views/                     # Views and templates
          AboutView.js               # Renders information about the app and the open source libraries used
          DefinitionView.js          # Renders the definition for a single word. Also includes external links to other resources
          dictionariesList.js        # A template for generating the list of installed dictionaries (not used currently)
          lemmaActions.js            # A template that generates the available actions for a word (can be passed fav/note status)
          lemmaList.js               # A template that generates a list of words
          MenuView.js                # Renders a menu suitable for a sidebar. (Not currently used)
          NotesView.js               # Renders an editor for viewing / editing a note
          SearchView.js              # Renders the primary view -- the search view
          SettingsView.js            # Renders the available settings and their current values
        index.js                   # App Bootstrap; contains initialization and routing code
      lib/                       # General-use library code
        templates/                 # Basic widget templates
          widgets/                   # Widget templates
            bars/                      # Bar-specific templates
              navigation.js              # Generates a navigation bar
            container.js               # Creates a container
            genericWidget.js           # Creates a generic widget (used by the other widgets in this folder)
            glyph.js                   # Creates a glyph (with an SVG icon)
            list.js                    # Creates a list container
            listHeading.js             # Generates a list heading
            listIndicator.js           # Returns a glyph suitable for a list indicator (a-la iOS)
            listItemActions.js         # Returns a list actions segment (for swiping)
            listItemContents.js        # Returns a container for the actual contents of a list item
            listItemSpacer.js          # Creates a space between list items
            scrollContainer.js         # Generates a container that can scroll
            svg-icon.js                # Returns an SVG Icon. Maps some commonly used names to their open-iconic variants
            textContainer.js           # Creates a text container (NOT an editor)
          el.js                      # Returns a DOM element
        Controller.js              # Generic controller
        grandCentralStation.js     # An emitter that is shared across the entire app; allows global communication
        NavigationViewController   # Generic Navigation View Controller. Handles push/pop/popToRoot
         .js
        SoftKeyboard.js            # Handles the appearance of the soft keyboard, and resizes the view as appropriate for iOS.
        SplitViewController.js     # Generic Split View controller. Not used in the app.
        Theme.js                   # Generic theme. Specifies the classes that should be used by theme styles.
        ThemeManager.js            # Manages the app's look and feel. The app itself has three themes (instances of theme.js) and
                                   # this file handles the application of those themes
        View.js                    # Generic View. Contains most of the logic regarding rendering, templating, events, etc.
        ViewController.js          # A Controller than manages a View.
        WebSQL.js                  # Web SQL wrapper
    scss/                      # Styles (look)
      lib/                       # Utility partials (includes base look & feel)
        _alert.scss                # Styles for alerts (not used in this app)
        _bar-navigation.scss       # Styles for navigation bars
        _bar.scss                  # Styles for bars in general
        _base.scss                 # Some basic styles that apply everywhere
        _button.scss               # Essentially make <button> not look like a browser button
        _container.scss            # Container styles
        _glyphs.scss               # Not used
        _list.scss                 # Styles for lists, list items, list actions
        _navigation-view-          # Basic styles for the navigation controllers themselves
         controller.scss
        _split-view-controller     # Split view controller (not used in app)
         .scss
        _svg.scss                  # Styling for SVG icons
      themes/                    # Themes
        _dark.scss                 # Darker theme
        _default.scss              # Default theme
        _default-anims.scss        # Animation styles for all themes (App generally avoids most animations though)
        _light.scss                # Brighter theme
      views/                     # view-specific styles
        _AboutViewController.scss  # Styles specific to the About screen
        _DefinitionViewController  # Styles specific to the Definitions screen
         .scss
        _NotesViewController.scss  # Styles specific to the Notes editor
        _SearchViewController.scss # Styles specific to the Search screen
        _SettingsViewController    # Styles specific to the Settings screen
         .scss
      app.scss                   # Combines all the rest of the styles in the project; becomes build/www/css/app.css.

    index.html                 # HTML bootstrap
    wordnet.db                 # SQLite pre-populated dictionary
    wordnet.json               # JSON pre-populated dictionary (for non-Web SQL platforms, like the browser)
  config.xml                 # Config.xml template (transformed during build)
test/                      # Code tests
  helpers/                   # Test helpers (setup)
test-ui/                   # Automation tests
  helpers/                   # Test helpers (setup)
build.json                 # Build configuration (v12 only)
gulpfile.json              # Gulp stub
package.json               # Package settings

```

### Visual Design


### Library Functions

### App library functions

### Models

### Views

### Controllers




### Statistics

```
           Source    Tests    Tasks  | Total
           --------------------------+-------
Physical     5744      603      800  |  7147
Source:      4513      529      674  |  5716
Comment:      741       20       40  |   801
   Single:    269       14       11  |   294
   Block:     472        6       29  |   507
Mixed:        166        6       11  |   183
Empty:        658       60       97  |   815
Files:         85       19       37  |   141

996K Source, 48K Test, 32K Test-ui, 148K Gulp = 1224K
Build generate 458MiB
Node modules 646MiB
```
