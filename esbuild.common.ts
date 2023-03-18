import * as esbuild from 'esbuild';
import { posix } from 'posix';
import sassPlugin from 'esbuild-plugin-sass';
import { esbuildCachePlugin } from 'esbuild-cache-plugin';
import copyPlugin from 'esbuild-plugin-copy';
import resultPlugin from 'esbuild-plugin-result';

const srcPath = 'src';
const destPath = 'dist';
const cachePath = 'cache';

const config: Partial<esbuild.BuildOptions> = {
  entryPoints: [
    posix.join(srcPath, 'main.ts'),
    posix.join(srcPath, 'style/style.scss'),
  ],
  bundle: true,
  outdir: destPath,
  platform: 'browser',
  plugins: [
    esbuildCachePlugin({
      directory: cachePath
    }),
    sassPlugin(),
    copyPlugin({
      baseDir: srcPath,
      baseOutDir: destPath,
      files: [
        { from: 'index.html', to: 'index.html' },
        { from: 'imgs/*', to: 'imgs/[name][ext]' },
      ]
    }),
    resultPlugin()
  ]
}

export default config;