import { Button, Tooltip } from '@heroui/react'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import React from 'react'

interface MenuButtonProps {
  icon: IconSvgElement
  text: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  className?: string
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, text, onClick, active, disabled, className }) => {
  return (
    <Tooltip content={text} placement="top">
      <Button
        isDisabled={disabled}
        size="sm"
        variant="light"
        isIconOnly
        radius="sm"
        className={`${active ? 'bg-blue-500 text-white' : ''} ${className ?? ''}`}
        onPress={onClick}
      >
        <HugeiconsIcon
        icon={icon}
        size={16}
        strokeWidth={1.5}
        />
      </Button>
    </Tooltip>
  )
}

export default MenuButton