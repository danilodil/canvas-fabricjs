const appConfig = {
  projectName: "Moodboard",
  lang: "eng",
  initialImageSize: 400,
  albumBucketName: "arn:aws:s3:::moodboard",
  bucketRegion: "US East (Ohio) us-east-2",
  IdentityPoolId: "IDENTITY_POOL_ID",
  thumbnailWidthSize: 300,
  thumbnailWidthHeight: 300,

  seo: {
    title: "Moodboard App"
  },

  ui: {
    sidebarWidth: "400px",
    sidebarHeight: "100%",
  },

  responsive: {
    md: "872px"
  }
}

export const ui = appConfig.ui;
export const responsive = appConfig.responsive;

export default appConfig;