const appConfig = {
  projectName: "Moodboard",
  lang: "eng",
  initialImageSize: 400,
  albumBucketName: "moodboard",
  bucketRegion: "us-east-2",
  IdentityPoolId: "us-east-2:a9926a9a-cd44-428f-8b4a-198ae59044eb",
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