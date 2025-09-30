"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageComponent } from "./ResizableImageComponent";

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
        float?: "none" | "left" | "right";
      }) => ReturnType;
      /**
       * Update image attributes
       */
      updateImage: (attrs: Record<string, unknown>) => ReturnType;
    };
  }
}

export const ImageExtension = Node.create<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return false;
  },

  group() {
    return "block";
  },

  draggable: true,
  
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width ? parseInt(width, 10) : null;
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute("height");
          return height ? parseInt(height, 10) : null;
        },
      },
      align: {
        default: "left",
        parseHTML: (element) => {
          return element.getAttribute("data-align") || "left";
        },
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.align,
          };
        },
      },
      float: {
        default: "none",
        parseHTML: (element) => {
          return element.getAttribute("data-float") || "none";
        },
        renderHTML: (attributes) => {
          return {
            "data-float": attributes.float,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateImage:
        (attrs: Record<string, unknown>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});