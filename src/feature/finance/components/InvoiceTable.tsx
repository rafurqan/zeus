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
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Siswa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kelas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deskripsi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jatuh Tempo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.invoice_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {invoice.student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.student.class}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Rp {invoice.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.due_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-indigo-600 hover:text-indigo-900">...</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};