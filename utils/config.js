const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: 'nonsocloud',
  api_key: '892665119123113',
  api_secret: 'A58ebIFf1NHay5gQmQPt-1Tv870'
})

exports.uploads = (file, folder) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({
        url: result.secure_url,
        id: result.public_id
      })
    }, {
      resource_type: "auto",
      folder: folder
    }
    )
  })
}