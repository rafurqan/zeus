import { Invoice } from "../types/invoice";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export const InvoiceTable = ({ invoices }: InvoiceTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lunas":
        return "bg-green-100 text-green-800";
      case "Terlambat":
        return "bg-red-100 text-red-800";
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-black-100 text-black-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-black-200">
        <thead className="bg-black-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Siswa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Kelas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Deskripsi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Jatuh Tempo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-black-200">
          {invoices?.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {invoice.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {invoice.entity?.full_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {invoice.student_class?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {invoice.notes}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                Rp {invoice.total?.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {new Date(invoice.due_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                {/* Aksi buttons */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};