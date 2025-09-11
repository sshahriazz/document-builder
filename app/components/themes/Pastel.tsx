"use client";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import { useHeaderStyle, themeNames } from "@/app/store/themeStyle";
import { Title } from "@/components/Title";
import { From } from "@/components/From";
import { To } from "@/components/To";
import { Dates } from "@/components/Dates";

export default function Pastel() {
  const { data, clearBackground, setBackgroundImage } = useHeaderStyle();

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

  return (
    <div className="flex-1 w-full">
      <div
        style={{ backgroundImage: `url(${data.backgroundImage})` }}
        className="headerPreview w-[90%] relative mx-auto my-10 bg-no-repeat bg-center bg-[length:100%_auto] border border-neutral-300 min-h-[500px]"
      >
        <div
          id="bg-controls"
          className="absolute top-4 right-4 z-10 flex items-center gap-3 text-sm"
        >
          {data.backgroundImage === null && (
            <Button onPress={handleFileUpload}>Add Bg</Button>
          )}
          {data.backgroundImage !== null && (
            <Button onPress={handleFileChange}>Edit</Button>
          )}
          {data.backgroundImage !== null && (
            <Button onPress={handleFileRemove}>x</Button>
          )}
        </div>
        {/* Example title/text preview area */}
        <Card
          style={{
            backgroundColor: data.backgroundColor,
            color: data.textColor,
          }}
          className="w-[70%] mx-auto mt-20 shadow-none"
        >
          <CardBody>
            <div className="title text-4xl font-semibold tracking-tight sm:text-[44px]">
              <Title />
            </div>
            <Dates />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  From
                </div>
                <div className="text-gray-800">
                  <From />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  To
                </div>
                <div className="text-gray-800">
                  <To />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
