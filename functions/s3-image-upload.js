const AWS = require("aws-sdk");
const fs = require("fs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
/**
 *
 *
 * @param {*} files
 * @return {string[]} image url array
 */
function s3ImageUpload(files) {
  const imageFiles = files;

  AWS.config.setPromisesDependency();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

  let imageUrlArray = [];

  for (let index = 0; index < imageFiles.length; index++) {
    const image = imageFiles[index];
    let params = {
      ACL: "public-read",
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fs.createReadStream(image.path),
      Key: image.filename,
    };

    let url = `https://${
      process.env.AWS_BUCKET_NAME
    }.s3.amazonaws.com/${encodeURIComponent(params.Key)}`;
    imageUrlArray.push(url);
    // console.log(url);
    // console.log(imageUrlArray);

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
      }

      if (data) {
        // console.log(data);
        // console.log(data.Location);
        console.log(data.Location);
      }
    });
  }

  return imageUrlArray;
}
