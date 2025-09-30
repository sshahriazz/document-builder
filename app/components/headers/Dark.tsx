"use client";
import React from "react";
import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import { useHeaderStyle, themeNames } from "@/app/store/themeStyle";
import { Title } from "@/components/header-blocks/Title";
import { From } from "@/components/header-blocks/From";
import { To } from "@/components/header-blocks/To";
import { Dates } from "@/components/header-blocks/Dates";
import { BackgroundControls } from "@/components/BackgroundControls";

export default function Dark() {
  const { data } = useHeaderStyle();

  return (
    <div
      style={{ backgroundImage: `url(${data.backgroundImage})` }}
      className="w-full h-[898px] relative bg-no-repeat bg-center bg-cover"
    >
      <BackgroundControls />
      {/* Example title/text preview area */}
      <Card
        style={{
          backgroundColor: data.backgroundColor,
          color: data.textColor,
        }}
        className="w-[70%] mx-auto mt-20 shadow-none"
      >
        <CardBody className="p-8 sm:p-12">
          <div className="title text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-3">
            <Title />
          </div>
          <div className="mb-10">
            <Dates />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-60">
                From
              </div>
              <div className="text-base font-medium leading-relaxed">
                <From />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-60">
                To
              </div>
              <div className="text-base font-medium leading-relaxed">
                <To />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
