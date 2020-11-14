const name = 'a-very-nice-clock'
const echo = (message) => chrome.runtime.sendMessage(undefined, message)

const getClockElement = () => {
  let element = document.getElementById(name)
  if (element) return element
  element = document.createElement('div')
  element.id = name
  element.style.cssText = `
    display: grid;
    place-content: center;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    font: bold 8rem 'SF Mono', SFMono-Regular, ui-monospace, monospace;
  `
  document.body.appendChild(element)
  return element
}

// made to work the same with all content_scripts.run_at values
document.body
  ? getClockElement()
  : window.addEventListener('DOMContentLoaded', getClockElement)

chrome.runtime.onMessage.addListener((message) => {
  if (typeof message !== 'string') return
  if (window.top !== window.self) return
  getClockElement().innerHTML = message
})

const interval = setInterval(
  () => echo(new Date().toLocaleTimeString('en-GB')),
  1000,
)
