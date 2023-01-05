import { downloadBlob } from './download-blob.js'
import { startScreenRecordingAsync } from './start-screen-recording-async.js'

const DEFAULT_URL = 'https://yuanqing.sg'
const START_BUTTON_CLASS_NAME = 'start-button'
const IFRAME_CLASS_NAME = 'iframe'
const HIDDEN_CLASS_NAME = 'hidden'
const VIDEO_FILE_NAME = 'screen-recording.webm'

function main() {
  const url = getUrl()
  if (url === null) {
    window.location.href = `${window.location.href}?url=${DEFAULT_URL}`
    return
  }
  const iframeElement = createIframeElement(url, IFRAME_CLASS_NAME)
  document.body.appendChild(iframeElement)

  const startButtonElement = document.querySelector(
    `.${START_BUTTON_CLASS_NAME}`
  )
  startButtonElement.addEventListener('click', async function () {
    startButtonElement.classList.add(HIDDEN_CLASS_NAME)
    const blob = await startScreenRecordingAsync()
    downloadBlob(blob, VIDEO_FILE_NAME)
    startButtonElement.classList.remove(HIDDEN_CLASS_NAME)
  })
}

function getUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('url')
}

function createIframeElement(src, className) {
  const iframeElement = document.createElement('iframe')
  iframeElement.setAttribute('src', src)
  iframeElement.classList.add(className)
  return iframeElement
}

main()
