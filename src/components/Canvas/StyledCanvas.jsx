import styled from 'styled-components';

export const StyledCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  &::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events:none;
    background-color: ${({ theme }) => theme.colors.cover};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.transition} ease;
    z-index: 1;
  }

  &.over {
    &::after{
      opacity: 0.5;
    }
  }
`