import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;
import appConfig from "../../configs/appConfig";

const AWSService = {

  s3: null,

  init() {
    AWS.config.update({
      region: appConfig.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId
      })
    });

    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: appConfig.albumBucketName }
    });

  },

  addPhoto(albumName, files) {
    if (!files.length) {
      return console.log("Please choose a file to upload first.");
    }
    const file = files[0];
    const fileName = file.name;
    const albumPhotosKey = encodeURIComponent(albumName) + "/";

    const photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: appConfig.albumBucketName,
        Key: photoKey,
        Body: file
      }
    });

    // .on('httpUploadProgress', function(evt) {
    //   console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
    // })

    const promise = upload.promise();

    return promise;
  },
}

export default AWSService;