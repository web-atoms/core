import { src, dest, watch, parallel } from 'gulp';
import rename from "gulp-rename";
import less from 'gulp-less';
import sourcemaps from "gulp-sourcemaps";

const paths = {
    styles: {
      src: 'src/**/*.less',
      dest: 'dist/'
    }
};

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(rename((path) => {
      path.extname = ".less.css";
      return path;
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(paths.styles.dest));
}

/*
* You could even use `export as` to rename exported tasks
*/
function watchFiles() {
    watch(paths.styles.src, { ignoreInitial: false },  styles);
}

export { watchFiles as watch };

const build = parallel(styles);
/*
* Export a default task
*/
export default build;