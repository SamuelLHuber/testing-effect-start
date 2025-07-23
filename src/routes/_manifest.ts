const layout_ = {
  path: "/",
  parent: undefined,
  load: () => import("./_layout.tsx"),
}

const page_ = {
  path: "/",
  parent: layout_,
  load: () => import("./_page.tsx"),
}
export const Pages = [
  page_,
] as const
