"use client";
import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  DatePicker,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useHeaderStyle, themeNames } from "@/app/store/themeStyle";
import Overview from "@/app/components/Overview";
import { useDocumentConfig } from "@/app/store/document/documentConfig";
import type { FeeStructure } from "@/app/store/document/documentBlocks";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { migrateFeeStructure } from "@/app/lib/feeStructure";
import { CURRENCY_CODES } from "@/app/types/currency";

export default function DocumentControls() {
  const { data, set, applyTheme } = useHeaderStyle();
  const cfg = useDocumentConfig();

  return (
    <div className="w-[400px] bg-white border border-neutral-100 px-8 overflow-y-auto max-h-screen">
      <Overview />
      {/* Proposal Settings */}
      <h1 className="py-2 text-lg font-semibold">Proposal Settings</h1>
      <div className="space-y-3 py-2">
        {/* Expiration Date */}
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm">Expiration Date</span>
          <DatePicker
            aria-label="Expiration Date"
            value={cfg.expirationDate ? parseDate(cfg.expirationDate) : null}
            onChange={(date)=> {
              if (!date) return cfg.setExpirationDate(undefined);
              cfg.setExpirationDate(date.toString());
            }}
            variant="flat"
          />
        </div>
        {/* Document Currency */}
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm">Currency</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">{cfg.currency}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Currency" onAction={(key)=> cfg.setCurrency(String(key) as any)}>
              {CURRENCY_CODES.map(code => (
                <DropdownItem key={code}>{code}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* Default Fee Structure */}
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm">Default Fee Structure</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">{cfg.defaultStructure.replace('-', ' ')}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Default fee structure" onAction={(key)=> {
              const to = String(key) as FeeStructure;
              cfg.setDefaultStructure(to);
              // Migrate all existing fee-summary blocks to keep UI in sync
              const store = useDocumentBlocksStore.getState();
              const { order, byId, updateContent } = store;
              order.forEach((uuid) => {
                const ent = byId[uuid];
                if (ent?.type === 'fee-summary') {
                  updateContent(uuid, (prev: any) => migrateFeeStructure(prev as any, to) as any);
                }
              });
            }}>
              <DropdownItem key="single">Single Option</DropdownItem>
              <DropdownItem key="packages">Packages</DropdownItem>
              <DropdownItem key="multi-select">Multi-Select</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* Upfront Requirement */}
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm">Require Upfront</span>
          <Button variant={cfg.requireUpfront ? 'solid' : 'flat'} onPress={()=> cfg.setRequireUpfront(!cfg.requireUpfront)}>
            {cfg.requireUpfront ? 'On' : 'Off'}
          </Button>
        </div>
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm">Upfront Percent</span>
          <Input className="w-24" type="number" min={0} max={100} value={String(cfg.upfrontPercent)} onChange={(e)=> cfg.setUpfrontPercent(Number(e.target.value)||0)} />
        </div>
      </div>
      <h1 className="py-2 text-lg font-semibold">Header Style</h1>
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
