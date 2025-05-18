export default function EducationLevelTableSkeleton() {
    return (
        <div className="w-full overflow-hidden animate-pulse">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        {[...Array(5)].map((_, i) => (
                            <th key={i} className="px-4 py-2 text-left">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, i) => (
                        <tr key={i} >
                            {[...Array(5)].map((_, j) => (
                                <td key={j} className="px-4 py-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
