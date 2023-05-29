import * as esbuild from 'esbuild';
import { posix } from 'posix';
import sassPlugin from 'esbuild-plugin-sass';
import esbuildCachePlugin from 'esbuild-plugin-cache';
import copyPlugin from 'esbuild-plugin-copy';
import resultPlugin from 'esbuild-plugin-result';
import importmap from './import_map.json' assert { type: 'json' };

const srcPath = 'src';
const destPath = 'dist';
const cachePath = 'cache';

const lockMap = JSON.parse(Deno.readTextFileSync('./deno.lock'));
const cacheDir = await esbuildCachePlugin.util.getDenoDir();

const options = (dev: boolean): esbuild.BuildOptions => ({
  entryPoints: [
    posix.join(srcPath, 'main.ts'),
    posix.join(srcPath, 'style/style.scss'),
  ],
  bundle: true,
  outdir: destPath,
  platform: 'browser',
  plugins: [
    esbuildCachePlugin({
      lockMap,
      denoCacheDirectory: cacheDir,
      importmap
    }),
    sassPlugin(),
    copyPlugin({
      baseDir: srcPath,
      baseOutDir: destPath,
      files: [
        { from: 'index.html', to: 'index.html' },
        { from: 'imgs/*', to: 'imgs/[name][ext]' },
        { from: 'fonts/*', to: 'fonts/[name][ext]' },
        { from: 'style/fonts.css', to: 'style/fonts.css' },
      ]
    }),
    resultPlugin()
  ],
  minify: !dev,
  sourcemap: dev ? 'inline' : 'linked',
});

export default options;
