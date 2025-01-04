import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFile } from 'fs/promises'
import path from 'path'

export default async function TermsOfUse() {
  const filePath = path.join(process.cwd(), 'app', 'terms-of-use', 'terms-of-use.mdx')
  const source = await readFile(filePath, 'utf8')

  return (
    <div className="container mx-auto py-8">
      <MDXRemote source={source} />
    </div>
  )
}

