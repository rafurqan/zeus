import { useState } from "react";
import { useMessageTemplate } from "../hook/useMessageTemplate";
import MessageTemplateTable from "../components/MessageTemplateTable";
import BaseLayout from "@/core/components/baseLayout";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Button } from "@/core/components/ui/button";
import { MessageTemplate } from "../types/messageTemplate";
import MessageTemplateForm from "../forms/MessageTemplateForm";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog";

export default function MessageTemplatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MessageTemplate | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data,
    loading,
    loadingOverlay,
    error,
    create,
    update,
    remove,
    page,
    setPage,
    lastPage,
    meta,
  } = useMessageTemplate(debouncedSearchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search term
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: MessageTemplate) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (item: MessageTemplate) => {
    if (item.id) {
      remove(item.id);
    }
  };

  const handleSubmit = async (data: MessageTemplate) => {
    if (selectedItem && selectedItem.id) {
      await update({ ...data, id: selectedItem.id });
    } else {
      await create(data);
    }
    setShowModal(false);
  };

  return (
    <BaseLayout>
      <div className="flex min-h-screen"> 
        <div className="flex-1 w-full"> 
          <main className="p-4"> 
            {loadingOverlay && <LoadingOverlay />}
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4"> 
              <div> 
                <h2 className="text-2xl font-bold">Template Pesan</h2> 
                <h2 className="text-gray-500"> 
                  Kelola template pesan yang tersedia di sekolah
                </h2>
              </div>
              <Button onClick={handleAddNew} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"> 
                <span>Tambah Template</span>
                <FaPlus className="h-4 w-4" /> 
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4"> 
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari template..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Table with Background */}
            <div className="bg-white p-4 rounded-lg shadow">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              ) : (
                <>
                  <MessageTemplateTable
                    items={data}
                    onDeleted={handleDelete}
                    onEdit={handleEdit}
                    currentPage={page}
                    totalPages={lastPage}
                    onPageChange={setPage}
                    meta={meta}
                  />

                  {/* Show "No results" message when filtered */}
                  {!loading && !error && data.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Tidak ada data yang sesuai dengan pencarian.
                      </p>
                    </div>
                  )}

                  {/* Pagination Info */}
                  {meta && data.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{((page - 1) * 10) + 1}</span>
                        {' '}sampai <span className="font-medium">{Math.min(page * 10, meta.total || 0)}</span>
                        {' '}dari <span className="font-medium">{meta.total || 0}</span> hasil
                        {debouncedSearchTerm && (
                          <span className="text-gray-500">
                            {' '}(difilter berdasarkan "{debouncedSearchTerm}")
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal for Create/Edit using Dialog component */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedItem ? "Edit Template Pesan" : "Tambah Template Pesan"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedItem 
                      ? "Lakukan perubahan pada template pesan" 
                      : "Tambahkan template pesan baru ke dalam sistem"}
                  </DialogDescription>
                </DialogHeader>
                <MessageTemplateForm
                  onSubmit={handleSubmit}
                  initialData={selectedItem || undefined}
                  onCancel={() => setShowModal(false)}
                />
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </BaseLayout>
  );
}