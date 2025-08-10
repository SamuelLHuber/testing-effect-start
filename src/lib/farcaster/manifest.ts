import type { ManifestType } from "./schema"

export default function getFCmanifest(
  accountAssociationHeader: string,
  accountAssociationPayload: string,
  accountAssociationSignature: string,
  name: string = "dTech.vision",
  homeUrl: string = "https://dtech.vision",
  iconUrl: string = "https://dtech.vision/icon.png",
  buttonTitle: string = "Hire dTech",
  imageUrl: string = "https://dtech.vision/miniapp.png",
  splashImageUrl?: string,
  splashBackgroundColor: string = "#F7F7F7",
): ManifestType {
  return {
    accountAssociation: {
      header: accountAssociationHeader,
      payload: accountAssociationPayload,
      signature: accountAssociationSignature,
    },
    frame: {
      version: "1",
      name,
      homeUrl: new URL(homeUrl),
      iconUrl: new URL(iconUrl),
      imageUrl: new URL(imageUrl),
      buttonTitle,
      splashImageUrl: new URL(splashImageUrl || ""),
      splashBackgroundColor,
    },
  }
}
