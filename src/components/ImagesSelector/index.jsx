import React, { useState, createRef, useContext, useEffect } from "react";
import { StyledImagesSelector, StyledImage, StyledImagePreloader, StyledImageDrop, StyledImagContainer, StyledImageList } from "./StyledImagesSelector";
import { getExt } from "../../utils";
import ScrollBarWrapper from "../ScrollBarWrapper";
import { Context } from "../../context/context";
import languages from "../../configs/languages";
import appConfig from "../../configs/appConfig";

const ImagesSelector = ({ onSelect, data, onImagesAdded, onImageStartDrag, onImageStopDrag, onFilesSelected }) => {

  const [imgRefs, setimgRefs] = useState(data?.map(() => createRef()));
  const { notification, dispatchState } = useContext(Context);
  const lang = languages[appConfig.lang];

  useEffect(() => {
    if (data) setimgRefs(data?.map(() => createRef()));
  }, [data])

  const onDragStart = (e, i, name) => {
    dispatchState({ type: "SET_APP_VALUES", data: { isDragFromSidebar: true } })
    e.target.classList.add("draging");
    if (onImageStartDrag) onImageStartDrag(imgRefs[i].current, name);
  }

  const onDragEnd = (e, i, name) => {
    setTimeout(() => {
      dispatchState({ type: "SET_APP_VALUES", data: { isDragFromSidebar: false } })
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
        <StyledImage draggable={true} key={`si-${i}`} onDragStart={(e) => onDragStart(e, i, img.src)} onDragEnd={(e) => onDragEnd(e, i, img.src)} onClick={() => onSelect(img.src, imgRefs[i].current)}>
          {renderAsset(img.Key, i, img.src)}
        </StyledImage>)

      if (i === data.length - 1) {
        if (onImagesAdded) onImagesAdded(imgRefs)
      }
    })

    return imgs;
  }

  return (
    <StyledImagContainer>
      <StyledImageDrop>{lang.Pleasechooseorfropfiles}<input onChange={onFilesSelected} type="file" name="files" multiple /></StyledImageDrop>
      <StyledImageList>
        <ScrollBarWrapper>
          <StyledImagesSelector>
            {notification.uploadImagesProgress && notification.uploadImagesProgress.map((prgr, i) => (
              prgr > 0 && <StyledImagePreloader key={`pri-${i}`} value={prgr} />
            ))}
            {data?.length > 0 && render()}
          </StyledImagesSelector>
        </ScrollBarWrapper>
      </StyledImageList>
    </StyledImagContainer>
  );
}

export default ImagesSelector;
