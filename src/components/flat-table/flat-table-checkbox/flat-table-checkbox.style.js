import styled, { css } from "styled-components";
import StyledCheckbox from "../../checkbox/checkbox.style";
import baseTheme from "../../../style/themes/base";

const StyledFlatTableCheckbox = styled.td`
  ${({ as, theme, leftPosition, makeCellSticky }) => css`
    ${as === "td" &&
    css`
      background-color: ${theme.colors.white};
      border-width: 0;
      border-bottom: 1px solid ${theme.table.secondary};
      overflow: visible;
      padding: 0;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;

      &:first-of-type {
        border-left: 1px solid ${theme.table.secondary};
      }

      &:last-of-type {
        border-right: 1px solid ${theme.table.secondary};
      }
    `}

    ${as === "th" &&
    css`
      background-color: transparent;
      border-width: 0;
      border-bottom: 1px solid ${theme.table.secondary};
      box-sizing: border-box;
      font-weight: 700;
      left: auto;
      padding: 0;
      text-align: left;
      top: 0;
      user-select: none;
      vertical-align: middle;
      white-space: nowrap;
    `}

    ${makeCellSticky &&
    css`
      top: auto;
      left: ${leftPosition}px;
      position: sticky;
    `}
  `}

  width: 18px;

  ${StyledCheckbox} {
    padding-top: 0px;
  }
`;

StyledFlatTableCheckbox.defaultProps = {
  theme: baseTheme,
};

export default StyledFlatTableCheckbox;
