import styled from 'styled-components';

export const StyledImagesContainer = styled.div`
  margin-top: 2rem;

  .scroll-bar-inner {
    width: calc(100% + 20px);
    padding-right: 20px;
  }
`

export const StyledImagesSelector = styled.div`
  width: 100%;
  height: 60vh;
`

export const StyledImage = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  transition: border ${({theme}) => theme.transitions.transition} ease;

  &:after{
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border: 5px solid ${({theme}) => theme.colors.light};
    opacity: 0;
    transition: opacity ${({theme}) => theme.transitions.transition} ease;
  }

  &:hover {
    &:after{
      opacity: 1;
    }
  }
  
  img {
    max-width: 100%;
    display: block;
  }
`

