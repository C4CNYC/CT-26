import { type CSSProperties, type ReactElement, type ReactNode } from 'react'

import Split from '@uiw/react-split'

interface ResizableSideBySidePanesProps {
  children: [ReactNode, ReactNode]
  leftPaneDefaultWidth: string
  leftPaneMinWidth: number
  leftPaneMaxWidth?: number
  style?: CSSProperties
}

// Two panes side by side with a draggable divider; the left pane's width is clamped
export function ResizableSideBySidePanes({
  children: [leftPane, rightPane],
  leftPaneDefaultWidth,
  leftPaneMinWidth,
  leftPaneMaxWidth,
  style,
}: ResizableSideBySidePanesProps): ReactElement {
  return (
    <Split
      lineBar
      style={{ width: '100%', height: '100%', ...style }}
    >
      <div
        style={{
          width: leftPaneDefaultWidth,
          minWidth: leftPaneMinWidth,
          maxWidth: leftPaneMaxWidth,
          overflowY: 'auto',
        }}
      >
        {leftPane}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowY: 'hidden' }}>{rightPane}</div>
    </Split>
  )
}
