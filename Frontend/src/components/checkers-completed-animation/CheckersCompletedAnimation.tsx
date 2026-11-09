import { type FC, useEffect, useRef, useState } from 'react'

import { DotLottieReact, type DotLottieReactProps } from '@lottiefiles/dotlottie-react'
import { Box } from '@mui/material'

type DotLottieInstance = Parameters<NonNullable<DotLottieReactProps['dotLottieRefCallback']>>[0]

interface CheckersCompletedAnimationProps {
  animationNumber: number
  onAnimationComplete: () => void
}

export const CheckersCompletedAnimation: FC<CheckersCompletedAnimationProps> = ({
  animationNumber,
  onAnimationComplete,
}) => {
  const [dotLottie, dotLottieSet] = useState<DotLottieInstance>(null)
  const onAnimationCompleteRef = useRef(onAnimationComplete)
  onAnimationCompleteRef.current = onAnimationComplete

  useEffect(() => {
    if (!dotLottie) return
    const handleComplete = () => onAnimationCompleteRef.current()
    dotLottie.addEventListener('complete', handleComplete)
    return () => dotLottie.removeEventListener('complete', handleComplete)
  }, [dotLottie])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 'calc(50% + 200px)',
        height: '300px',
        left: '0',
        width: '100%',
        zIndex: 1000,
      }}
    >
      <DotLottieReact
        src={`/assets/code-panel/lotti-animation/anim_${animationNumber}.lottie`}
        autoplay
        dotLottieRefCallback={dotLottieSet}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}
