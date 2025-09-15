"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import { blockTemplates } from "@/app/store/blockTemplates";

export interface BlockPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export function BlockPickerModal({
  isOpen,
  onClose,
  onSelect,
}: BlockPickerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader>Select a Block</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blockTemplates.map((tpl) => (
              <Card
                key={tpl.id}
                isPressable
                onPress={() => {
                  onSelect(tpl.id);
                  onClose();
                }}
                className="border border-neutral-200 hover:border-neutral-400 transition-colors"
              >
                <CardBody className="text-sm flex flex-col gap-1">
                  <span className="font-medium">{tpl.name}</span>
                  {tpl.description && (
                    <span className="text-neutral-500 text-xs">
                      {tpl.description}
                    </span>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
          <Button variant="light" onPress={onClose} className="mt-4 self-end">
            Cancel
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default BlockPickerModal;
