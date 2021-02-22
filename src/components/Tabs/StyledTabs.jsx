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
  margin-bottom: 1rem;
  flex-wrap: wrap;

  >* {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
  
`

