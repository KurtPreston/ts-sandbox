import * as gulp from 'gulp';
import {WatchEvent} from 'gulp';
import * as ts from 'gulp-typescript';
import {TaskFactory} from '../taskFactory';
import * as sourcemaps from 'gulp-sourcemaps';

const tsProject = ts.createProject('src/server/tsconfig.json');

export const compileServer: TaskFactory<NodeJS.ReadWriteStream> = (a, {rootPath, buildDir}) => () => {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: './'
    }))
    .pipe(gulp.dest(`${rootPath}/${buildDir}`));
};

export const watchServer: TaskFactory<NodeJS.EventEmitter> = (a, context) => () => {
  const {rootPath, onExit} = context;
  const recompile = (event: WatchEvent) => {
    process.stdout.write('recompiling server...\n');
    compileServer(a, context)();
  };
  const watcher = a.watch(`${rootPath}/src/server/*`, recompile);
  onExit(() => (watcher as any).end());
  return watcher;
};

