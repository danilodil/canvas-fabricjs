import styled from 'styled-components';

export const StyledImagesSelector = styled.div`
  width: 100%;
  height: 100%;
`

export const StyledImage = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  transition: border ${({theme}) => theme.transitions.transition} ease;

  &.draging {
    opacity: 0.5;
  }

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

  video {
    max-width: 100%;
  }
`

export const StyledImagePreloader = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
  position: relative;
  padding: 2rem;
  background-color: ${({theme}) => theme.colors.lgray};
  border: 1px solid transparent;

  &:after{
    position: absolute;
    content: '';
    width: calc(${({value}) => value}% - 4rem);
    height: 5px;
    position: absolute;
    border-radius: 2px;
    top: 50%;
    transform: translateY(-50%);
    left: 2rem;
    display: block;
    background-color: ${({theme}) => theme.colors.primary};
    transition: width ${({theme}) => theme.transitions.transition} ease;
  }
`

export const StyledImageDrop = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${({theme}) => theme.colors.lgray};
`
