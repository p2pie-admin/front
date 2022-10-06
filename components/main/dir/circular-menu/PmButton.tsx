import * as React from "react";
import styled, { css } from "styled-components";
import { IDirGroup } from "../../../../types/dir";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import Icon from "../../../shared/Avatar";

const buttonHover = css`
  &:hover {
    transform: scale(1.05);
  }
`;

const ButtonBase = styled.button`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  transform: scale(1);
`;

const PmButton = React.forwardRef(function Button(
  { group }: { group: IDirGroup },
  ref
) {
  return (
    <ButtonBase ref={ref}>
      <Icon icon={group.icon} big />
    </ButtonBase>
  );
});

export default PmButton;
