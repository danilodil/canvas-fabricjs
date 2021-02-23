import styled from 'styled-components';

export const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

export const StyledContainer = styled.div`
  width: 100%;
`

export const StyledRow = styled.div`
  width: calc(100% + ${({ theme }) => theme.spacings.gutter}px);
  margin-left: -${({ theme }) => theme.spacings.gutter/2}px;
  display: flex;
  align-items: stretch;
`

export const StyledCol = styled.div`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacings.gutter/2}px;
`




