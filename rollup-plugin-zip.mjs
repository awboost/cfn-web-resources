import JSZip from 'jszip';

/**
 * @typedef {Object} ZipPluginOptions
 * @property {string} [fileName]
 */

/**
 * @param {ZipPluginOptions} [options]
 * @returns {import('rollup').Plugin}
 */
function zip(options) {
  const { fileName = 'bundle.zip' } = options;

  return {
    name: 'zip',

    async generateBundle(opts, bundle) {
      const zip = new JSZip();

      for (const name of Object.keys(bundle)) {
        const chunkOrAsset = bundle[name];
        delete bundle[name];

        if (chunkOrAsset.type === 'asset') {
          zip.file(chunkOrAsset.fileName, chunkOrAsset.source);
        } else if (chunkOrAsset.type === 'chunk') {
          zip.file(chunkOrAsset.fileName, chunkOrAsset.code);
        }
      }

      this.emitFile({
        type: 'asset',
        fileName,
        source: await zip.generateAsync({ type: 'nodebuffer' }),
      });
    },
  };
}

export default zip;
