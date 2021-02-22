import styled from 'styled-components';

export const StyledButton = styled.button`
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

  &.success {
    background-color: ${({ theme }) => theme.colors.success};
    border: 1px solid ${({ theme }) => theme.colors.success};
  }

  &.success-light {
    background-color: ${({ theme }) => theme.colors.successLight};
    border: 1px solid ${({ theme }) => theme.colors.successLight};

    &:hover {
      background-color: ${({ theme }) => theme.colors.successLight};
      border: 1px solid ${({ theme }) => theme.colors.successLight};
    }
  }

  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.light};
  }

  &:hover {
    background-color: transparent;
    box-shadow: ${({ theme }) => theme.button.shadowHover};
  }

  .app-icon {
    font-size: 1rem;
  }
`