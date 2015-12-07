"use strict";

var gulp = require("gulp");
var bump = require("gulp-bump");

module.exports = function bump(importance){
    return gulp.src([path.join(process.cwd(), "package.json")])
               .pipe(bump({type: importance}))
               .pipe(gulp.dest(process.cwd()));
}
