const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const deleteEmpty = require("delete-empty");
const gulpClean = require("gulp-clean");

const packages = {
    logger: ts.createProject("packages/logger/tsconfig.json"),
};

const modules = Object.keys(packages);
const source = "packages";
const distId = process.argv.indexOf("--dist");
const dist = distId < 0 ? source : process.argv[distId + 1];

gulp.task("default", function () {
    modules.forEach((module) => {
        gulp.watch(
            [`${source}/${module}/**/*.ts`, `${source}/${module}/*.ts`],
            [module],
        );
    });
});

gulp.task("copy-misc", function () {
    return gulp
        .src(["LICENSE", ".npmignore"])
        .pipe(gulp.dest(`${source}/logger`));
});

gulp.task("clean:output", function () {
    return gulp
        .src(
            [
                `${source}/**/*.js`,
                `${source}/**/*.d.ts`,
                `${source}/**/*.js.map`,
            ],
            { read: false },
        )
        .pipe(clean());
});

gulp.task("clean:dirs", function (done) {
    deleteEmpty.sync(`${source}/`);
    done();
});

gulp.task("clean:bundle", gulp.series("clean:output", "clean:dirs"));

modules.forEach((module) => {
    gulp.task(module, () => {
        return packages[module]
            .src()
            .pipe(packages[module]())
            .pipe(gulp.dest(`${dist}/${module}`));
    });
});

modules.forEach((module) => {
    gulp.task(module + ":dev", () => {
        return packages[module]
            .src()
            .pipe(sourcemaps.init())
            .pipe(packages[module]())
            .pipe(
                sourcemaps.mapSources(
                    (sourcePath) => "./" + sourcePath.split("/").pop(),
                ),
            )
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(`${dist}/${module}`));
    });
});

gulp.task("common:dev", gulp.series(modules.map((module) => module + ":dev")));
gulp.task("build", gulp.series(modules));
gulp.task("build:dev", gulp.series("common:dev"));
