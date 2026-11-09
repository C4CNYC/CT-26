import { type Props } from 'react-joyride'

export const TOUR_JOYRIDE_SHARED_PROPS = {
  options: { showProgress: true, zIndex: 10000 },
  floatingOptions: {
    flipOptions: { fallbackPlacements: undefined, fallbackAxisSideDirection: 'end' },
  },
} satisfies Partial<Props>
