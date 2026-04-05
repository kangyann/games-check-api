"use client"
import React, { useState } from 'react';
import data from '@/data/pages/docs/data.json'
import Link from 'next/link';
import { DocscLayoutClient } from './layout-client';
import { OnThisPageProvider } from '@/context/OnThisPage';
import { FaX, FaBars } from "react-icons/fa6";

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const [MenuHandle, setMenuHandle] = useState<boolean>(false)

    return (
        <React.Fragment>
            <main className="font-[family-name:var(--font-geist-sans)] px-6 relative bg-white text-black">
                {/*  */}
                <div className={`absolute top-0 left-0 w-full z-30 bg-white ${MenuHandle ? "opacity-100 translate-y-0 min-h-screen" : "opacity-0 -translate-y-2 pointer-events-none min-h-0"} transition-all delay-75 duration-300`}>
                    <div className="p-6">
                        <div className="flex py-2 border-b border-b-gray-200 items-center justify-start">
                            <FaX size={18} onClick={() => setMenuHandle(false)} />
                            <h2 className='flex-1 text-center'>Documentation</h2>
                        </div>
                        <div className="flex flex-col my-4 gap-1 text-sm">
                            {data['sidebar-link'].map((value: Record<string, any>, index: number) => (
                                <React.Fragment key={`${value.alt}-${index}`}>
                                    {!value.to && (
                                        <small className="text-xs font-medium mt-1">{value.title}</small>
                                    )}
                                    {value.to && (
                                        <Link href={value.to} className="hover:translate-x-1 hover:text-[rgb(0,0,0,.75)] transition font-medium border px-2 py-1 rounded bg-[rgb(255,255,255,.25)] border-gray-200" onClick={() => setMenuHandle(false)}>{value.title}</Link>
                                    )}
                                    {value.data && (
                                        <div className="flex flex-col gap-2 ms-3">
                                            {value.data.map((value: Record<string, any>, index: number) => (
                                                <React.Fragment key={`${value.alt}-${index}`}>
                                                    <Link onClick={() => setMenuHandle(false)} href={`${value.to}`} className="hover:translate-x-1 hover:text-[rgb(0,0,0,.75)] transition border px-2 py-1 rounded bg-[rgb(255,255,255,.25)] border-gray-200 border-b-gray-200"><span className={`text-${value.color} font-semibold text-sm`}>{value.type}</span> {value.text}</Link>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
                {/*  */}
                <div className="sticky top-0 z-20 bg-white left-0">
                    <div className="container mx-auto p-3 flex justify-between items-center ">
                        <div className="flex items-center gap-3">
                            <FaBars className='xl:hidden lg:hidden md:hidden block' onClick={() => setMenuHandle(true)} />
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
                    <div className="flex-[.7] min-w-48 min-h-screen z-10 xl:block lg:block md:block hidden border-e border-gray-100 ">
                        <section className="sticky left-0 top-16 w-full space-y-1.5 px-6 py-3 text-sm overflow-x-hidden flex flex-col gap-1">
                            {data['sidebar-link'].map((value: Record<string, any>, index: number) => (
                                <React.Fragment key={`${value.alt}-${index}`}>
                                    {!value.to && (
                                        <small className="text-xs font-medium mt-1">{value.title}</small>
                                    )}
                                    {value.to && (
                                        <Link href={value.to} className=" hover:translate-x-1 hover:text-[rgb(0,0,0,.75)] transition font-medium border px-2 py-1 rounded bg-[rgb(255,255,255,.25)] border-gray-200">{value.title}</Link>
                                    )}
                                    {value.data && (
                                        <div className="flex flex-col gap-2 ms-3">
                                            {value.data.map((value: Record<string, any>, index: number) => (
                                                <React.Fragment key={`${value.alt}-${index}`}>
                                                    <Link href={`${value.to}`} className="transition border px-2 py-1 rounded bg-[rgb(255,255,255,.25)] border-gray-200 border-b-gray-200 hover:translate-x-1 hover:text-[rgb(0,0,0,.75)]"><span className={`text-${value.color} font-semibold text-sm`}>{value.type}</span> {value.text}</Link>
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
                            <footer className="fixed z-10 w-full left-0 bottom-0 text-sm font-[family-name:var(--font-geist-mono)] bg-white border-t border-gray-100 py-1.5">
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
        </React.Fragment >
    )
}
