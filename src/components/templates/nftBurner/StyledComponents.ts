import styled from '@emotion/styled';

const StyledCheckBox = styled.input`
  display: none;
`;

const StyledSpan = styled.span`
  div {
    margin: 4px;
  }
`;
const StyledLabel = styled.label`
  border-radius: 16px;
  :has(input[type='checkbox']:checked) {
    background-color: burlywood;
  }
`;

export { StyledCheckBox, StyledSpan, StyledLabel };
