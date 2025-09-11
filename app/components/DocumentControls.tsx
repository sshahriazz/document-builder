"use client";
import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import { useHeaderStyle, themeNames } from "@/app/store/themeStyle";
import RenderTheme from "@/components/RenderTheme";

export default function DocumentControls() {
  const { data, set, applyTheme } = useHeaderStyle();

  return (
    <div className="w-[400px] bg-white border border-neutral-100 px-8">
      <h1 className="py-6 text-lg font-semibold">Header Style</h1>
      {/* Theme */}
      <div className="flex items-center justify-between w-full gap-3 py-3">
        <span className="text-sm">Theme</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat">{data.themeName || "Select Theme"}</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Theme selection"
            onAction={(key) => applyTheme(String(key))}
          >
            {themeNames.map((name) => (
              <DropdownItem key={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      {/* Title Color */}
      <div className="flex items-center justify-between w-full gap-3 py-2">
        <span className="flex-1 text-sm">Title Color</span>
        <Input
          className="w-14 h-9 p-0"
          type="color"
          value={data.titleColor}
          onChange={(e) => set("titleColor", e.target.value)}
        />
      </div>
      {/* Text Color */}
      <div className="flex items-center justify-between w-full gap-3 py-2">
        <span className="flex-1 text-sm">Text Color</span>
        <Input
          className="w-14 h-9 p-0"
          type="color"
          value={data.textColor}
          onChange={(e) => set("textColor", e.target.value)}
        />
      </div>
      {/* Background Color */}
      <div className="flex items-center justify-between w-full gap-3 py-2">
        <span className="flex-1 text-sm">Background Color</span>
        <Input
          className="w-14 h-9 p-0"
          type="color"
          value={data.backgroundColor}
          onChange={(e) => set("backgroundColor", e.target.value)}
        />
      </div>
      {/* Bottom Border Color */}
      <div className="flex items-center justify-between w-full gap-3 py-2">
        <span className="flex-1 text-sm">Bottom Border Color</span>
        <Input
          className="w-14 h-9 p-0"
          type="color"
          value={data.bottomBorderColor}
          onChange={(e) => set("bottomBorderColor", e.target.value)}
        />
      </div>
      {/* Bottom Border Width */}
      <div className="flex items-center justify-between w-full gap-3 py-2">
        <span className="flex-1 text-sm">Bottom Border Width</span>
        <Input
          className="w-24"
          type="number"
          min={0}
          value={String(data.bottomBorderWidth)}
          onChange={(e) => set("bottomBorderWidth", Number(e.target.value))}
        />
      </div>
    </div>
  );
}
