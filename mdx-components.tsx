import type { MDXComponents } from 'mdx/types'
import Figure from '@/app/components/Figure'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Figure: (props) => <Figure {...props} />,
    wrapper: ({ children }) => <article className="prose px-4 mx-auto">{children}</article>
  }
}