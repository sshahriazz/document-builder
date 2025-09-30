"use client";
import React from "react";
import { Skeleton, cn } from "@heroui/react";
import type { BlockType } from "@/app/store/document/documentBlocks";
import { blockTypeLabels } from "@/app/store/document/blockFactory";

interface BlockGridSelectorProps {
  onSelectBlock: (type: BlockType) => void;
}

interface BlockSkeletonPreviewProps {
  type: BlockType;
  onClick: () => void;
}

const BlockSkeletonPreview: React.FC<BlockSkeletonPreviewProps> = ({ type, onClick }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "rich-text":
        return (
          <div className="space-y-2 p-4">
            <Skeleton disableAnimation className="h-3 w-3/5 rounded-lg bg-blue-200/60" />
            <Skeleton disableAnimation className="h-3 w-4/5 rounded-lg bg-blue-100/60" />
            <Skeleton disableAnimation className="h-3 w-2/5 rounded-lg bg-blue-100/60" />
          </div>
        );
      
      case "text-area":
        return (
          <div className="space-y-2 p-4">
            <Skeleton disableAnimation className="h-3 w-2/5 rounded-lg bg-purple-200/60" />
            <Skeleton disableAnimation className="h-16 w-full rounded-lg bg-purple-100/50" />
          </div>
        );
      
      case "scope-of-services":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-3/5 rounded-lg bg-emerald-200/60" />
            <div className="space-y-2">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-emerald-100/50" />
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-emerald-100/50" />
              <Skeleton disableAnimation className="h-2 w-4/5 rounded-lg bg-emerald-100/50" />
            </div>
            <div className="space-y-2 mt-3">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-emerald-100/50" />
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-emerald-100/50" />
              <Skeleton disableAnimation className="h-2 w-3/5 rounded-lg bg-emerald-100/50" />
            </div>
          </div>
        );
      
      case "your-section":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-2/5 rounded-lg bg-indigo-200/60" />
            <div className="space-y-2">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-indigo-100/50" />
              <Skeleton disableAnimation className="h-2 w-4/5 rounded-lg bg-indigo-100/50" />
            </div>
            <Skeleton disableAnimation className="h-3 w-1/3 rounded-lg mt-3 bg-indigo-200/60" />
            <div className="space-y-2">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-indigo-100/50" />
              <Skeleton disableAnimation className="h-2 w-3/5 rounded-lg bg-indigo-100/50" />
            </div>
          </div>
        );
      
      case "files-and-attachments":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-2/5 rounded-lg bg-amber-200/60" />
            <div className="flex gap-2">
              <Skeleton disableAnimation className="h-12 w-12 rounded-lg bg-amber-100/60" />
              <Skeleton disableAnimation className="h-12 w-12 rounded-lg bg-amber-100/60" />
              <Skeleton disableAnimation className="h-12 w-12 rounded-lg bg-amber-100/60" />
            </div>
          </div>
        );
      
      case "terms-and-conditions":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-3/5 rounded-lg bg-rose-200/60" />
            <div className="space-y-2">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-rose-100/50" />
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-rose-100/50" />
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-rose-100/50" />
              <Skeleton disableAnimation className="h-2 w-4/5 rounded-lg bg-rose-100/50" />
            </div>
            <div className="space-y-2 mt-3">
              <Skeleton disableAnimation className="h-2 w-full rounded-lg bg-rose-100/50" />
              <Skeleton disableAnimation className="h-2 w-3/5 rounded-lg bg-rose-100/50" />
            </div>
          </div>
        );
      
      case "deliverables":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-2/5 rounded-lg bg-teal-200/60" />
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Skeleton disableAnimation className="h-2 w-2 rounded-full bg-teal-300/70" />
                <Skeleton disableAnimation className="h-2 w-4/5 rounded-lg bg-teal-100/50" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton disableAnimation className="h-2 w-2 rounded-full bg-teal-300/70" />
                <Skeleton disableAnimation className="h-2 w-3/5 rounded-lg bg-teal-100/50" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton disableAnimation className="h-2 w-2 rounded-full bg-teal-300/70" />
                <Skeleton disableAnimation className="h-2 w-4/5 rounded-lg bg-teal-100/50" />
              </div>
            </div>
          </div>
        );
      
      case "fee-summary":
        return (
          <div className="space-y-3 p-4">
            <Skeleton disableAnimation className="h-4 w-2/5 rounded-lg bg-green-200/60" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton disableAnimation className="h-3 w-2/5 rounded-lg bg-green-100/50" />
                <Skeleton disableAnimation className="h-3 w-1/5 rounded-lg bg-green-200/60" />
              </div>
              <div className="flex justify-between">
                <Skeleton disableAnimation className="h-3 w-1/3 rounded-lg bg-green-100/50" />
                <Skeleton disableAnimation className="h-3 w-1/5 rounded-lg bg-green-200/60" />
              </div>
            </div>
            <div className="border-t border-green-200 pt-2 mt-2">
              <div className="flex justify-between">
                <Skeleton disableAnimation className="h-3 w-1/4 rounded-lg bg-green-200/70" />
                <Skeleton disableAnimation className="h-3 w-1/5 rounded-lg bg-green-300/70" />
              </div>
            </div>
          </div>
        );
      
      case "image-text":
        return (
          <div className="space-y-3 p-4">
            <div className="flex gap-3">
              <Skeleton disableAnimation className="h-20 w-20 rounded-lg flex-shrink-0 bg-cyan-200/60" />
              <div className="space-y-2 flex-1">
                <Skeleton disableAnimation className="h-3 w-full rounded-lg bg-cyan-100/50" />
                <Skeleton disableAnimation className="h-3 w-full rounded-lg bg-cyan-100/50" />
                <Skeleton disableAnimation className="h-3 w-3/5 rounded-lg bg-cyan-100/50" />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-2 p-4">
            <Skeleton disableAnimation className="h-3 w-3/5 rounded-lg bg-neutral-200/60" />
            <Skeleton disableAnimation className="h-3 w-4/5 rounded-lg bg-neutral-100/60" />
          </div>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full h-full min-h-[140px] rounded-xl border-2 border-neutral-200",
        "bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-200",
        "overflow-hidden group cursor-pointer"
      )}
    >
      {/* Skeleton preview */}
      <div className="opacity-60 group-hover:opacity-40 transition-opacity">
        {renderSkeleton()}
      </div>
      
      {/* Label overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-3 px-3">
        <p className="text-sm font-medium text-neutral-700 text-center">
          {blockTypeLabels[type]}
        </p>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 transition-colors pointer-events-none" />
    </button>
  );
};

export const BlockGridSelector: React.FC<BlockGridSelectorProps> = ({ onSelectBlock }) => {
  const blockTypes = Object.keys(blockTypeLabels) as BlockType[];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
      {blockTypes.map((type) => (
        <BlockSkeletonPreview
          key={type}
          type={type}
          onClick={() => onSelectBlock(type)}
        />
      ))}
    </div>
  );
};
