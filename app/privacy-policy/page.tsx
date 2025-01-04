import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFile } from 'fs/promises'
import path from 'path'

export default async function PrivacyPolicy() {
  const filePath = path.join(process.cwd(), 'app', 'privacy-policy', 'privacy-policy.mdx')
  const source = await readFile(filePath, 'utf8')

  return (
    <div className="container mx-auto py-8">
      <MDXRemote source={source} />
    </div>
  )
}

