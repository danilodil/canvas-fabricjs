import styled from 'styled-components';

export const StyledCheck = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  margin-bottom: ${({ theme }) => theme.inputs.spacer};
  cursor: pointer;
  font-size: 0.875rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.disabled {
    opacity: 0.5;
    pointer-events:none;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkmark {
      background-color: ${({ theme }) => theme.colors.primary};
    }

    &:checked ~ .checkmark:after {
      display: block;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: ${({ theme }) => theme.inputs.checkSize};
    width: ${({ theme }) => theme.inputs.checkSize};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: ${({ theme }) => theme.button.borderRadius};
    background-color: ${({ theme }) => theme.colors.cover};
    transition: background-color ${({ theme }) => theme.transitions.transition} ease;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 8px;
      top: 4px;
      width: 5px;
      height: 10px;
      border: solid ${({ theme }) => theme.colors.light};
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:hover {
    input ~ .checkmark {
    background-color: ${({ theme }) => theme.colors.lgray};
  }
}

  &.remove-space {
    margin-bottom: 0;
  }
`

export const StyledRadio = styled.label`
  display: flex;
  position: relative;
  height: ${({ theme }) => theme.inputs.checkSize};
  padding-left: 35px;
  margin-bottom: ${({ theme }) => theme.inputs.spacer};
  cursor: pointer;
  font-size: 0.875rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.disabled {
    opacity: 0.5;
    pointer-events:none;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .checkmark {
      background-color: ${({ theme }) => theme.colors.primary};
    }

    &:checked ~ .checkmark:after {
      display: block;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: ${({ theme }) => theme.inputs.checkSize};
    width: ${({ theme }) => theme.inputs.checkSize};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: ${({ theme }) => theme.button.borderRadius};
    background-color: ${({ theme }) => theme.colors.cover};
    border-radius: 50%;
    transition: background-color ${({ theme }) => theme.transitions.transition} ease;

    &:after {
      content: "";
      position: absolute;
      display: none;
      top: 6px;
      left: 6px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.light};
    }
  }

  &:hover {
    input ~ .checkmark {
    background-color: ${({ theme }) => theme.colors.lgray};
  }
}

  &.remove-space {
    margin-bottom: 0;
  }
`

export const StyledRange = styled.div`
  margin-bottom: ${({ theme }) => theme.inputs.spacer};
  font-size: 0.875rem;
  display: flex;

  &.disabled {
    opacity: 0.5;
    pointer-events:none;
  }

  input {
    width: 100%;
  }

  span {
    min-width: 80px;
    flex-shrink: 0;
  }

  &.remove-space {
    margin-bottom: 0;
  }

`

export const StyledColor = styled.label`
  display: flex;
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.inputs.spacer};

  &.remove-space {
    margin-bottom: 0;
  }
`