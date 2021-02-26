const appConfig = {
  projectName: "Moodboard",
  lang: "eng",
  initialImageSize: 400,
  albumBucketName: "canvas-moodboard",
  bucketRegion: "us-east-2",
  IdentityPoolId: "us-east-2:101ce2a5-3444-4fe4-9520-baf0db9ab2d0",
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