import * as esbuild from 'esbuild';
import { Plugin, BuildOptions } from 'esbuild';
import { Command } from "cliffy";
import { readLines } from 'std/io/mod.ts';
import * as fmt from 'std/fmt/colors.ts';
import buildOptions from './buildOptions.ts';

const { options, args } = await new Command()
  .option('-d, --dev', 'development mode')
  .option('-w, --watch', 'watch mode (development only)')
  .parse(Deno.args);

const config = buildOptions(options.dev === true);
const ctx = await esbuild.context(config);

if(options.dev && options.watch) {
  await ctx.watch();
  console.log('Watching...');

  for await(const _ of readLines(Deno.stdin)) {
    // manually rebuild
    await ctx.rebuild().catch((_) => {});
  }
} else {
  // just build
  await ctx.rebuild();
}

esbuild.stop();
