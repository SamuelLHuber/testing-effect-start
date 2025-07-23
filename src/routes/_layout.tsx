import type { ComponentChildren } from "preact"

interface LayoutProps {
  children: ComponentChildren
}

export default function Layout(props: LayoutProps) {
  return (
    <div>
      <div>
        {props.children}
      </div>
    </div>
  )
}
