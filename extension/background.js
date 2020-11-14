chrome.runtime.onMessage.addListener((message, sender) => {
  if (typeof sender?.tab?.id !== 'number') return
  chrome.tabs.sendMessage(sender.tab.id, message, { frameId: 0 })
})
