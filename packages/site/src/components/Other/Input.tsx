import type { ComponentProps } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

export const LxpAddressInput = (props: ComponentProps<typeof Input>) => {
  return (
    <Input
      {...props}
      onChange={(ev: any) => {
        props.onChangeHandler(ev.target.value);
      }}
    ></Input>
  );
};
