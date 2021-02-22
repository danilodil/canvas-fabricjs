import styled from 'styled-components';

export const StyledTab = styled.div`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacings.tabPadding};
`

export const StyledTabActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  >* {
    margin-right: 1rem;
  }
  
`

