"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React, { useState, useRef, useEffect } from "react";

interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
  float?: "none" | "left" | "right";
}

export const ResizableImageComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const { src, alt, title, width, height, align = "left", float = "none" } = node.attrs as ImageAttrs;
  
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<number>(width || 0);
  const [currentHeight, setCurrentHeight] = useState<number>(height || 0);
  const [aspectRatio, setAspectRatio] = useState(1);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeHandleRef = useRef<"se" | "sw" | null>(null);

  // Sync state with props
  useEffect(() => {
    if (width && height) {
      setCurrentWidth(width);
      setCurrentHeight(height);
      setAspectRatio(width / height);
    }
  }, [width, height]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalAspectRatio = img.naturalWidth / img.naturalHeight;
    setAspectRatio(naturalAspectRatio);
    
    // Only set default size if not already set
    if (!width || !height) {
      const defaultWidth = Math.min(img.naturalWidth, 600);
      const defaultHeight = defaultWidth / naturalAspectRatio;
      setCurrentWidth(defaultWidth);
      setCurrentHeight(defaultHeight);
      updateAttributes({ width: defaultWidth, height: defaultHeight });
    } else {
      setCurrentWidth(width);
      setCurrentHeight(height);
    }
  };

  // Store the latest aspect ratio in a ref
  const aspectRatioRef = useRef(aspectRatio);
  aspectRatioRef.current = aspectRatio;

  // Create stable event handlers using refs
  const handleResizeMoveRef = useRef<(e: MouseEvent) => void>(null as any);
  const handleResizeEndRef = useRef<() => void>(null as any);

  // Define the move handler
  if (!handleResizeMoveRef.current) {
    handleResizeMoveRef.current = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const handle = resizeHandleRef.current;
      
      let newWidth: number;
      
      if (handle === "se") {
        // Southeast handle - resize right
        newWidth = Math.max(100, resizeStartRef.current.width + deltaX);
      } else {
        // Southwest handle - resize left
        newWidth = Math.max(100, resizeStartRef.current.width - deltaX);
      }
      
      const newHeight = newWidth / aspectRatioRef.current;
      
      setCurrentWidth(newWidth);
      setCurrentHeight(newHeight);
    };
  }

  // Store refs for latest width/height
  const currentWidthRef = useRef(currentWidth);
  const currentHeightRef = useRef(currentHeight);
  currentWidthRef.current = currentWidth;
  currentHeightRef.current = currentHeight;

  // Define the end handler
  if (!handleResizeEndRef.current) {
    handleResizeEndRef.current = () => {
      setIsResizing(false);
      resizeHandleRef.current = null;
      
      // Use refs to get latest values and update attributes
      const finalWidth = Math.round(currentWidthRef.current);
      const finalHeight = Math.round(currentHeightRef.current);
      
      // Update attributes after state is settled
      setTimeout(() => {
        updateAttributes({
          width: finalWidth,
          height: finalHeight,
        });
      }, 0);

      if (handleResizeMoveRef.current) {
        document.removeEventListener("mousemove", handleResizeMoveRef.current);
      }
      if (handleResizeEndRef.current) {
        document.removeEventListener("mouseup", handleResizeEndRef.current);
      }
    };
  }

  const handleResizeStart = (
    e: React.MouseEvent,
    handle: "se" | "sw"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    resizeHandleRef.current = handle;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      height: currentHeight,
    };

    if (handleResizeMoveRef.current) {
      document.addEventListener("mousemove", handleResizeMoveRef.current);
    }
    if (handleResizeEndRef.current) {
      document.addEventListener("mouseup", handleResizeEndRef.current);
    }
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (handleResizeMoveRef.current) {
        document.removeEventListener("mousemove", handleResizeMoveRef.current);
      }
      if (handleResizeEndRef.current) {
        document.removeEventListener("mouseup", handleResizeEndRef.current);
      }
    };
  }, []);

  const handleAlignChange = (newAlign: "left" | "center" | "right") => {
    updateAttributes({ align: newAlign });
  };

  const handleFloatChange = (newFloat: "none" | "left" | "right") => {
    updateAttributes({ float: newFloat });
  };

  const getAlignmentStyles = () => {
    // Float takes precedence over align
    if (float !== "none") {
      return "";
    }
    switch (align) {
      case "center":
        return "mx-auto block";
      case "right":
        return "ml-auto block";
      default:
        return "mr-auto block";
    }
  };

  const getWrapperStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      clear: "none",
      maxWidth: "100%",
      verticalAlign: "top",
      lineHeight: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      padding: 0,
      width: currentWidth ? `${currentWidth}px` : "auto",
    };

    // Float takes precedence
    if (float === "left") {
      return {
        ...baseStyles,
        display: "block",
        float: "left",
        marginRight: "1rem",
        marginBottom: "0.5rem",
      };
    } else if (float === "right") {
      return {
        ...baseStyles,
        display: "block",
        float: "right",
        marginLeft: "1rem",
        marginBottom: "0.5rem",
      };
    }

    // No float - apply alignment (must be block for auto margins to work)
    if (align === "center") {
      return {
        ...baseStyles,
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      };
    } else if (align === "right") {
      return {
        ...baseStyles,
        display: "block",
        marginLeft: "auto",
        marginRight: 0,
      };
    } else if (align === "left") {
      return {
        ...baseStyles,
        display: "block",
        marginLeft: 0,
        marginRight: "auto",
      };
    }

    // Default - inline-block
    return {
      ...baseStyles,
      display: "inline-block",
    };
  };

  const getContainerStyles = (): React.CSSProperties => {
    return {
      width: "100%",
      lineHeight: 0,
    };
  };

  return (
    <NodeViewWrapper
      className="image-wrapper"
      style={getWrapperStyles()}
      data-drag-handle
    >
      <div
        className={`relative group ${
          selected ? "ring-2 ring-blue-500 rounded" : ""
        }`}
        style={getContainerStyles()}
      >
        {/* Image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt || ""}
          title={title || ""}
          onLoad={handleImageLoad}
          className={`${getAlignmentStyles()} ${
            isResizing ? "pointer-events-none" : ""
          }`}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
          draggable={false}
        />

        {/* Resize Handles - Show on hover or when selected */}
        {(selected || isResizing) && (
          <>
            {/* Southeast Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize z-10 hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, "se")}
              style={{
                transform: "translate(50%, 50%)",
              }}
            />
            
            {/* Southwest Handle */}
            <div
              className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize z-10 hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, "sw")}
              style={{
                transform: "translate(-50%, 50%)",
              }}
            />

            {/* Layout Toolbar */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-white shadow-lg rounded-md border border-gray-200 flex gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              {/* Float Controls */}
              <div className="flex gap-1 border-r border-gray-200 pr-2">
                <button
                  onClick={() => handleFloatChange("none")}
                  className={`px-2 py-1 text-xs rounded ${
                    float === "none" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                  title="No Float"
                >
                  ⊟
                </button>
                <button
                  onClick={() => handleFloatChange("left")}
                  className={`px-2 py-1 text-xs rounded ${
                    float === "left" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                  title="Float Left"
                >
                  ⬅️ Float
                </button>
                <button
                  onClick={() => handleFloatChange("right")}
                  className={`px-2 py-1 text-xs rounded ${
                    float === "right" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                  title="Float Right"
                >
                  Float ➡️
                </button>
              </div>
              
              {/* Alignment Controls (only when not floating) */}
              {float === "none" && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAlignChange("left")}
                    className={`px-2 py-1 text-xs rounded ${
                      align === "left" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    title="Align Left"
                  >
                    ⬅️
                  </button>
                  <button
                    onClick={() => handleAlignChange("center")}
                    className={`px-2 py-1 text-xs rounded ${
                      align === "center" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    title="Align Center"
                  >
                    ↔️
                  </button>
                  <button
                    onClick={() => handleAlignChange("right")}
                    className={`px-2 py-1 text-xs rounded ${
                      align === "right" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    title="Align Right"
                  >
                    ➡️
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Dimension Display */}
        {isResizing && (
          <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.round(currentWidth)} × {Math.round(currentHeight)}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
