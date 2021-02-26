import styled from 'styled-components';

export const StyledEditor = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.editorBackground};
  position: relative;
`

export const StyledActiveDrop = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events:none;
  display: flex;
  z-index: 6;
  align-items: center;
  justify-content: center;
  transition: opacity ${({ theme }) => theme.transitions.transition} ease;

  &::before{
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-color: ${({ theme }) => theme.colors.gray};
  }

  span {
    position: relative;
    z-index: 1;
    display: block;
    padding: 2rem;
    font-size: 2rem;
    background-color: ${({ theme }) => theme.colors.light};
  }

  &.active-drop {
    opacity: 1;
  }
`