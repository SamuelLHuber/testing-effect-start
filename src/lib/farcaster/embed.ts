import type { FrameEmbedNext } from "./schema"

/**
 * Creates a MiniApp Embed object with the specified image URL, app URL, and other properties.
 * The Object can be directly stringified and used in <meta> tags.
 *
 * When calling `getFCembed`, you can pass an object with only the values you want to override. Any parameters not provided will use their default values.
 *
 * Example usage:
 * ```javascript
const miniAppEmbed = getFCembed({
  imageUrl: `https://myImageUrl.com/address/${address}`,
})
```
or
```javascript
const miniAppEmbed = getFCembed({
  buttonTitle: "Some button title",
  name: "dTech.vision"
})
```
and so on.
 *
 * To use in <meta> tags please stringify like <meta name="fc:miniapp" content=${JSON.stringify(fcembed)}", where fcembed import {  } from * a return of the getFCembed function.
 *
 * @param {Object} [options={}] - Optional parameters to override default values.
 * @param {string} [options.imageUrl="https://dtech.vision/miniapp.png"] - The image URL for the embed frame.
 * @param {string} [options.appUrl="https://dtech.vision"] - The app URL for the embed frame.
 * @param {string} [options.buttonTitle="dTech is great!"] - The button title for the embed frame.
 * @param {string} [options.name="dTech.vision"] - The name of the app in the embed frame.
 * @param {string} [options.splashImageUrl="https://dtech.vision/icon.png"] - The splash image URL for the embed frame.
 * @param {string} [options.splashBackgroundColor="#f7f7f7"] - The background color for the splash image in the embed frame.
 * @returns {FrameEmbedNext} A Frame Embed object with the specified properties.
 */
export default function getFCembed({
  appUrl = "https://dtech.vision",
  buttonTitle = "dTech is great!",
  imageUrl = "https://dtech.vision/miniapp.png",
  name = "dTech.vision",
  splashBackgroundColor = "#f7f7f7",
  splashImageUrl = "https://dtech.vision/icon.png",
}: {
  imageUrl?: string
  appUrl?: string
  buttonTitle?: string
  name?: string
  splashImageUrl?: string
  splashBackgroundColor?: string
}): FrameEmbedNext {
  return {
    version: "next",
    imageUrl: new URL(imageUrl),
    button: {
      title: buttonTitle,
      action: {
        type: "launch_frame",
        name,
        url: new URL(appUrl),
        splashImageUrl: new URL(splashImageUrl),
        splashBackgroundColor,
      },
    },
  }
}
