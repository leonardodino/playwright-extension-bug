const name = 'a-very-nice-clock'

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== name) return
  if (typeof port.sender?.tab?.id !== 'number') return
  port.postMessage(port.sender?.tab?.id)
  port.onMessage.addListener(({ tabId, frameId, message }) => {
    chrome.tabs.sendMessage(tabId, message, { frameId })
  })
})
