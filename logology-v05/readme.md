# Logology v5.0.0

This chapter was all about creating accessible hybrid apps. As far as the DOM elements and CSS Styles go,
the app as it existed in chapter 4 was already reasonably accessible. The following features were introduced:

* `src/www/js/app/index.js`:

    * `configureAccessibility` -- if available, we obtain the system zoom setting
    * `screenReaderSpeak` -- Checks if the screen reader is active, and if so, speaks a phrase
    * `notifyAccessibility` -- Notifies the screen reader whenever a view is pushed or popped. 
      The view name is spoken, and on iOS, Accessibility is notified that the screen changed
    * Lots of additional `then` calls using `notifyAccessibility`
    * When a word is favorited, `toggleFavorite` tells the screen reader to speak this change.