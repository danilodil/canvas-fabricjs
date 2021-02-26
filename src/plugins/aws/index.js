import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;
import appConfig from "../../configs/appConfig";
import shortid from 'shortid';
import {sortByDate} from "../../utils/index";

const AWSService = {

  s3: null,
  id: null,
  dispatch: null,

  init(dispatch) {
    AWS.config.update({
      region: appConfig.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId
      })
    });

    this.s3 = new AWS.S3({
      params: { Bucket: appConfig.albumBucketName }
    });

    this.id = localStorage.getItem('id');

    if (!this.id) {
      this.id = shortid.generate();
      localStorage.setItem('id', this.id);
    }

    this.dispatch = dispatch;

  },

  addPhoto(files) {
    if (!files.length) {
      return console.log("Please choose a file to upload first.");
    }
    const file = files[0];
    const fileName = file.name;
    const albumPhotosKey = encodeURIComponent(this.id) + "/";

    const photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: appConfig.albumBucketName,
        Key: photoKey,
        Body: file
      }
    }).on('httpUploadProgress', (evt) => {

      const p = parseInt((evt.loaded * 100) / evt.total);

      this.dispatch({ type: "SET_VALUES", data: { uploadImageProgress: p } });

      if (p == 100) {
        setTimeout(() => {
          this.dispatch({ type: "SET_VALUES", data: { uploadImageProgress: 0 } });
        }, 100);
      }
    });

    const promise = upload.promise();

    return promise;
  },

  getObjects(callback) {
    const albumPhotosKey = encodeURIComponent(this.id) + "/";

    this.s3.listObjects({ Prefix: albumPhotosKey }, (err, data) => {
      if (err) {
        return alert("There was an error viewing your album: " + err.message);
      }

      sortByDate(data.Contents, "LastModified")

      const d = data.Contents.map((photo) => ({ ...photo, src: this.getUrlFromBucket(photo.Key) }));
      callback(d);
    });

  },

  getUrlFromBucket(fileName) {
    const regionString = appConfig.bucketRegion.includes('us-east-1') ? '' : (appConfig.bucketRegion)
    return `https://${appConfig.albumBucketName}.s3.${regionString}.amazonaws.com/${fileName}`
  }
}

export default AWSService;