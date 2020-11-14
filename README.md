# playwright repro for #

this repo contains a simple test extension in `/extension`.

the extension displays a clock on top of webpages.
it passes messages to and from the background page in order to trigger the issue.

The issue happens when the background page tries to communicate back with the open tab:

```js
chrome.tabs.sendMessage(tabId, message, { frameId })
```

results in:
```diff
- "Could not establish connection. Receiving end does not exist."
```


The issue only affects `chromium.launch`, and not `chromium.launchPersistentContext`.

The issue is not present in a Chromium on Inconito, nor in a Google Chrome browser.

## test

I added a minimal test, on `test.js`.

`index.js` will check the output of `test.js` against known values.
running it will yield:
```
==== persistent ====
DOM insertion: true
clock updated: true
==== inconigto ====
DOM insertion: true
clock updated: false

=> 🐛 reproduced
```

**exit codes**
```
0 => reproduced
2 => fixed
1 => unknown (probably more bugs than before).
```

## branches

there are 2 branches:
- `main`: uses `chrome.runtime.connect`
- `runtime-send-message`: uses `chrome.runtime.sendMessage`

both of them reproduce the error equally.
I guess they share the same implementation somewhere down the line.

The code on `runtime-send-message` is slightly shorter.

## license

MIT