import { type FC } from 'react'

import { useDispatch } from 'react-redux'

import { CheckersCompletedAnimation } from '@/components/checkers-completed-animation/CheckersCompletedAnimation'
import { setIsActivateCompeated } from '@/redux/slices/checkers-animation'
import {
  increaceAnimationNumber,
  resetAnimaitonNumber,
} from '@root/src/redux/slices/code-panel-global'
import { useSelector } from '@root/src/redux/store'

const CheckersCompleated: FC = () => {
  const dispatch = useDispatch()
  const animationNumber = useSelector((state) => state.codePanelGlobal.animationNumber)

  return (
    <CheckersCompletedAnimation
      animationNumber={animationNumber}
      onAnimationComplete={() => {
        dispatch(setIsActivateCompeated(false))
        if (animationNumber < 7) {
          dispatch(increaceAnimationNumber(animationNumber + 1))
        } else {
          dispatch(resetAnimaitonNumber())
        }
      }}
    />
  )
}

export default CheckersCompleated
