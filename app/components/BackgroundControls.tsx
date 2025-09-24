"use client";
import React from "react";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignCircleFreeIcons, Edit02Icon, ImageUploadIcon } from "@hugeicons/core-free-icons";
import { useHeaderStyle } from "@/app/store/themeStyle";
import { useUI } from "@/app/store/ui";

export function BackgroundControls() {
  const { data, clearBackground, setBackgroundImage } = useHeaderStyle();
  const { isEditing } = useUI();

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setBackgroundImage(url);
      }
    };
    input.click();
  };

  const handleFileChange = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setBackgroundImage(url);
      }
    };
    input.click();
  };

  const handleFileRemove = () => {
    clearBackground();
  };

  if (!isEditing) return null;

  return (
    <div
      id="bg-controls"
      className="absolute top-4 right-4 z-10 flex items-center gap-2"
    >
      {data.backgroundImage === null && (
        <Button 
          size="sm" 
          isIconOnly 
          variant="flat"
          className="bg-white/90 hover:bg-white shadow-sm border border-gray-200/50 text-gray-700 hover:text-gray-900 transition-all"
          onPress={handleFileUpload}
          aria-label="Add background image"
        >
          <HugeiconsIcon
            icon={ImageUploadIcon}
            size={18}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      )}
      {data.backgroundImage !== null && (
        <Button 
          size="sm" 
          isIconOnly 
          variant="flat"
          className="bg-white/90 hover:bg-white shadow-sm border border-gray-200/50 text-blue-600 hover:text-blue-700 transition-all"
          onPress={handleFileChange}
          aria-label="Change background image"
        >
          <HugeiconsIcon
            icon={Edit02Icon}
            size={18}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      )}
      {data.backgroundImage !== null && (
        <Button 
          size="sm" 
          isIconOnly 
          variant="flat"
          className="bg-white/90 hover:bg-white shadow-sm border border-gray-200/50 text-red-600 hover:text-red-700 transition-all"
          onPress={handleFileRemove}
          aria-label="Remove background image"
        >
          <HugeiconsIcon
            icon={MultiplicationSignCircleFreeIcons}
            size={18}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      )}
    </div>
  );
}