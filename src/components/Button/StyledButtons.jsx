import styled from 'styled-components';

export const StyledButtonPrimary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.button.padding};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.button.transition} ease;

  &:hover {
    background-color: transparent;
  }
`

export const StyledButtonLight = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.button.padding};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.light};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.button.transition} ease, box-shadow ${({ theme }) => theme.button.transition} ease;
  box-shadow: ${({ theme }) => theme.button.shadow};

  &:hover {
    background-color: transparent;
    box-shadow: ${({ theme }) => theme.button.shadowHover};
  }
`