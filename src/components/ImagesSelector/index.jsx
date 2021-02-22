import React from "react";
import { StyledImagesSelector, StyledImage, StyledImagesContainer } from "./StyledImagesSelector";
import SmoothScrollBar from "react-smooth-scrollbar";

const ImagesSelector = ({ children, onSelect, data }) => {

  return (
    <StyledImagesContainer>
      <SmoothScrollBar alwaysShowTracks={true} className="scroll-bar-inner">
        <StyledImagesSelector>
          {data.map((img, i) => (
            <StyledImage key={`si-${i}`} onClick={()=>onSelect(img.name)}>
              <img draggable={true} src={`../assets/img/${img.name}`} alt="" />
            </StyledImage>
          ))}
        </StyledImagesSelector>
      </SmoothScrollBar>
    </StyledImagesContainer>
  );
}

export default ImagesSelector;
