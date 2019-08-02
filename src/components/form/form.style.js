import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import StyledFormField from '../../__experimental__/components/form-field/form-field.style';
import StyledButton from '../button/button.style';
import { isClassic } from '../../utils/helpers/style-helper';
import baseTheme from '../../style/themes/base';
import OptionsHelper from '../../utils/helpers/options-helper';

export const StyledAdditionalFormAction = styled.div`
  ${({ type }) => type && css`
    ${type === 'leftAlignedActions' && css`
      flex-grow: 1;
    `}

    ${type !== 'leftAlignedActions' && css`
      display: inline-block;
    `}

    ${StyledButton} {
      &:first-child {
        margin-left: 0;
      }
    }
  `}
`;

const FormButtonAnimation = keyframes`
  0%   { bottom: -50px; }
  100% { bottom: 0; }
`;

export const StyledFormFooter = styled.div`
  ${({ theme, stickyFooter }) => !isClassic(theme) && !stickyFooter && css`
    margin-top: 48px;
  `}

  ${({ buttonAlign }) => buttonAlign === 'right' && css`
    .carbon-app-wrapper{
      justify-content: flex-end;
    }
  `}
`;

export const StyledResponsiveFooterWrapper = styled.div`

`;

const StyledForm = styled.form`
  && ${StyledButton} {
    align-items: center;
    display: flex;
    margin-left: 16px;
    ${({ theme }) => isClassic(theme) && css`margin-left: 15px;`}
  }

  ${({ theme }) => !isClassic(theme) && css`
    && ${StyledFormField} {
      margin-bottom: 32px;
    }
  `}

  ${({ fixedBottom }) => fixedBottom && css`
    padding-bottom: 80px;
  `}

  ${({ stickyFooter, theme }) => stickyFooter && css`
    padding-bottom: 80px;
    ${StyledFormFooter} {
      animation: ${FormButtonAnimation} 0.25s ease-out;  
      background-color: ${theme.colors.white};
      bottom: 0;
      box-shadow: 0 -4px 12px 0 rgba(0, 0, 0, 0.05);
      box-sizing: content-box;
      left: 0;
      padding-bottom: 13px;
      padding-top: 15px;
      position: fixed;
      width: 100%;
      z-index: 1000;
      
      .carbon-app-wrapper {
        align-items: center;
        display: flex;
        margin-top: 0;
        border-left-style: solid;
        border-left-color: ${theme.colors.white};
        border-right-style: solid;
        border-right-color: ${theme.colors.white};
        border-width: 0;
        box-sizing: border-box;
        min-width: 450px;
      }
    }
  `}
  
  ${({ stickyFooter }) => !stickyFooter && css`
    ${StyledFormFooter} {
      .carbon-app-wrapper {
        max-width: inherit;
        min-width: inherit;
        padding: 0;
        align-items: center;
        display: flex;
        margin-top: 20px;
      }
    }
  `}  
`;

StyledForm.defaultProps = {
  theme: baseTheme
};

StyledForm.propTypes = {
  theme: PropTypes.object,
  stickyFooter: PropTypes.bool,
  fixedBottom: PropTypes.bool
};

StyledFormFooter.defaultProps = {
  theme: baseTheme
};

StyledFormFooter.propTypes = {
  theme: PropTypes.object,
  buttonAlign: PropTypes.oneOf(OptionsHelper.alignBinary),
  stickyFooter: PropTypes.bool
};

StyledAdditionalFormAction.defaultProps = {
  theme: baseTheme
};

StyledAdditionalFormAction.propTypes = {
  theme: PropTypes.object,
  type: PropTypes.oneOf(OptionsHelper.additionalActionAlignments)
};

export default StyledForm;
