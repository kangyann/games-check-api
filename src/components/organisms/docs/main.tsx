
export default function MainDocsComponent({ children, title, id }: Readonly<{ children: React.ReactNode, title: string, id?: string }>) {
    return (
        <div className="mb-6 w-full scroll-smooth" id={id}>
            <h4 className="text-2xl font-medium">{title}</h4>
            <div className="space-y-2 mt-3 text-sm px-3 max-w-full">
                {children}
            </div>
        </div>
    )

}