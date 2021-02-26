import React, { useState, createRef, useContext, useEffect } from "react";
import { StyledImagesSelector, StyledImage, StyledImagePreloader, StyledImageDrop } from "./StyledImagesSelector";
import { getExt } from "../../utils";
import ScrollBarWrapper from "../ScrollBarWrapper";
import {Context} from "../../context/context";
import languages from "../../configs/languages";
import appConfig from "../../configs/appConfig";

const ImagesSelector = ({ onSelect, data, onImagesAdded, onImageStartDrag, onImageStopDrag }) => {

  const [imgRefs, setimgRefs] = useState(data?.map(() => createRef()));
  const {notification, dispatchState} = useContext(Context);
  const lang = languages[appConfig.lang];

  useEffect(()=>{
    if(data) setimgRefs(data?.map(() => createRef()));
  },[data])

  const onDragStart = (e, i, name) => {
    dispatchState({type:"SET_APP_VALUES", data:{isDragFromSidebar:true}})
    e.target.classList.add("draging");
    if (onImageStartDrag) onImageStartDrag(imgRefs[i].current, name);
  }

  const onDragEnd = (e, i, name) => {
    setTimeout(() => {
      dispatchState({type:"SET_APP_VALUES", data:{isDragFromSidebar:false}})
    }, 1000);
    e.target.classList.remove("draging");
    if (onImageStopDrag) onImageStopDrag(imgRefs[i].current, name);
  }

  const renderAsset = (name, i, src) => {
    const ext = getExt(name);

    switch (ext) {
      case "mp4":
        return <video ref={imgRefs[i]} draggable={true} loop autoPlay muted>
          <source src={`${src}`} type="video/mp4" />
              Your browser does not support the video tag.
        </video>
      default:
        return <img ref={imgRefs[i]} draggable={true} src={`${src}`} alt="" />
    }
  }

  const render = () => {
    const imgs = [];
    data.map((img, i) => {
      imgs.push(
        <StyledImage draggable={true} key={`si-${i}`} onDragStart={(e) => onDragStart(e, i, img.Key)} onDragEnd={(e) => onDragEnd(e, i, img.Key)} onClick={() => onSelect(img.Key, imgRefs[i].current)}>
          {renderAsset(img.Key, i, img.src)}
        </StyledImage>)

      if (i === data.length - 1) {
        if (onImagesAdded) onImagesAdded(imgRefs)
      }
    })

    return imgs;
  }

  return (
    <ScrollBarWrapper>
      <StyledImagesSelector>
        {notification.uploadImageProgress != 0 && <StyledImagePreloader value={notification.uploadImageProgress}/>}
        {data?.length > 0 ? render() : <StyledImageDrop>{lang.Dropfileshere}</StyledImageDrop>}
      </StyledImagesSelector>
    </ScrollBarWrapper>
  );
}

export default ImagesSelector;
