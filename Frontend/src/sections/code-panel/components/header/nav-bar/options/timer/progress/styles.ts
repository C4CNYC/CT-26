import { type SxProps, type Theme } from '@mui/material'
import { keyframes } from '@mui/system'

const TIMER_CIRCLE_LENGTH = '126.92px'

const timerCircleCountdown = keyframes`
  0% {
    stroke-dashoffset: 0px;
  }
  100% {
    stroke-dashoffset: ${TIMER_CIRCLE_LENGTH};
  }
`

export const TIMER_CIRCLE_TRACK_SX: SxProps<Theme> = {
  stroke: '#eaeaea',
  strokeDasharray: TIMER_CIRCLE_LENGTH,
  strokeDashoffset: '0px',
}

export const getTimerProgressBoxSx = (width: number, height: number): SxProps<Theme> => ({
  width: `${width}px`,
  height: `${height}px`,
  transform: 'rotate(-90deg) scale(1, -1)',
})

export const getTimerCircleCountdownSx = (
  minutes: number,
  delay: number,
  pause: boolean
): SxProps<Theme> => ({
  strokeDasharray: TIMER_CIRCLE_LENGTH,
  strokeDashoffset: TIMER_CIRCLE_LENGTH,
  stroke: '#0198ED',
  animation: `${timerCircleCountdown} ${minutes * 60}s linear ${delay}ms`,
  animationPlayState: pause ? 'paused' : 'running',
})

export const getTimerMinutesNumberSx = (fontSize: number): SxProps<Theme> => ({
  fontSize: `${fontSize}px`,
  lineHeight: '70px',
  color: '#364954',
})
