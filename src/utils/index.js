export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getUrlParam = (paramName) => {
  const urlString = window.location;
  const url = new URL(urlString);

  return url.searchParams.get(paramName);
}

export const filterIt = (array, value, key) => {
  return array.filter(key
    ? a => a[key] === value
    : a => Object.keys(a).some(k => a[k] === value)
  );
}

export const filterItIndex = (array, value, key) => {
  let index = -1;
  array.forEach((elm, i) => {
    if (elm[key] == value) index = i;
  });

  return index;
}

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const getExt = (filename) => {
  return filename.split('.').pop();
}

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const sortByDate = (array, key) => {
  array.sort((a, b) => {
    return new Date(b[key]) - new Date(a[key]);
  });
}

export const retrieveImageFromClipboardAsBase64 = (pasteEvent, callback, imageFormat) => {
  if (pasteEvent.clipboardData == false) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  const items = pasteEvent.clipboardData.items;

  if (items == undefined) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") == -1) continue;
    const blob = items[i].getAsFile();

    const mycanvas = document.createElement("canvas");
    const ctx = mycanvas.getContext('2d');

    const img = new Image();

    img.onload = function () {
      mycanvas.width = this.width;
      mycanvas.height = this.height;

      ctx.drawImage(img, 0, 0);

      if (typeof (callback) == "function") {
        callback(mycanvas.toDataURL(
          (imageFormat || "image/png")
        ));
      }
    };

    const URLObj = window.URL || window.webkitURL;
    img.src = URLObj.createObjectURL(blob);
  }
}

export const retrieveImageFromClipboard = (pasteEvent, callback) => {
  if (pasteEvent.clipboardData == false) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  const items = pasteEvent.clipboardData.items;

  if (items == undefined) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") == -1) continue;
    const blob = items[i].getAsFile();

    if (typeof (callback) == "function") {
      callback(blob);
    }
  }
}

export const getVideoElement = (url, width, height) => {
  const videoE = document.createElement('video');
  videoE.loop = true;
  videoE.width = width;
  videoE.height = height;
  videoE.muted = "muted";
  videoE.autoplay = true;
  videoE.crossOrigin = "anonymous";
  const source = document.createElement('source');
  source.src = url;
  source.type = 'video/mp4';
  videoE.appendChild(source);
  return videoE;
}

export const getVideoDimensionsOf = (url) => {
  return new Promise(function (resolve) {
    let video = document.createElement('video');
    video.addEventListener("loadedmetadata", function () {
      let height = this.videoHeight;
      let width = this.videoWidth;
      
      resolve({
        videoHeight: height,
        videoWidth: width
      });
    }, false);

    video.src = url;
  });
}