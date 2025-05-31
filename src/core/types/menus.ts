import { BookOpen, PersonStanding, Users } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";

export const menus = [
  {
    name: "Dashboard",
    icon: Users,
    path: "/dashboard",
    children: [],
  },
  {
    name: "Siswa",
    icon: PersonStanding,
    path: "/students",
    children: [
      { name: "Calon Siswa", path: "/students/prospective" },
      { name: "Siswa", path: "/students/student" },
      { name: "Kelas", path: "/students/classes" },
    ],
  },
  {
    name: "Master Data",
    icon: BookOpen,
    path: "/master",
    children: [
      { name: "Riwayat Pendidikan", path: "/master/education-levels" },
      { name: "Guru", path: "/master/teachers" },
      { name: "Data Penagihan", path: "/master/billing" },
      // { name: "Tipe Dokumen", path: "/master/document-types" },
      // { name: "Tipe Sekolah", path: "/master/school-types" },
    ],
  },
  {
    name: "Keuangan",
    icon: FaMoneyBill,
    path: "/finance",
    children: [{ name: "Transaksi", path: "/finance/transactions" }],
  },
];
