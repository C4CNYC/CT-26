import { type FC } from 'react'

import { CheckersCompletedAnimation } from '@/components/checkers-completed-animation/CheckersCompletedAnimation'

import { useLessonManager } from './LessonManagerContext'

export const CheckersCompleated: FC = () => {
  const { checkersAnimation, checkersAnimationNumber, checkersAnimationNumberSet } =
    useLessonManager()

  return (
    <CheckersCompletedAnimation
      animationNumber={checkersAnimationNumber}
      onAnimationComplete={() => {
        checkersAnimation.onFalse()
        checkersAnimationNumberSet((checkersAnimationNumber % 6) + 1)
      }}
    />
  )
}
