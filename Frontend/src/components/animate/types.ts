import { type Easing } from 'framer-motion'

export interface VariantsType {
  distance?: number
  durationIn?: number
  durationOut?: number
  easeIn?: Easing
  easeOut?: Easing
}

export interface TranHoverType {
  duration?: number
  ease?: Easing
}

export interface TranEnterType {
  durationIn?: number
  easeIn?: Easing
}

export interface TranExitType {
  durationOut?: number
  easeOut?: Easing
}

export interface BackgroundType {
  colors?: string[]
  duration?: number
  ease?: Easing
}
