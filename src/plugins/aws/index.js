import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;
import appConfig from "../../configs/appConfig";
import shortid from 'shortid';
import { sortByDate } from "../../utils/index";
const apigClientFactory = require('aws-api-gateway-client').default;
import { getExt } from "../../utils";

const GET_API = 'https://1p1obmckcd.execute-api.us-east-2.amazonaws.com/stage';
const SAVE_API = 'https://0h1krltdak.execute-api.us-east-2.amazonaws.com/stage';

const AWSService = {

  s3: null,
  id: null,
  dispatch: null,
  notification: null,
  canvas: null,

  init(dispatch, canvas, notification) {
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
    this.canvas = canvas;
    this.notification = notification;

  },

  addPhoto(files) {
    if (!files.length) {
      return console.log("Please choose a file to upload first.");
    }

    const promises = [];

    Array.from(files).forEach((f, i) => {
      const file = f;
      const ext = getExt(file.name);
      const fileName = `${shortid.generate()}.${ext}`;
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

        this.dispatch({ type: "SET_PROGRESS", data: {progress:p, index: i} });

        if (p == 100) {
          setTimeout(() => {
            this.dispatch({ type: "SET_PROGRESS", data: {progress:0, index: i} });
          }, 100);
        }
      });

      promises.push(upload.promise());
    })

    return Promise.all(promises).then(()=>{
      this.dispatch({ type: "SET_VALUES", data: { uploadImagesProgress: []} });
    });
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
  },

  saveCanvas() {
    const config = { invokeUrl: SAVE_API }
    const apigClient = apigClientFactory.newClient(config);

    const body = {
      "id": this.id,
      "canvas": JSON.stringify(this.canvas)
    };

    const additionalParams = {}

    //Template syntax follows url-template https://www.npmjs.com/package/url-template
    const pathTemplate = '/'
    const method = 'POST';

    apigClient.invokeApi({}, pathTemplate, method, additionalParams, body).then((result) => {
      console.log(result)
    }).catch((result) => {
      console.log(result)
    });
  },

  getCanvas() {
    const config = { invokeUrl: GET_API }
    const apigClient = apigClientFactory.newClient(config);

    const additionalParams = {
      queryParams: {
        id: this.id
      }
    }

    const pathTemplate = ''
    const method = 'GET';

    apigClient.invokeApi({}, pathTemplate, method, additionalParams).then((result) => {
      this.canvas.clear().renderAll();
      this.canvas.loadFromJSON(result.data.Item.USER_CANVAS.S, () => {
        this.canvas.renderAll();
      });
    }).catch((result) => {
      console.log(result)
    });


  }
}

export default AWSService;