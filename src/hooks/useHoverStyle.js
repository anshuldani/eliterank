import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing hover states and styles
 * Eliminates repetitive onMouseEnter/onMouseLeave inline handlers
 *
 * @param {Object} defaultStyle - Style when not hovered
 * @param {Object} hoverStyle - Style overrides when hovered
 * @returns {Object} Props to spread on element and current hover state
 */
export default function useHoverStyle(defaultStyle, hoverStyle) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const currentStyle = useMemo(() => {
    return isHovered ? { ...defaultStyle, ...hoverStyle } : defaultStyle;
  }, [isHovered, defaultStyle, hoverStyle]);

  const hoverProps = useMemo(() => ({
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: currentStyle,
  }), [handleMouseEnter, handleMouseLeave, currentStyle]);

  return {
    isHovered,
    hoverProps,
    currentStyle,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}

/**
 * Creates hover event handlers for imperative style changes
 * Use when you need to modify style properties directly
 *
 * @param {Object} hoverStyles - Styles to apply on hover
 * @param {Object} defaultStyles - Styles to restore on leave
 * @returns {Object} Event handlers object
 */
export function createHoverHandlers(hoverStyles, defaultStyles) {
  return {
    onMouseEnter: (e) => {
      Object.entries(hoverStyles).forEach(([key, value]) => {
        e.currentTarget.style[key] = value;
      });
    },
    onMouseLeave: (e) => {
      Object.entries(defaultStyles).forEach(([key, value]) => {
        e.currentTarget.style[key] = value;
      });
    },
  };
}
