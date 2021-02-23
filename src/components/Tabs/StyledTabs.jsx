import styled from 'styled-components';

const navHeight = "40px";

export const StyledTab = styled.div`
  width: 100%;
  height: calc(100% - ${navHeight});
  position: absolute;
  top: ${navHeight};
  left: 0;
  padding: ${({ theme }) => theme.spacings.tabPadding};
`

export const StyledTabActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  margin-bottom: 1rem;
  flex-wrap: wrap;

  >* {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`
export const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`
export const StyledTabsNav = styled.div`
  width: calc(100% + 0.4rem);
  margin-left: -0.2rem;
  height: ${navHeight};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings.tabPadding};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`
export const StyledTabsNavItem = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05rem;
  margin: 0 0.2rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-bottom:none;
  border-radius: 5px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: ${({ theme }) => theme.colors.light};
  margin-bottom: -2px;
  user-select: none;
  transition: all ${({ theme }) => theme.transitions.transition} ease;

  &.active {
    background-color: ${({ theme }) => theme.colors.cover};
  }
`

