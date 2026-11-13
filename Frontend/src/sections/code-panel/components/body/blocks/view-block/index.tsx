import { useContext, useState } from 'react'

import { CgBrowser } from '@react-icons/all-files/cg/CgBrowser'
import { TbArrowBarToRight } from '@react-icons/all-files/tb/TbArrowBarToRight'
import { useDispatch, useSelector } from 'react-redux'

import { toggleBrowser } from '@/redux/slices/code-panel-global'
import { type RootState } from '@/redux/store'
import { useTranslate } from '@/utils/translateHelper'
import { CodePanelContext } from '@root/src/sections/code-panel/lib/CodePanelContext'

import { BrowserViewEx } from '../../../browserview/BrowserViewEx'
import { BrowserViewHTML } from '../../../browserview/BrowserViewHTML'
import BaseBlock from '../base-block'
import { useFileManager } from '../code-editor-block/code-editor-collab/hook/file-manager/useFileManager'

import PreviewControls from './browser-view/preview-controls'
import ConsoleBlock from './console-block'

export function ViewBlock() {
  const dispatch = useDispatch()
  const isBrowserHidden = useSelector((state: RootState) => state.codePanelGlobal.isBrowserHidden)
  const translate = useTranslate()
  const codePanelContext = useContext(CodePanelContext)
  const { files } = useFileManager()
  const [isOpenHeader, setIsOpenHeader] = useState<boolean>(true)
  const [runCount, setRunCount] = useState<number>(0)
  if (isBrowserHidden) {
    return null
  }
  const isPythonOrJavaLesson = files.some((file) =>
    ['py', 'java'].includes(file.extension.toLowerCase())
  )
  return (
    <BaseBlock
      closeIcon={<TbArrowBarToRight size={20} />}
      title={translate('browser_preview')}
      icon={
        <CgBrowser
          size='20px'
          color='#43D4DD'
        />
      }
      className='browserTour'
      hideTabsHandler={() => dispatch(toggleBrowser(true))}
      takeHeaderSettings={setIsOpenHeader}
    >
      <PreviewControls
        reloadIframe={() => setRunCount((count) => count + 1)}
        isAutoRun={codePanelContext.autoRun && !isPythonOrJavaLesson}
      />

      {isPythonOrJavaLesson ? (
        <BrowserViewEx runCount={runCount} />
      ) : (
        <BrowserViewHTML
          isOpenHeader={isOpenHeader}
          iframeKey={runCount + codePanelContext.reloadIframeKey}
        />
      )}
      <ConsoleBlock />
    </BaseBlock>
  )
}
