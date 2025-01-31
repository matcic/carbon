import React from "react";
import PropTypes from "prop-types";

export const TooltipContext = React.createContext({});

export const TooltipProvider = ({ children, tooltipPosition }) => (
  <TooltipContext.Provider value={{ tooltipPosition }}>
    {children}
  </TooltipContext.Provider>
);

TooltipProvider.propTypes = {
  children: PropTypes.node.isRequired,
  tooltipPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};
