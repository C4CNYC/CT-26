import { useEffect, useState } from 'react'

import { ACTIONS, type EventData, EVENTS, Joyride, STATUS } from 'react-joyride'
import { useDispatch } from 'react-redux'

import { useProfileQuery } from '@/redux/services/auth'
import { setStartTour } from '@/redux/slices/tour'
import { useSelector } from '@/redux/store'
import { useUpdateMeMetaFlagMutation } from '@root/src/redux/services/auth'
import { useTranslate } from '@root/src/utils/translateHelper'

import { TOUR_JOYRIDE_OPTIONS } from '../tour-joyride-options'
import TooltipTourCodePanel from '../tour-tooltip'

import { getIntroMainSteps } from './config'

const STATUSES: string[] = [STATUS.FINISHED, STATUS.PAUSED, STATUS.SKIPPED]
const KEY_INTRO_TOUR = 'HAS_SEEN_MAIN_TOUR'

export const MainPageTour = () => {
  const translate = useTranslate()
  const dispatch = useDispatch()

  const [slideIndex, setSlideIndex] = useState(0)

  const isReadyToStart = useSelector((state) => state.tour.readyToStartMainTour)
  const isTourStarted = useSelector((state) => state.tour.isStarted)
  const profile = useSelector((state) => state.global.user)
  const { data: userData, isLoading } = useProfileQuery(null as unknown as void, { skip: !profile })
  const [updateMeMetaFlag] = useUpdateMeMetaFlagMutation()

  const handleJoyrideCallback = (data: EventData) => {
    const { action, index, status, type } = data
    if (STATUSES.includes(status as string) && isTourStarted) {
      dispatch(setStartTour(false))
      setSlideIndex(0)
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setSlideIndex(Number(index) + Number(action === ACTIONS.PREV ? -1 : 1))
    }
  }

  useEffect(() => {
    if (isLoading) return

    const hasSeenTour = userData?.meta ? userData.meta[KEY_INTRO_TOUR] : false

    if (hasSeenTour || !isReadyToStart) {
      return
    }

    const timeout = setTimeout(() => {
      dispatch(setStartTour(true))
      updateMeMetaFlag({ key: KEY_INTRO_TOUR, value: true })
        .unwrap()
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to update meta flag:', error)
        })
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [isTourStarted, isReadyToStart, dispatch, isLoading])

  return (
    <Joyride
      onEvent={handleJoyrideCallback}
      run={isTourStarted}
      tooltipComponent={TooltipTourCodePanel}
      steps={getIntroMainSteps(translate)}
      stepIndex={slideIndex}
      options={TOUR_JOYRIDE_OPTIONS}
    />
  )
}

export default MainPageTour
