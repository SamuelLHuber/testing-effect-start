import type { ComponentChildren } from "preact"
import { MiniAppProvider } from "../components/miniapp"

interface LayoutProps {
  children: ComponentChildren
}

export default function Layout(props: LayoutProps) {
  return (
    <div>
      <MiniAppProvider>
        <div>
          {props.children}
        </div>
      </MiniAppProvider>
    </div>
  )
}
