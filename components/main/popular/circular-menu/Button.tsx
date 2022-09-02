import * as React from "react";
import styled, { css } from "styled-components";
import { IPopularGroup } from "../../../../types/popular";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import Icon from "../../../shared/Icon";

const buttonHover = css`
  &:hover {
    transform: scale(1.1);
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

  ${(p) => !p.isOpen && buttonHover}

  & svg {
    transition: 0.25s ease-in-out;
    transform: rotate(${(p) => (p.isOpen ? 45 : 0)}deg);
  }
`;

const Button = React.forwardRef(function Button(
  { style, className, isOpen, onClick, group }: { group: IPopularGroup },
  ref
) {
  return (
    <ButtonBase
      ref={ref}
      style={style}
      className={className}
      isOpen={isOpen}
      onClick={onClick}
    >
      <Icon icon={group.icon} big />
    </ButtonBase>
  );
});

export default Button;
