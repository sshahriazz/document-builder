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
        aria-label={text}
        title={text}
        isDisabled={disabled}
        size="sm"
        variant={active ? 'flat' : 'light'}
        color={active ? 'primary' : 'default'}
        isIconOnly
        radius="sm"
        className={className}
        onPress={onClick}
      >
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />
      </Button>
    </Tooltip>
  )
}

export default MenuButton