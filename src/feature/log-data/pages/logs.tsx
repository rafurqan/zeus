import { Card, CardContent } from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { Activity, User, Globe, FileText, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import BaseLayout from "@/core/components/baseLayout";
import { useEffect, useState } from "react";
import { useLog } from "../hooks/useLog";
import { LogEntry, LogRequest } from "../types/logs";

// Types untuk log data

export default function LogsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const {
        data: logData,
        loading: logLoading,
        meta,
        getLogs
    } = useLog();

    useEffect(() => {
        getLogs({ page: currentPage, per_page: perPage });
    }, [getLogs, currentPage, perPage]);

    function formatDateTime(timestamp?: string): string {
        if (!timestamp) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "short",
            timeStyle: "medium",
        }).format(new Date(timestamp));
    }

    function getMethodColor(method?: string): string {
        switch (method?.toUpperCase()) {
            case "GET":
                return "bg-blue-100 text-blue-800";
            case "POST":
                return "bg-green-100 text-green-800";
            case "PUT":
                return "bg-yellow-100 text-yellow-800";
            case "DELETE":
                return "bg-red-100 text-red-800";
            case "PATCH":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    function getEndpoint(url?: string): string {
        if (!url) return "-";
        try {
            const urlObj = new URL(url);
            return urlObj.pathname;
        } catch {
            return url;
        }
    }

    function formatRequestData(request?: LogRequest): string {
        if (!request) return "-";
        if (Array.isArray(request) && request.length === 0) return "Empty";
        if (typeof request === "object" && Object.keys(request).length === 0) return "Empty";
        return JSON.stringify(request);
    }

    const handleRefresh = () => {
        getLogs({ page: currentPage, per_page: perPage });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset ke halaman pertama saat mengubah jumlah item per halaman
    };

    // Pagination calculations
    const totalPages = meta?.total ? Math.ceil(meta.total / perPage) : 0;
    const currentPageFromMeta = meta?.page || currentPage;
    const totalItems = meta?.total || 0;
    const startItem = totalItems > 0 ? (currentPageFromMeta - 1) * perPage + 1 : 0;
    const endItem = Math.min(currentPageFromMeta * perPage, totalItems);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPageFromMeta - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const totalLogs = totalItems;
    const methodCounts = logData?.reduce((acc: Record<string, number>, log: LogEntry) => {
        const method = log.method || "UNKNOWN";
        acc[method] = (acc[method] || 0) + 1;
        return acc;
    }, {}) || {};

    const uniqueUsers = new Set(logData?.map(log => log.user).filter(Boolean)).size;
    const uniqueIPs = new Set(logData?.map(log => log.ip).filter(Boolean)).size;

    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full">
                    <main className="p-4">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">System Logs</h1>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={handleRefresh}
                                        disabled={logLoading}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${logLoading ? 'animate-spin' : ''}`} />
                                        <span>Refresh</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            {logLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="p-6 animate-pulse space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/4"></div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Total Logs */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Logs</p>
                                                    <h3 className="text-2xl font-bold mt-1">{totalLogs}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">All recorded activities</p>
                                                </div>
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <Activity className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Unique Users */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Unique Users</p>
                                                    <h3 className="text-2xl font-bold mt-1">{uniqueUsers}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Active users (current page)</p>
                                                </div>
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Unique IPs */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Unique IPs</p>
                                                    <h3 className="text-2xl font-bold mt-1">{uniqueIPs}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Different sources (current page)</p>
                                                </div>
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <Globe className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Most Used Method */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Most Used Method</p>
                                                    <h3 className="text-2xl font-bold mt-1">
                                                        {Object.keys(methodCounts).length > 0
                                                            ? Object.entries(methodCounts).sort(([, a], [, b]) => b - a)[0][0]
                                                            : "N/A"
                                                        }
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {Object.keys(methodCounts).length > 0
                                                            ? `${Object.entries(methodCounts).sort(([, a], [, b]) => b - a)[0][1]} requests (current page)`
                                                            : "No data"
                                                        }
                                                    </p>
                                                </div>
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Logs Table */}
                            {!logLoading && (
                                <div className="grid grid-cols-1">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Recent Activity Logs</h3>
                                                    <p className="text-sm text-gray-500">Latest system activities and API requests</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">Show:</span>
                                                    <select
                                                        value={perPage}
                                                        onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 bg-no-repeat bg-right"
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                            backgroundPosition: 'right 1rem right',
                                                            backgroundSize: '1rem 1rem'
                                                        }}
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>
                                                    <span className="text-sm text-gray-500">per page</span>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Method</TableHead>
                                                            <TableHead>Endpoint</TableHead>
                                                            <TableHead>IP Address</TableHead>
                                                            <TableHead>Timestamp</TableHead>
                                                            <TableHead>Request Data</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {logData && logData.length > 0 ? (
                                                            logData.map((log: LogEntry, index: number) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="font-medium">
                                                                        {log.user || "Unknown"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {log.method ? (
                                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                                                                                {log.method}
                                                                            </span>
                                                                        ) : (
                                                                            "-"
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-xs truncate" title={getEndpoint(log.url)}>
                                                                        {getEndpoint(log.url)}
                                                                    </TableCell>
                                                                    <TableCell className="font-mono text-sm">
                                                                        {log.ip || "-"}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm">
                                                                        {formatDateTime(log.timestamp)}
                                                                    </TableCell>
                                                                    <TableCell className="max-w-xs">
                                                                        <div className="truncate text-sm" title={formatRequestData(log.request)}>
                                                                            {formatRequestData(log.request)}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                                    No logs available
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="text-sm text-gray-500">
                                                        Showing {startItem} to {endItem} of {totalItems} results
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* First Page */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(1)}
                                                            disabled={currentPageFromMeta === 1}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <ChevronsLeft className="h-4 w-4" />
                                                        </Button>

                                                        {/* Previous Page */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(currentPageFromMeta - 1)}
                                                            disabled={currentPageFromMeta === 1}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>

                                                        {/* Page Numbers */}
                                                        {getPageNumbers().map((pageNum) => (
                                                            <Button
                                                                key={pageNum}
                                                                variant={pageNum === currentPageFromMeta ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className="h-8 min-w-8"
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        ))}

                                                        {/* Next Page */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(currentPageFromMeta + 1)}
                                                            disabled={currentPageFromMeta === totalPages}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>

                                                        {/* Last Page */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(totalPages)}
                                                            disabled={currentPageFromMeta === totalPages}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <ChevronsRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </BaseLayout>
    );
}