export default async function tinifyImage(files, limitUpload, currentFilesLength) {
  let ImageCompressor = (await import('image-compressor.js')).default
  const imageCompressor = new ImageCompressor()
  var promises = []
  let length = Math.min(files.length, limitUpload - currentFilesLength)
  for (let i = 0; i < length; i++) {
    promises.push(imageCompressor.compress(files[i], {
      quality: 0.6,
      maxWidth: 1200,
      convertSize: 1000000
    }))
  }
  let preFiles = []
  let urlFiles = []
  return Promise.all(promises)
    .then((results) => {
      let l = results.length
      for (let i = 0; i < l; i++) {
        preFiles = [...preFiles, results[i]]
        urlFiles = [...urlFiles, URL.createObjectURL(results[i])]
      }
      return {
        preFiles: preFiles,
        tempFiles: urlFiles
      }
    })
    .catch(() => {
      // Handle the error
    })
}
