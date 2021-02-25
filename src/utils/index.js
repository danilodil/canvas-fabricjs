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
    if(elm[key] == value) index = i;
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