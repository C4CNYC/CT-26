import { type FabProps, type SxProps } from '@mui/material'

export const SPEED_DIAL_SX = {
  position: 'absolute',
  zIndex: 1200,
  left: 0,
  width: 40,
  '& .MuiSpeedDial-actions': {
    gap: 0,
  },
}

export const BOX_SX = {
  position: 'relative',
}

export const getActionFabPropsSx = (): Partial<FabProps> => ({
  size: 'small',
  sx: {
    width: 36,
    height: 36,
    boxShadow: 'none',
    background: '#155275',
    display: 'flex',
    mb: '0px',
    '&:hover': {
      background: '#155275',
    },
  },
})

export const getChipSx = (color: string): SxProps => ({
  position: 'absolute',
  left: '-80px',
  top: 'calc(50% - 10px)',
  zIndex: 1000,
  background: color,
  height: '20px',
  width: '68px',
  '& .MuiChip-label': {
    whiteSpace: 'nowrap',
  },
})

export const getSpeedDialFabProps = (
  isSpeedDial: boolean,
  isDarkMode: boolean
): Partial<FabProps> => ({
  size: 'small',
  sx: {
    width: 36,
    height: 36,
    background: isSpeedDial ? '#155275' : isDarkMode ? 'none' : 'white',
    boxShadow: 'none',
    '&:hover': {
      background: '#155275',
    },
  },
})

export const FOOTER_ACTION_TOOLTIP_CLASS = 'code-panel-footer-action-tooltip'

export const FOOTER_ACTION_TOOLTIP_GLOBAL_STYLES = {
  [`.MuiTooltip-tooltip.${FOOTER_ACTION_TOOLTIP_CLASS}`]: {
    color: '#364954',
    background: '#fff',
  },
}
