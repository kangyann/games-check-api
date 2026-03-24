"use client"
import React from 'react';
import data from '@/data/pages/docs/data.json'
import Link from 'next/link';
import { DocscLayoutClient } from './layout-client';
import { OnThisPageProvider } from '@/context/OnThisPage';
import { FaBars } from "react-icons/fa";

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <React.Fragment>
            <main className="font-[family-name:var(--font-geist-sans)] px-6 relative">
                <div className="sticky top-0 z-20 bg-white left-0">
                    <div className="container mx-auto p-3 flex justify-between items-center ">
                        <div className="flex items-center gap-3">
                            <FaBars  className='xl:hidden lg:hidden md:hidden block'/>
                            <h1 className="text-xl font-bold text-indigo-500">
                                <Link href="/" >{data.title}</Link>
                            </h1>
                        </div>
                        <a href="/" className="text-sm bg-indigo-500 text-white px-3 py-1.5 rounded w-fit mt-1.5 font-[family-name:var(--font-geist-sans) hover:bg-indigo-500/90 active:scale-[.95] transition">{data['contact-us'].title}</a>
                    </div>
                    <hr className="text-gray-100" />
                </div>
                {/*  */}
                <div className="container flex mx-auto relative">
                    {/*  */}
                    <div className="flex-[.7] min-w-48 min-h-screen z-10 text-nowrap xl:block lg:block md:block hidden border-e border-gray-100 ">
                        <section className="sticky left-0 top-16 w-full space-y-1.5 px-6 py-3 text-sm overflow-x-hidden flex flex-col gap-1">
                            {data['sidebar-link'].map((value: Record<string, any>, index: number) => (
                                <React.Fragment key={`${value.alt}-${index}`}>
                                    {!value.to && (
                                        <small className="text-sm font-semibold">{value.title}</small>
                                    )}
                                    {value.to && (
                                        <Link href={value.to} className="hover:underline transition font-semibold">{value.title}</Link>
                                    )}
                                    {value.data && (
                                        <div className="flex flex-col gap-1.5 ms-3">
                                            {value.data.map((value: Record<string, any>, index: number) => (
                                                <React.Fragment key={`${value.alt}-${index}`}>
                                                    <Link href={`${value.to}`} className="hover:underline transition"><span className={`text-${value.color} font-medium`}>{value.type}</span> {value.text}</Link>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </section>
                    </div>

                    {/*  */}
                    <OnThisPageProvider>
                        <article className="relative flex-[3] p-3 pb-6 min-w-0">
                            {children}
                            <footer className="fixed w-full left-0 bottom-0 text-sm font-[family-name:var(--font-geist-mono)] bg-white border-t border-gray-100 py-1.5">
                                <div className="flex justify-center items-center gap-1.5">
                                    <p dangerouslySetInnerHTML={{ __html: data.footer.desc }}></p>
                                    <a href={data.footer.to}>{data.footer.author}</a>
                                </div>
                            </footer>
                        </article>
                        {/*  */}
                        <section className="flex-[.7] border-s border-gray-100 min-h-screen xl:block lg:block hidden text-nowrap">
                            <DocscLayoutClient />
                        </section>
                    </OnThisPageProvider>
                </div>
            </main>
        </React.Fragment>
    )
}
