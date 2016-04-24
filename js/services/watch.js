const fs = nodeRequire('fs'); // eslint-disable-line

const isImage = (path) => new RegExp(".*\.(jpg|JPG|png|PNG|gif|GIF)$").test(path);

const watch = function () {

  let watchingFolder = null, watcher, onChange, onReset;

  return function ({ watch }, throttled) {

    onChange = watch.onChange;
    onReset = watch.onReset;

    const { folder } = watch;

    if (!folder) {
      console.log('no folder set'); // eslint-disable-line
    }

    const isFirstTime = (watchingFolder == null && folder != null);
    const isNewFolder = (folder != null && watchingFolder != null && folder != watchingFolder);

    const shouldSetFolder = isFirstTime || isNewFolder;

    if (shouldSetFolder) {
      watchingFolder = folder;

      throttled(() => onReset());

      if (watcher) {
        watcher.close();
      }

      const prefixFolder = (filename) => `${folder}/${filename}`;

      const triggerOnChange = function (files) {
        const images = files.filter(isImage);
        const localImages = images.map(image => `file://${image}`);
        onChange(localImages);
      };

      fs.readdir(folder, function (err, files) {
        if (err) {
          console.warn(err); // eslint-disable-line
          return;
        }

        triggerOnChange(files.map(prefixFolder));

        try {
          watcher = fs.watch(folder, bufferCallsFor(1000, function (event, filenames) {
            if (event == 'rename') {
              triggerOnChange(filenames.map(prefixFolder));
            }
          }));
        }
        catch (e) {
          console.warn(e); // eslint-disable-line
        }
      });
    }
  };
};

export default watch;

function bufferCallsFor (ms, fn) { // eslint-disable-line
  let timeout;
  let buffer;
  return function (event, filename) {
    if (timeout) {
      if (buffer.indexOf(filename) == -1) {
        buffer.push(filename);
      }
      clearTimeout(timeout);
    }
    else {
      buffer = [filename];
    }

    timeout = setTimeout(function () {
      timeout = null;
      fn(event, buffer);
    }, ms);
  };
}
