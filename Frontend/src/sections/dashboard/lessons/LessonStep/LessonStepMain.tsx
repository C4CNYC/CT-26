import { useEffect, useState } from 'react'

import { Dialog } from '@mui/material'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { ResizableSideBySidePanes } from '@/components'
import LessonCreationIntro from '@root/src/sections/intro-tours/lesson-creation-intro'

import { lessonViewAtom } from './lesson-atoms/lesson-view-atom'
import LessonTopBar from './lesson-top-bar/LessonTopBar'
import { LessonContentContext } from './LessonStepContent/LessonContent.context'
import StepContentEditor from './LessonStepContent/StepContentEditor'
import LessonStepList from './LessonStepList'
import { NoSelectedStep } from './NoSelectedStep'

export default function LessonStepMain({
  closeThis,
}: {
  closeThis?: () => void
}): React.ReactElement {
  const router = useRouter()
  const { stepId, lessonId } = router.query
  const [, setLessonView] = useAtom(lessonViewAtom)
  const handle = useFullScreenHandle()
  const [locked, setLocked] = useState(false)
  const onClose = () => {
    closeThis
      ? closeThis()
      : router.push(`${router.pathname}?lessonId=`, undefined, { shallow: true })
  }
  useEffect(() => {
    setLessonView((prev) => ({
      ...prev,
      isFullScreenView: handle.active,
      unitId: router.query.unit_id as string,
    }))
  }, [handle.active])
  useEffect(() => {
    setLessonView((prev) => ({
      ...prev,
      fullScreenOpen: handle.enter,
      fullScreenClose: handle.exit,
    }))
  }, [])
  if (!Boolean(lessonId)) return <> </>
  return (
    <LessonContentContext.Provider
      value={{
        locked,
        lockedHandler: setLocked,
      }}
    >
      <style>
        {`
        .fullscreen-enabled {
          background: #fff;
        }
      `}
      </style>

      <Dialog
        open={Boolean(lessonId)}
        onClose={onClose}
        fullScreen
      >
        <FullScreen handle={handle}>
          <LessonTopBar closeThis={onClose} />

          {stepId && <LessonCreationIntro delay={1000} />}
          <ResizableSideBySidePanes
            leftPaneDefaultWidth='400px'
            leftPaneMinWidth={300}
            leftPaneMaxWidth={750}
            style={{ height: 'calc(100% - 48px)' }}
          >
            <LessonStepList lessonId={lessonId as string} />
            {stepId ? <StepContentEditor /> : <NoSelectedStep />}
          </ResizableSideBySidePanes>
        </FullScreen>
      </Dialog>
    </LessonContentContext.Provider>
  )
}
