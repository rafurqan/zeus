import { ProspectiveStudent } from "../types/prospective-student";
import ProspectiveStudentRow from "./prospectiveStudentRow";

type Props = {
    items: ProspectiveStudent[];
    onDeleted: () => void;
    onEdit: (item: ProspectiveStudent) => void;
};

export default function ProspectiveStudentTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-black">
                <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Nomor Registrasi</th>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">Nama Orang Tua</th>
                        <th className="px-4 py-2 text-center">Kota</th>
                        <th className="px-4 py-2 text-center">Kontak</th>
                        <th className="px-4 py-2 text-center">Tanggal Daftar</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Dokumen</th>
                        <th className="px-4 py-2 text-center">Total Tagihan</th>
                        <th className="px-4 py-2 text-center">Status Pembayaran</th>
                        <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item,index) => (
                        <ProspectiveStudentRow
                            key={item.id}
                            item={item}
                            index={index+1}
                            onDeleted={onDeleted}
                            onEdit={onEdit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
