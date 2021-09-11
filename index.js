import path from 'node:path';
import PluginError from 'plugin-error';
import replaceExt from 'replace-ext';
import through from 'through2';
import execBuffer from 'exec-buffer';
import bin from 'cwebp-bin';

const booleanFlags = new Set(['lossless', 'mt', 'low_memory', 'af', 'jpeg_like', 'strong', 'nostrong', 'sharp_yuv']);

const cwebp = (options = {}) => through.obj(async (file, encode, callback) => {
  if (file.isNull()) {
    callback(null, file);
    return;
  }

  if (file.isStream()) {
    callback(new PluginError('gulp-cwebp', 'Streaming not supported'));
    return;
  }

  const extension = path.extname(file.path).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
    callback(null, file);
    return;
  }

  const args = ['-o', execBuffer.output, execBuffer.input];
  for (const key of Object.keys(options)) {
    args.push(`-${key}`);

    if (!booleanFlags.has(key)) {
      args.push(options[key]);
    }
  }

  try {
    const buffer = await execBuffer({
      input: file.contents,
      bin,
      args,
    });

    file.contents = buffer;
    file.path = replaceExt(file.path, '.webp');
    callback(null, file);
  } catch (error) {
    callback(new PluginError('gulp-cwebp', error));
  }
});

export default cwebp;
