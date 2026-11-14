import { type SxProps, type Theme } from '@mui/material'

export const COLLAB_EDITOR_WRAPPER_SX: SxProps<Theme> = {
  position: 'relative',
  background: '#282c34',
  minHeight: '100%',
  '& .cm-line': {
    position: 'relative',
  },
}
