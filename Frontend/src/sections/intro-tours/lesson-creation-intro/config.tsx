import { Step } from 'react-joyride'

export const getLessonCreationSteps = (translate: (key: string) => string): Step[] => [
  {
    target: '.lessonCreationStep1',
    title: <div>{translate('intro_tour_lesson_creation_step_1_title')}</div>,
    content: (
      <div>
        <p>{translate('intro_tour_lesson_creation_step_1_subtitle')}</p>
        <p>{translate('intro_tour_lesson_creation_step_1_subtitle_2')}</p>
      </div>
    ),
    skipBeacon: true,
    placement: 'center' as const,
  },
  {
    target: '.lessonCreationStep2',
    title: <div>{translate('intro_tour_lesson_creation_step_2_title')}</div>,
    content: <div>{translate('intro_tour_lesson_creation_step_2_subtitle')}</div>,
    skipBeacon: true,
    placement: 'right' as const,
  },
  {
    target: '.lessonCreationStep3',
    title: <div>{translate('intro_tour_lesson_creation_step_3_title')}</div>,
    content: <div>{translate('intro_tour_lesson_creation_step_3_subtitle')}</div>,
    skipBeacon: true,
    placement: 'left' as const,
  },
  {
    target: '.lessonCreationStep4',
    title: <div>{translate('intro_tour_lesson_creation_step_4_title')}</div>,
    content: <div>{translate('intro_tour_lesson_creation_step_4_subtitle')}</div>,
    skipBeacon: true,
    placement: 'auto' as const,
  },
  {
    target: '.lessonCreationStep5',
    title: <div>{translate('intro_tour_lesson_creation_step_5_title')}</div>,
    content: <div>{translate('intro_tour_lesson_creation_step_5_subtitle')}</div>,
    skipBeacon: true,
    placement: 'auto' as const,
  },
]
