import styled from 'styled-components';
import {ui, responsive} from "../../configs/appConfig";

export const StyledSidebar = styled.div`
  width: ${ui.sidebarWidth};
  height: ${ui.sidebarHeight};
  position: absolute;
  background-color: ${({ theme }) => theme.colors.cover};
  right: 0;
  top: 0;
  transform: ${({isActive}) => isActive ? `translateX(0)` : `translateX(100%)`};
  transition: transform ${({ theme }) => theme.transitions.transition} ${({ theme }) => theme.transitions.transitionTiming};

  @media (max-width: ${responsive.md}) {
    width: 100vw;
    height: 100vh;
  }
`

export const StyledSidebarClose = styled.div`
  position: absolute;
  border-radius: 50%;
  right: 2rem;
  top: 2rem;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.dark};
  opacity: 0.5;
  transition: opacity ${({ theme }) => theme.transitions.transition} ease;

  &:hover {
    opacity: 1;
  }
`

export const StyledSidebarShow = styled.div`
  width: 2rem;
  height: 2rem;
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 1.4rem;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.dark};
  opacity: ${({isActive}) => isActive ? `0.5` : `0`};
  background-color: ${({ theme }) => theme.colors.cover};
  pointer-events: ${({isActive}) => isActive ? `all` : `none`};

  transform: ${({isActive}) => isActive ? `translateX(-3rem)` : `translateX(0)`};
  transition: opacity ${({ theme }) => theme.transitions.transition} ease, transform ${({ theme }) => theme.transitions.transition} ${({ theme }) => theme.transitions.transitionTiming};

  &:hover {
    opacity: ${({isActive}) => isActive ? `1` : `0`};
  }


`


