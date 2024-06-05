import { Command } from 'cliffy';
import * as fs from 'std/fs/mod.ts';
import * as sass from 'sass';
import * as path from 'std/path/mod.ts';

const srcPath = path.resolve('./src');
const destPath = path.resolve('./dist');

const sassFiles = ['style.scss'];
const copyFiles = ['index.html', 'profile.jpg', 'thumb.png'];

const { options } = await new Command()
  .option('-w, --watch', 'watch mode')
  .parse(Deno.args);

const sassCompileTask = function(): Promise<void>[] {
  return sassFiles.map(async (filename) => {
    const outputFilename = filename.replace(/\.s(a|c)ss$/, '.css');
    const result = await sass.compileAsync(path.join(srcPath, filename));
    await Deno.writeTextFile(path.join(destPath, outputFilename), result.css);
  })
}

const copyTask = function(): Promise<void>[] {
  return copyFiles.map(async (filename) => {
    await Deno.copyFile(
      path.join(srcPath, filename),
      path.join(destPath, filename)
    );
  });
}

const build = async function(): Promise<void> {
  await fs.ensureDir(destPath);

  await Promise.all([
    ...sassCompileTask(),
    ...copyTask(),
  ]);

  console.log('Build ended');
}

if(options.watch) {
  const inputFiles = [
    ...sassFiles,
    ...copyFiles,
  ].map((v) => path.join(srcPath, v));
  await build();

  const watcher = Deno.watchFs(inputFiles, { recursive: true });
  for await(const ev of watcher) {
    if(ev.kind === 'create' || ev.kind === 'modify') {
      try {
        await build();
      } catch(err) {
        console.log(err);
      }
    }
  }
} else {
  await build();
}
