import fixWebmDuration from 'fix-webm-duration'

export async function startScreenRecordingAsync() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: false,
    preferCurrentTab: true,
    video: {
      cursor: 'always',
      displaySurface: 'browser',
      frameRate: 30,
      height: { ideal: 999999 },
      resizeMode: 'none',
      width: { ideal: 999999 }
    }
  })
  return new Promise(function (resolve) {
    const recorder = new MediaRecorder(stream)
    const chunks = []
    let startTime
    recorder.addEventListener('start', function () {
      startTime = performance.now()
    })
    recorder.addEventListener('dataavailable', function (event) {
      chunks.push(event.data)
    })
    recorder.addEventListener('stop', async function () {
      const duration = performance.now() - startTime
      const blob = new Blob(chunks, { type: chunks[0].type })
      const patchedBlob = await fixWebmDuration(blob, duration, {
        logger: false
      })
      resolve(patchedBlob)
    })
    recorder.start()
  })
}
