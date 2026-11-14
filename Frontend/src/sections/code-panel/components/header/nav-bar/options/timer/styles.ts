import { type SxProps, type Theme } from '@mui/material'

export const TIMER_INPUT_NUMBER_SX: SxProps<Theme> = {
  width: '112px',
  height: '112px',
  border: '1px solid #000000',
  borderRadius: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& input': {
    fontSize: '70px',
    lineHeight: '75px',
    padding: 0,
    width: '75px',
    height: '75px',
    borderBottom: '1px solid #000000',
    textAlign: 'center',
    caretColor: '#C4C4C4',
    color: '#364954',
  },
}

export const TIMER_TEXT_HINT_SX: SxProps<Theme> = {
  fontSize: '26px',
  lineHeight: '26px',
  color: '#364954',
  marginTop: '10px',
}

export const TIMER_CLOSE_BUTTON_SX: SxProps<Theme> = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  width: '32px',
  height: '32px',
  color: '#808080',
  '& svg': {
    stroke: '#808080',
    strokeWidth: '2',
    fontSize: '24px',
  },
  '&:hover': {
    background: '#ffffff',
  },
}

export const TIMER_FINISH_TEXT_SX: SxProps<Theme> = {
  fontWeight: 'bold',
  fontSize: '20px',
  lineHeight: '30px',
  color: '#364954',
}
