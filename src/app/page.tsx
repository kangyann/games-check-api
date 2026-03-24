
/**
 * @import Image as next/image
 * @import Link as next/link
 * @import LogoIcon as Icon
 */

import Image from "next/image";
import LogoIcon from '@/app/icon.png'
import Link from "next/link";

/**
 * @function Home
 * @constant
 * @type {Record<string,string>}
 * @returns {React.ReactNode}
 */
interface Data {
  title: string,
  desc: string,
  to: string,
  github_to: string,
  github_text: string
}
export default function Home(): React.ReactNode {

  const data: Partial<Data> = {
    title: "API GAMES ACCOUNT CHECK",
    desc: "Open Source Program - Account Games Validation - Developer Friendly.",
    to: "READ DOCS",
    github_to: "https://github.com/kangyann/games-check-api",
    github_text: "GITHUB"
  }

  return (
    <div className="">
      <div className="font-[family-name:var(--font-geist-mono)]">
        <main className="w-full min-h-screen flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center text-center">
            <Image src={LogoIcon} alt="mylix_icon" width={256} height={256} draggable={false} />
            <div className="flex flex-col max-w-96 gap-1">
              <h1 className="lg:text-2xl md:text-2xl text-xl font-bold">{data.title}</h1>
              <p className="lg:text-sm md:text-sm text-xs">{data.desc}</p>
              <div className="flex flex-wrap justify-center items-center gap-1.5">
                <Link href="/docs" className="text-xs bg-gradient-to-tr from-indigo-900 to-cyan-500 text-white px-3 py-1.5 rounded w-fit mt-1.5 font-[family-name:var(--font-geist-sans) hover:bg-indigo-500/90 active:scale-[.95] transition">{data.to}</Link>
                <a href={`${data.github_to}`} title="See on Github" className="flex items-center gap-1 text-xs ring ring-gray-200 text-blackk px-3 py-1.5 rounded w-fit mt-1.5 font-[family-name:var(--font-geist-sans) hover:bg-gray-900/20 active:scale-[.95] transition">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-slate-900"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
                  {data.github_text}
                </a>
              </div>
            </div>
          </div>
        </main>
      </div >
    </div >
  )
}
