
import styled from 'styled-components';

export const Separator = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
`
export const Spacer = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.spacings.spacer};
`

export const Label = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05rem;
  margin-bottom: 0.5rem;
`

export const TextArea = styled.textarea`
  border-radius: ${({ theme }) => theme.button.borderRadius};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  background-color: ${({ theme }) => theme.colors.light};
  padding: 1rem;
  display: block;
  font-size: 1rem;
  font-weight: 400;
  font-family:  ${({ theme }) => theme.font.family};

  ::placeholder {
    color: ${({ theme }) => theme.colors.borderColor};
  }
`