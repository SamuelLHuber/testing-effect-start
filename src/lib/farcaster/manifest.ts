import type { ManifestType } from "./schema"

export default function getFCmanifest({
  accountAssociationHeader,
  accountAssociationPayload,
  accountAssociationSignature,
  buttonTitle = "Hire dTech",
  homeUrl = "https://dtech.vision",
  iconUrl = "https://dtech.vision/icon.png",
  imageUrl = "https://dtech.vision/miniapp.png",
  name = "dTech.vision",
  splashBackgroundColor = "#F7F7F7",
  splashImageUrl,
}: {
  accountAssociationHeader: string
  accountAssociationPayload: string
  accountAssociationSignature: string
  name?: string
  homeUrl?: string
  iconUrl?: string
  buttonTitle?: string
  imageUrl?: string
  splashImageUrl?: string
  splashBackgroundColor?: string
}): ManifestType {
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
      ...(splashImageUrl && { splashImageUrl: new URL(splashImageUrl) }),
      splashBackgroundColor,
    },
  }
}
