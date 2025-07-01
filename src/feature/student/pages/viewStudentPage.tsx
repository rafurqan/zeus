"use client"

import {
    ArrowLeft,
    Edit,
    User,
    Mail,
    Phone,
    Calendar,
    School,
    FileText,
    Eye,
    Briefcase,
    Receipt,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Separator } from "@/core/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/core/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { useNavigate, useParams } from "react-router-dom"
import BaseLayout from "@/core/components/baseLayout"
import { useStudentById } from "../hooks/useStudentById"
import { OriginSchool } from "@/feature/prospective-student/types/origin-school"
import { DocumentStudent } from "@/feature/prospective-student/types/document-student"
import { Parent } from "@/feature/prospective-student/types/parent"
import { ClassMembership } from "../types/student-class-membership"
import StudentDetailShimmer from "../components/studentDetailShimmer"
import { Invoice } from "@/feature/finance/types/invoice"

// Mock data for a single student - in a real app, this would come from an API



export default function StudentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { data, isLoading, isError, error } = useStudentById(id);


    if (isLoading) return <BaseLayout>
        <div className="flex min-h-screen">
            <div className="flex-1 w-full ">
                <main className="p-4 ">
                    <StudentDetailShimmer />
                </main>
            </div>
        </div></BaseLayout>;
    if (isError) return <div>Gagal memuat data: {error?.message}</div>;



    const handleEdit = () => {
        navigate(`/students/student/${data?.id}/edit`, {
            state: { item: data }
        });
    }

    const handleGoBack = () => {
        navigate('/students/student')
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-2">Siswa Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-4">Siswa yang Anda cari tidak ada atau telah dihapus.</p>
                <Button onClick={handleGoBack}>Kembali</Button>
            </div>
        )
    }

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const totalInvoices = data.invoices ? data.invoices.length : 0
    const paidInvoices = data.invoices ? data.invoices.filter((p: Invoice) => p.status === "Lunas").length : 0
    const pendingInvoices = data.invoices ? data.invoices.filter((p: Invoice) => p.status === "Menunggu Pembayaran").length : 0
    const overdueInvoices = data.invoices ? data.invoices.filter((p: Invoice) => p.status === "Terlambat").length : 0

    const totalAmount = data.invoices ? data.invoices.reduce((sum: number, p: Invoice) => sum + p.total, 0) : 0

    const paidAmount = data.invoices
        ? data.invoices.filter((p: Invoice) => p.status === "Lunas").reduce((sum: number, p: Invoice) => sum + p.total, 0)
        : 0

    const pendingAmount = data.invoices
        ? data.invoices
            .filter((p: Invoice) => p.status === "Menunggu Pembayaran" || p.status === "Terlambat")
            .reduce((sum: number, p: Invoice) => sum + p.total, 0)
        : 0

    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full ">
                    <main className="p-4 ">

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={handleGoBack}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <h1 className="text-2xl font-bold">Detail Siswa</h1>
                                </div>
                                <Button onClick={handleEdit}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Data
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Left sidebar with photo and basic info */}
                                <Card className="lg:col-span-1">
                                    <CardHeader className="text-center pb-2">
                                        <div className="mx-auto w-32 h-32 relative mb-2">
                                            {data?.photo_url ? (
                                                <img
                                                    src={data?.photo_url || "/placeholder.svg"}
                                                    alt={data?.full_name}
                                                    className="rounded-full object-cover w-full h-full border-3 border-primary/20"
                                                />
                                            ) : (
                                                <div className="rounded-full w-full h-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-16 w-16 text-primary/40" />
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl">{data?.full_name ?? ""}</CardTitle>
                                        <p className="text-sm text-gray-400">{data?.nickname && `"${data?.nickname}"`}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Badge
                                                variant={data?.status === "approved" ? "default" : "secondary"}
                                                className="w-full justify-center py-1"
                                            >
                                                {data?.status === "approved" ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 pt-3">
                                            <div className="flex items-start gap-2">
                                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400">NISN / NIS</p>
                                                    <p className="text-sm font-medium">
                                                        {data?.nisn}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400">Email</p>
                                                    <p className="text-sm font-medium">{data?.email || "-"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400">Telepon</p>
                                                    <p className="text-sm font-medium">{data?.phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400">Tanggal Masuk</p>
                                                    <p className="text-sm font-medium">{new Intl.DateTimeFormat('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }).format(new Date(data?.created_at ?? ""))}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <h3 className="text-sm text-gray-400">Status Khusus</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data?.special_need && (
                                                    <Badge variant="outline" className="bg-purple-50">
                                                        Berkebutuhan Khusus
                                                    </Badge>
                                                )}
                                                {data?.has_kps && (
                                                    <Badge variant="outline" className="bg-green-50">
                                                        Penerima KPS/PKH
                                                    </Badge>
                                                )}
                                                {data?.has_kip && (
                                                    <Badge variant="outline" className="bg-green-50">
                                                        Memiliki KIP
                                                    </Badge>
                                                )}
                                                {data?.eligible_for_kip && (
                                                    <Badge variant="outline" className="bg-green-50">
                                                        Layak KIP
                                                    </Badge>
                                                )}
                                                {!data?.special_need &&
                                                    !data?.has_kps &&
                                                    !data?.has_kip &&
                                                    !data?.eligible_for_kip && (
                                                        <span className="text-sm text-gray-400">Tidak ada status khusus</span>
                                                    )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Main content area with tabs */}
                                <div className="lg:col-span-3">
                                    <Tabs defaultValue="personal">
                                        <TabsList className="grid grid-cols-7 mb-4">
                                            <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                                            <TabsTrigger value="school">Sekolah Asal</TabsTrigger>
                                            <TabsTrigger value="family">Keluarga</TabsTrigger>
                                            <TabsTrigger value="documents">Dokumen</TabsTrigger>
                                            <TabsTrigger value="additional">Tambahan</TabsTrigger>
                                            <TabsTrigger value="class-history">Riwayat Kelas</TabsTrigger>
                                            <TabsTrigger value="invoices">Riwayat Tagihan</TabsTrigger>
                                        </TabsList>

                                        {/* Personal Information Tab */}
                                        <TabsContent value="personal">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Data Pribadi Siswa</CardTitle>
                                                    <CardDescription>Informasi pribadi dan identitas siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    {/* Registration Number */}
                                                    <div className="bg-muted p-4 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium">Nomor Registrasi</h3>
                                                                <p className="text-lg font-bold">{data?.registration_code}</p>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {new Intl.DateTimeFormat('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                }).format(new Date(data?.created_at ?? ""))}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Nama Lengkap</p>
                                                            <p className="font-medium">{data?.full_name ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Nama Panggilan</p>
                                                            <p className="font-medium">{data?.nickname || "-"}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Jenis Kelamin</p>
                                                            <p className="font-medium">{data?.gender}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Agama</p>
                                                            <p className="font-medium">{data?.religion?.name ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Tempat Lahir</p>
                                                            <p className="font-medium">{data?.birth_place ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Tanggal Lahir</p>
                                                            <p className="font-medium">{data?.birth_date ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">NISN</p>
                                                            <p className="font-medium">{data?.nisn ?? "-"}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Kewarganegaraan</p>
                                                            <p className="font-medium">{data?.nationality?.name}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Anak ke-</p>
                                                            <p className="font-medium">{data?.child_order}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Status dalam Keluarga</p>
                                                            <p className="font-medium">{data?.family_status}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Kondisi Spesial</p>
                                                            <p className="font-medium">{data?.special_condition?.name ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Penerima KPS/PKH</p>
                                                            <p className="font-medium">{data?.has_kps ? "Ya" : "Tidak"}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Memiliki KIP</p>
                                                            <p className="font-medium">{data?.has_kip ? "Ya" : "Tidak"}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Layak Mendapatkan KIP</p>
                                                            <p className="font-medium">{data?.eligible_for_kip ? "Ya" : "Tidak"}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Moda Transportasi</p>
                                                            <p className="font-medium">{data?.transportation_mode?.name ?? ""}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Berkebutuhan Khusus</p>
                                                            <p className="font-medium">{data?.special_need?.name ?? ""}</p>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium">Alamat Tempat Tinggal</h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-400">Provinsi</p>
                                                                <p className="font-medium">{data?.village?.sub_district?.city?.province?.name ?? ""}</p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-400">Kabupaten/Kota</p>
                                                                <p className="font-medium">{data?.village?.sub_district?.city?.name ?? ""}</p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-400">Kecamatan</p>
                                                                <p className="font-medium">{data?.village?.sub_district?.name ?? ""}</p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-400">Kelurahan</p>
                                                                <p className="font-medium">{data?.village?.name ?? ""}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Alamat Detail</p>
                                                            <p className="font-medium">{data?.street}</p>
                                                        </div>

                                                        {/* Location information with improved display */}
                                                        {/* <div className="space-y-2">
                                                            <h4 className="text-sm font-medium">Lokasi Koordinat</h4>
                                                            <Card className="bg-muted/30 border-dashed">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-start gap-3">
                                                                        <MapPin className="h-10 w-10 text-primary/70 shrink-0 mt-1" />
                                                                        <div className="space-y-2">
                                                                            <h4 className="font-medium">Informasi Lokasi</h4>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                <div className="space-y-1">
                                                                                    <p className="text-xs text-gray-400">Latitude</p>
                                                                                    <p className="font-medium">{student.latitude}</p>
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <p className="text-xs text-gray-400">Longitude</p>
                                                                                    <p className="font-medium">{student.longitude}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div> */}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Nomor Telepon</p>
                                                            <p className="font-medium">{data?.phone}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-400">Email</p>
                                                            <p className="font-medium">{data?.email || "-"}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* School Information Tab */}
                                        <TabsContent value="school">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Data Sekolah Asal</CardTitle>
                                                    <CardDescription>Informasi sekolah asal dan riwayat pendidikan siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <Alert className="mb-4">
                                                        <AlertDescription className="flex items-center gap-2">
                                                            <School className="h-4 w-4" />
                                                            <span>Riwayat pendidikan siswa dari sekolah-sekolah sebelumnya.</span>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Accordion
                                                        type="multiple"
                                                        className="w-full"
                                                        defaultValue={data?.origin_schools.map((school: OriginSchool) => school.id)}
                                                    >
                                                        {data?.origin_schools.map((school: OriginSchool, index: number) => (
                                                            <AccordionItem
                                                                key={school.id}
                                                                value={school.id}
                                                                className="border rounded-lg mb-4 overflow-hidden"
                                                            >
                                                                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                                            <School className="h-3 w-3" />
                                                                            <span>Sekolah {index + 1}</span>
                                                                        </Badge>
                                                                        <span className="font-medium">
                                                                            {school.school_name}
                                                                            {school.education_level?.name ? ` - ${school.education_level?.level}` : ""}
                                                                        </span>
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="px-4 pb-4 pt-2">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-gray-400">Nama Sekolah</p>
                                                                            <p className="font-medium">{school.school_name}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-gray-400">Tingkat Sekolah</p>
                                                                            <p className="font-medium">{school.education_level?.name}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-gray-400">Jenis Sekolah</p>
                                                                            <p className="font-medium">{school.school_type?.name}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-gray-400">NPSN Sekolah</p>
                                                                            <p className="font-medium">{school.npsn || "-"}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-gray-400">Tahun Lulus</p>
                                                                            <p className="font-medium">{school.graduation_year}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1 mt-4">
                                                                        <p className="text-sm text-gray-400">Alamat Sekolah</p>
                                                                        <p className="font-medium">{school.address_name || "-"}</p>
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>


                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Family Tab */}
                                        <TabsContent value="family">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Data Keluarga</CardTitle>
                                                    <CardDescription>Informasi keluarga siswa (orang tua dan wali)</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <Alert className="mb-4">
                                                        <AlertDescription className="flex items-center gap-2">
                                                            <User className="h-4 w-4" />
                                                            <span>Data anggota keluarga siswa, termasuk kontak utama dan kontak darurat.</span>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Accordion
                                                        type="multiple"
                                                        className="w-full"
                                                        defaultValue={data?.parents.map((member: Parent) => member.id)}
                                                    >
                                                        {data?.parents.map((member: Parent) => (
                                                            <AccordionItem
                                                                key={member.id}
                                                                value={member.id}
                                                                className="border rounded-lg mb-4 overflow-hidden"
                                                            >
                                                                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge
                                                                            variant={member.is_main_contact ? "default" : "outline"}
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <User className="h-3 w-3" />
                                                                            <span>{member.parent_type}</span>
                                                                        </Badge>
                                                                        <span className="font-medium">{member.full_name}</span>
                                                                        {member.is_main_contact && (
                                                                            <Badge variant="secondary" className="ml-2">
                                                                                Kontak Utama
                                                                            </Badge>
                                                                        )}
                                                                        {member.is_emergency_contact && (
                                                                            <Badge variant="outline" className="ml-2">
                                                                                Kontak Darurat
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="px-4 pb-4 pt-2">
                                                                    <div className="mt-4">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                            <Card className="border-dashed">
                                                                                <CardHeader className="p-4 pb-2">
                                                                                    <CardTitle className="text-base flex items-center gap-2">
                                                                                        <User className="h-4 w-4" />
                                                                                        Data Pribadi
                                                                                    </CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="p-4 pt-0 space-y-4">
                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Nomor KTP/Identitas</p>
                                                                                        <p className="font-medium">{member.nik || "-"}</p>
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Alamat</p>
                                                                                        <p className="font-medium">{member.address || "-"}</p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>

                                                                            <Card className="border-dashed">
                                                                                <CardHeader className="p-4 pb-2">
                                                                                    <CardTitle className="text-base flex items-center gap-2">
                                                                                        <Briefcase className="h-4 w-4" />
                                                                                        Pekerjaan & Pendidikan
                                                                                    </CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="p-4 pt-0 space-y-4">
                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Pendidikan Terakhir</p>
                                                                                        <p className="font-medium">{member.education_level?.name || "-"}</p>
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Pekerjaan</p>
                                                                                        <p className="font-medium">{member.occupation || "-"}</p>
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Penghasilan per Bulan</p>
                                                                                        <p className="font-medium">
                                                                                            {member.income_range?.name ?? "-"}
                                                                                        </p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>

                                                                        <Card className="border-dashed mt-4">
                                                                            <CardHeader className="p-4 pb-2">
                                                                                <CardTitle className="text-base flex items-center gap-2">
                                                                                    <Phone className="h-4 w-4" />
                                                                                    Kontak
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent className="p-4 pt-0">
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Nomor Telepon</p>
                                                                                        <p className="font-medium">{member.phone}</p>
                                                                                    </div>

                                                                                    <div className="space-y-1">
                                                                                        <p className="text-sm text-gray-400">Email</p>
                                                                                        <p className="font-medium">{member.email || "-"}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Documents Tab */}
                                        <TabsContent value="documents">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Dokumen Pendukung</CardTitle>
                                                    <CardDescription>Dokumen-dokumen pendukung siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <Alert className="mb-4">
                                                        <AlertDescription className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            <span>Dokumen pendukung seperti akta kelahiran, kartu keluarga, rapor, dan dokumen lainnya.</span>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium">Dokumen yang Diunggah</h3>
                                                        {data?.documents?.length === 0 ? (
                                                            <div className="text-center py-8 border rounded-lg border-dashed">
                                                                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                                                <p className="text-muted-foreground">Belum ada dokumen yang diunggah</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {data?.documents?.map((doc: DocumentStudent) => (
                                                                    <Card key={doc.id} className="overflow-hidden">
                                                                        <CardContent className="p-0">
                                                                            <div className="flex items-center p-4">
                                                                                <div className="mr-4">
                                                                                    <FileText className="h-8 w-8 text-primary" />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <p className="font-medium truncate">{doc.file_name}</p>
                                                                                        <Badge variant="outline" className="ml-2">
                                                                                            {doc.document_type?.name === "akta_kelahiran" && "Akta Kelahiran"}
                                                                                            {doc.document_type?.name === "kartu_keluarga" && "Kartu Keluarga"}
                                                                                            {doc.document_type?.name === "rapor" && "Rapor"}
                                                                                            {doc.document_type?.name === "ijazah" && "Ijazah"}
                                                                                            {doc.document_type?.name === "ktp_orangtua" && "KTP Orang Tua"}
                                                                                            {doc.document_type?.name === "surat_keterangan" && "Surat Keterangan"}
                                                                                            {doc.document_type?.name === "sertifikat" && "Sertifikat Prestasi"}
                                                                                            {doc.document_type?.name === "lainnya" && "Dokumen Lainnya"}
                                                                                        </Badge>
                                                                                        {/* <Badge
                                                                                            variant={
                                                                                                doc.status === "verified"
                                                                                                    ? "default"
                                                                                                    : doc.status === "rejected"
                                                                                                        ? "destructive"
                                                                                                        : "secondary"
                                                                                            }
                                                                                            className="ml-2"
                                                                                        >
                                                                                            {doc.status === "verified" && "Terverifikasi"}
                                                                                            {doc.status === "rejected" && "Ditolak"}
                                                                                            {doc.status === "pending" && "Menunggu Verifikasi"}
                                                                                        </Badge> */}
                                                                                    </div>
                                                                                    {
                                                                                        doc.created_at && (
                                                                                            <div className="flex text-sm text-gray-400">
                                                                                                <span className="mr-4">{new Intl.DateTimeFormat('id-ID', {
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: 'numeric',
                                                                                                }).format(new Date(doc?.created_at ?? ""))}</span>

                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                                <div className="flex space-x-2">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => { }}
                                                                                        title="Lihat"
                                                                                    >
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Button>
                                                                                    {/* <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => window.open(doc.file, "_blank")}
                                                                                        title="Unduh"
                                                                                    >
                                                                                        <Download className="h-4 w-4" />
                                                                                    </Button> */}
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Additional Information Tab */}
                                        <TabsContent value="additional">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Informasi Tambahan</CardTitle>
                                                    <CardDescription>Informasi tambahan yang relevan untuk siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-medium">Kondisi Kesehatan</h3>
                                                        <p>{data?.health_condition || "-"}</p>
                                                    </div>


                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-medium">Hobi dan Minat</h3>
                                                        <p>{data?.hobby || "-"}</p>
                                                    </div>


                                                    <Separator />
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Class History Tab */}
                                        <TabsContent value="class-history">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Riwayat Kelas</CardTitle>
                                                    <CardDescription>Riwayat kelas yang pernah diikuti oleh siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <Alert className="mb-4">
                                                        <AlertDescription className="flex items-center gap-2">
                                                            <School className="h-4 w-4" />
                                                            <span>Riwayat kelas yang pernah diikuti oleh siswa selama bersekolah di sini.</span>
                                                        </AlertDescription>
                                                    </Alert>

                                                    {data?.class_memberships && data?.class_memberships.length > 0 ? (
                                                        <div className="space-y-4">
                                                            <div className="border rounded-md">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Tahun Ajaran</TableHead>
                                                                            <TableHead>Kelas</TableHead>
                                                                            <TableHead>Wali Kelas</TableHead>
                                                                            <TableHead>Tanggal Mulai</TableHead>
                                                                            <TableHead>Tanggal Selesai</TableHead>
                                                                            <TableHead>Status</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {data?.class_memberships.map((history: ClassMembership) => (
                                                                            <TableRow key={history.id}>
                                                                                <TableCell className="font-medium">{history.student_class?.academic_year ?? "-"}</TableCell>
                                                                                <TableCell>{`${history.student_class?.name ?? "-"} (${history.student_class?.part ?? "-"})`}</TableCell>
                                                                                <TableCell>{history.student_class?.teacher?.name ?? "-"}</TableCell>
                                                                                <TableCell>{new Intl.DateTimeFormat('id-ID', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric',
                                                                                }).format(new Date(history.start_at ?? ""))}</TableCell>
                                                                                <TableCell>{history.end_at ? new Intl.DateTimeFormat('id-ID', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric',
                                                                                }).format(new Date(history.end_at ?? "")) : "-"}</TableCell>
                                                                                <TableCell>
                                                                                    <Badge variant={history.end_at ? "secondary" : "default"}>
                                                                                        {history.end_at ? "Selesai" : "Aktif"}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 border rounded-lg border-dashed">
                                                            <School className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                                            <p className="text-muted-foreground">Belum ada riwayat kelas</p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Payment History Tab */}
                                        <TabsContent value="invoices">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Riwayat Tagihan</CardTitle>
                                                    <CardDescription>Riwayat pembayaran dan tagihan siswa</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    {/* Payment Statistics */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <Card>
                                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                                <Receipt className="h-8 w-8 text-gray-500 mb-2" />
                                                                <p className="text-sm text-gray-500">Total Tagihan</p>
                                                                <p className="text-xl font-bold">{totalInvoices}</p>
                                                                <p className="text-sm font-medium">{formatCurrency(totalAmount)}</p>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                                                <p className="text-sm text-gray-500">Lunas</p>
                                                                <p className="text-xl font-bold">{paidInvoices}</p>
                                                                <p className="text-sm font-medium">{formatCurrency(paidAmount)}</p>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                                <Clock className="h-8 w-8 text-amber-500 mb-2" />
                                                                <p className="text-sm text-gray-500">Menunggu</p>
                                                                <p className="text-xl font-bold">{pendingInvoices}</p>
                                                                <p className="text-sm font-medium">{formatCurrency(pendingAmount)}</p>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                                <XCircle className="h-8 w-8 text-red-500 mb-2" />
                                                                <p className="text-sm text-gray-500">Terlambat</p>
                                                                <p className="text-xl font-bold">{overdueInvoices}</p>
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    {/* Payment History Table */}
                                                    <div>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>No. Invoice</TableHead>
                                                                    <TableHead>Deskripsi</TableHead>
                                                                    <TableHead>Jumlah</TableHead>
                                                                    <TableHead>Jatuh Tempo</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Tanggal Bayar</TableHead>
                                                                    {/* <TableHead>Metode</TableHead> */}
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {data.invoices && data.invoices.length > 0 ? (
                                                                    data.invoices.map((payment: Invoice) => (
                                                                        <TableRow key={payment.id}>
                                                                            <TableCell className="font-medium">{payment.code}</TableCell>
                                                                            <TableCell>{payment.notes}</TableCell>
                                                                            <TableCell>{formatCurrency(payment.total)}</TableCell>
                                                                            <TableCell>{new Date(payment.due_date).toLocaleDateString('id-ID', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                            })}</TableCell>
                                                                            <TableCell>
                                                                                <Badge
                                                                                    variant={
                                                                                        payment.status === "Lunas"
                                                                                            ? "default"
                                                                                            : payment.status === "Terlambat"
                                                                                                ? "destructive"
                                                                                                : "secondary"
                                                                                    }
                                                                                >
                                                                                    {payment.status === "Lunas" && "Lunas"}
                                                                                    {payment.status === "Menunggu Pembayaran" && "Menunggu"}
                                                                                    {payment.status === "Terlambat" && "Terlambat"}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell>{new Date(payment.publication_date).toLocaleDateString('id-ID', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                            })}</TableCell>
                                                                            {/* <TableCell>{payment. || "-"}</TableCell> */}
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={7} className="text-center py-4">
                                                                            Tidak ada riwayat pembayaran
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>

        </BaseLayout>

    )
}
