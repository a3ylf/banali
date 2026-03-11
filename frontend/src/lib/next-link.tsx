import React from 'react'

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, onClick, children, target, rel, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    // Let modified clicks or external links behave normally
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      (rel && rel.includes('external'))
    ) {
      return
    }

    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new Event('spa:navigate'))
  }

  return (
    <a ref={ref} href={href} target={target} rel={rel} onClick={handleClick} {...props}>
      {children}
    </a>
  )
})

Link.displayName = 'Link'

export default Link
