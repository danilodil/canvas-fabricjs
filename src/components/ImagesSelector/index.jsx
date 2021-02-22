import React, { useState, createRef } from "react";
import { StyledImagesSelector, StyledImage, StyledImagesContainer } from "./StyledImagesSelector";
import SmoothScrollBar from "react-smooth-scrollbar";

const ImagesSelector = ({ onSelect, data, onImagesAdded, onImageStartDrag, onImageStopDrag }) => {

  const [imgRefs] = useState(data.map(() => createRef()));

  const onDragStart = (e, i) => {
    e.target.classList.add("draging");
    if(onImageStartDrag) onImageStartDrag(imgRefs[i].current);
  }

  const onDragEnd = (e, i) => {
    e.target.classList.remove("draging");
    if(onImageStopDrag) onImageStopDrag(imgRefs[i].current);
  }

  const render = () => {
    const imgs = [];
    data.map((img, i) => {
      imgs.push(
        <StyledImage draggable={true} key={`si-${i}`} onDragStart={(e)=>onDragStart(e, i)} onDragEnd={(e)=>onDragEnd(e, i)} onClick={() => onSelect(img.name)}>
          <img ref={imgRefs[i]} draggable={true} src={`../assets/img/${img.name}`} alt="" />
        </StyledImage>)

      if (i === data.length - 1) {
        if(onImagesAdded) onImagesAdded(imgRefs)
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
