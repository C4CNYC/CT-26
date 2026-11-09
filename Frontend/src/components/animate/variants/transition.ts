import { type Easing, type Transition } from 'framer-motion'

// @types
import { TranEnterType, TranExitType, TranHoverType } from '../types'

const DEFAULT_EASE: Easing = [0.43, 0.13, 0.23, 0.96]

export const varTranHover = (props?: TranHoverType): Transition => {
  const duration = props?.duration ?? 0.32
  const ease = props?.ease ?? DEFAULT_EASE

  return { duration, ease }
}

export const varTranEnter = (props?: TranEnterType): Transition => {
  const duration = props?.durationIn ?? 0.64
  const ease = props?.easeIn ?? DEFAULT_EASE

  return { duration, ease }
}

export const varTranExit = (props?: TranExitType): Transition => {
  const duration = props?.durationOut ?? 0.48
  const ease = props?.easeOut ?? DEFAULT_EASE

  return { duration, ease }
}
