import React, { useState, createRef } from "react";
import { StyledImagesSelector, StyledImage, StyledImagesContainer } from "./StyledImagesSelector";
import SmoothScrollBar from "react-smooth-scrollbar";
import { getExt } from "../../utils";

const ImagesSelector = ({ onSelect, data, onImagesAdded, onImageStartDrag, onImageStopDrag }) => {

  const [imgRefs] = useState(data.map(() => createRef()));

  const onDragStart = (e, i, name) => {
    e.target.classList.add("draging");
    if (onImageStartDrag) onImageStartDrag(imgRefs[i].current, name);
  }

  const onDragEnd = (e, i, name) => {
    e.target.classList.remove("draging");
    if (onImageStopDrag) onImageStopDrag(imgRefs[i].current, name);
  }

  const renderAsset = (name, i) => {
    const ext = getExt(name);

    switch (ext) {
      case "mp4":
        return <video ref={imgRefs[i]} draggable={true} loop autoPlay muted>
          <source src={`../assets/img/${name}`} type="video/mp4" />
              Your browser does not support the video tag.
        </video>
      default:
        return <img ref={imgRefs[i]} draggable={true} src={`../assets/img/${name}`} alt="" />
    }
  }

  const render = () => {
    const imgs = [];
    data.map((img, i) => {
      imgs.push(
        <StyledImage draggable={true} key={`si-${i}`} onDragStart={(e) => onDragStart(e, i, img.name)} onDragEnd={(e) => onDragEnd(e, i, img.name)} onClick={() => onSelect(img.name, imgRefs[i].current)}>
          {renderAsset(img.name, i)}
        </StyledImage>)

      if (i === data.length - 1) {
        if (onImagesAdded) onImagesAdded(imgRefs)
      }
    })

    return imgs;
  }

  return (
    <StyledImagesContainer>
      <SmoothScrollBar alwaysShowTracks={true} className="scroll-bar-inner">
        <StyledImagesSelector>
          {render()}
        </StyledImagesSelector>
      </SmoothScrollBar>
    </StyledImagesContainer>
  );
}

export default ImagesSelector;
