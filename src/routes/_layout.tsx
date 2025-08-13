import type { ComponentChildren } from "preact"

interface LayoutProps {
  children: ComponentChildren
}

export default function Layout(props: LayoutProps) {
  return (
    <div>
      <span>Root</span>
      <div>
        {props.children}
      </div>
    </div>
  )
}
