import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { Button } from "@/core/components/ui/button";
import { billingService } from "@/feature/billing/service/billingService";
import { packageService } from "@/feature/billing/service/packageService";
import BaseLayout from "@/core/components/baseLayout";
import { Billing } from "@/feature/billing/types/billing";
import { RatePackage } from "@/feature/billing/types/ratePackage";
import { Trash2, Search} from "lucide-react";
import { useConfirm } from "@/core/components/confirmDialog";
import { invoiceService } from "../service/invoiceService";
import { useStudentClass } from "@/feature/student/hooks/useStudentClass";


export const CreateInvoiceForm = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { token } = useContext(AppContext);
  const { data: classes = [], loading: classesLoading } = useStudentClass();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [form, setForm] = useState({
    invoice_number: "",
    student_name: "",
    entity_id: "",
    entity_type: "",
    class: "",
    class_name: "",
    issue_date: "",
    due_date: "",
    notes: "",
    invoice_type: "",
    selected_items: [] as Billing[],
  });

  const [selectedTab, setSelectedTab] = useState("package");
  const [billings, setBillings] = useState<Billing[]>([]);
  const [packages, setPackages] = useState<RatePackage[]>([]);
  const [searchTermPackage, setSearchTermPackage] = useState("");
  const [searchTermBilling, setSearchTermBilling] = useState("");
  const [addedItemIds, setAddedItemIds] = useState<number[]>([]);
  const [, setAddedPackageIds] = useState<number[]>([]);
  const [, setItemFrequencies] = useState<Record<number, number>>({});
  const [studentList, setStudentList] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
      try {
        const [billingData, packageData] = await Promise.all([
          billingService.getAll(token as any),
          packageService.getAll(token as any),
        ]);
        setBillings(billingData);
        setPackages(packageData);
      } catch (error) {
        console.error("Gagal memuat data tagihan dan paket:", error);
      }
    };

    fetchData();
  }, [token]);

  const fetchStudents = async (keyword: string) => {
    try {
      const students = await invoiceService.getStudents(token as any, keyword);
      setStudentList(students);
    } catch (error) {
      console.error("Gagal fetch student", error);
    }
  };

  const handleAddPackage = (pkg: RatePackage) => {
    if (pkg.child_rates && pkg.child_rates.length > 0) {
      setForm(prevForm => {
        const existingItems = [...prevForm.selected_items];
        
        pkg.child_rates?.forEach(child => {
          const existingItemIndex = existingItems.findIndex(item => item.id === child.id);
          
          if (existingItemIndex !== -1) {
            existingItems[existingItemIndex] = {
              ...existingItems[existingItemIndex],
              frequency: (existingItems[existingItemIndex].frequency || 1) + 1
            };
          } else {
            existingItems.push({ ...child, frequency: 1, nama_tarif: child.service_name || '' });
          }
        });

        return {
          ...prevForm,
          selected_items: existingItems
        };
      });
      
      setAddedPackageIds(prev => [...prev, Number(pkg.id)]);
      
      pkg.child_rates.forEach(child => {
        if (!addedItemIds.includes(Number(child.id))) {
          setAddedItemIds(prev => [...prev, Number(child.id)]);
        }
      });
    }
  };

  const handleAddItem = (item: Billing) => {
    const itemId = item.id.toString();
    const existing = form.selected_items.find(i => i.id.toString() === itemId);

    if (existing) {
      setForm(prevForm => ({
        ...prevForm,
        selected_items: prevForm.selected_items.map(i =>
          i.id.toString() === itemId ? { ...i, frequency: (i.frequency || 1) + 1 } : i
        )
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        selected_items: [...prevForm.selected_items, { ...item, frequency: 1 }]
      }));
      setAddedItemIds(prev => [...prev, Number(item.id)]);
    }
  };
  
  // const increaseFrequency = (id: string | number) => {
  //   const stringId = id.toString();
    
  //   setForm(prevForm => ({
  //     ...prevForm,
  //     selected_items: prevForm.selected_items.map(item =>
  //       item.id.toString() === stringId ? { ...item, frequency: item.frequency + 1 } : item
  //     )
  //   }));
  // };
  
  const decreaseFrequency = (id: string | number) => {
    const stringId = id.toString();
    const item = form.selected_items.find(item => item.id.toString() === stringId);
    if (!item) return;

    if (item.frequency <= 1) {
      handleRemoveItem(id);
    } else {
      setForm(prevForm => ({
        ...prevForm,
        selected_items: prevForm.selected_items.map(i =>
          i.id.toString() === stringId ? { ...i, frequency: i.frequency - 1 } : i
        )
      }));
    }
  };

  const handleRemoveItem = (id: string | number) => {
    const stringId = id.toString();
    
    setItemFrequencies(prev => {
      const current = prev[Number(id)] || 1;
      const next = Math.max(current - 1, 0);
      const updated = { ...prev, [Number(id)]: next };

      if (next === 0) {
        setForm(prevForm => ({
          ...prevForm,
          selected_items: prevForm.selected_items.filter(i => i.id.toString() !== stringId)
        }));
        setAddedItemIds(prev => prev.filter(i => i.toString() !== stringId));
        delete updated[Number(id)];
      }

      return updated;
    });
  };
  
  const filteredPackages = packages.filter(pkg =>
    pkg.service_name?.toLowerCase().includes(searchTermPackage.toLowerCase())
  );
  
  const filteredBillings = billings.filter(bill =>
    bill.service_name?.toLowerCase().includes(searchTermBilling.toLowerCase()) ||
    bill.description?.toLowerCase().includes(searchTermBilling.toLowerCase())
  );
  // end

  const handleCancel = async () => {
    const isConfirmed = await confirm({
      title: "Konfirmasi Batal",
      message: "Formulir akan di-reset. Yakin ingin kembali?",
      confirmText: "Ya, Lanjutkan",
      cancelText: "Tidak",
    });
    if (isConfirmed) {
      window.history.back();
    }
  };

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const selectedClass = classes.find(c => c.id === e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      class_name: selectedClass ? selectedClass.name : ""
    });
  };

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (invoiceId && token) {
        try {
          const invoiceData = await invoiceService.showDataById(invoiceId, token);
          if (invoiceData) {
            const formatDate = (dateString: string | null) => {
              if (!dateString) return "";
              return dateString.split(' ')[0];
            };
  
            // Rebuild selected_items from invoice.items
            const selectedItemsFromItems = (invoiceData as any).items?.map((item: { rate: { id: number; service: { id: number; name: string; }; category: string; description: string; }; amount_rate: number; frequency: number; }) => ({
              id: item.rate.id, // for React key
              rate_id: item.rate.id,
              service_id: item.rate.service.id,
              service_name: item.rate.service.name,
              category: item.rate.category,
              description: item.rate.description,
              price: item.amount_rate,
              frequency: item.frequency,
            }));
  
            setForm({
              ...form,
              invoice_number: invoiceData.code,
              student_name: (invoiceData as any).entity?.full_name || "",
              class: (invoiceData as any).student_class?.id || "",
              class_name: (invoiceData as any).student_class?.name || "",
              issue_date: formatDate((invoiceData as any).publication_date),
              due_date: formatDate((invoiceData as any).due_date),
              notes: invoiceData.notes || "",
              invoice_type: (invoiceData as any).invoice_type || "",
              selected_items: selectedItemsFromItems,
            });
  
            // Set item frequencies dari items
            const frequencies: Record<string, number> = {};
            (invoiceData as any).items?.forEach((item: { rate_id: number; frequency: number; }) => {
              if (item.rate_id) {
                frequencies[item.rate_id] = item.frequency;
              }
            });
            setItemFrequencies(frequencies);
  
            // Set added item IDs
            const itemIds = (invoiceData as any).items?.map((item: { rate_id: number; }) => item.rate_id);
            setAddedItemIds(itemIds);
          }
        } catch (error) {
          console.error("Gagal memuat data invoice:", error);
          alert("Gagal memuat data invoice");
        }
      }
    };
  
    fetchInvoiceData();
  }, [invoiceId, token]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (invoiceId) {
        await invoiceService.update(token as string, {
          id: invoiceId,
          ...form,
          due_date: new Date(form.due_date),
          publication_date: new Date(form.issue_date),
        });

        await confirm({
          title: "Success",
          message: "Invoice Berhasil Diupdate!",
          confirmText: "OK",
          cancelText: "",
        });

        setTimeout(() => {
          navigate('/finance/billingData');
        }, 1000);
      } else {
        await invoiceService.create(token as string, {
          ...form,
          due_date: new Date(form.due_date),
          publication_date: new Date(form.issue_date),
        });

        await confirm({
          title: "Success",
          message: "Invoice Berhasil Dibuat!",
          confirmText: "OK",
          cancelText: "",
        });

        setTimeout(() => {
          navigate('/finance/billingData');
        }, 1000);
      }
    } catch (error) {
      console.error("Gagal menyimpan invoice:", error);

      await confirm({
        title: "Error",
        message: "Failed to save invoice. Please try again.",
        confirmText: "OK",
        cancelText: "",
      });
    }
  };

  return (
    <BaseLayout>
      <div className="p-6 flex flex-col gap-6">
        <div
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 cursor-pointer mb-2 hover:underline"
        >
          &larr; Kembali
        </div>
        <div>
          <h2 className="text-2xl font-bold">{invoiceId ? 'Edit Invoice' : 'Buat Invoice Baru'}</h2>
          <p className="text-gray-500">Masukkan informasi dasar untuk invoice ini</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kiri: Form */}
          <div className="md:col-span-2 space-y-4">
            <FormInput 
              label="Nomor Invoice"
              name="invoice_number" 
              value={form.invoice_number}
              onChange={() => {}}
              placeholder="Akan di generate secara otomatis"
            />

            <FormSelect
                label="Kelas"
                name="class"
                value={form.class}
                onChange={handleChange}
                options={classes.map((classItem) => ({
                  label: `${classItem.name} ${classItem.part} - ${classItem.teacher?.name ?? ""}`,
                  value: classItem.id
                }))}
                disabled={classesLoading}
              />

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cari Siswa (NIS/Nama)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari berdasarkan NIS atau nama"
                  value={form.student_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, student_name: value });
                    if (value.length >= 2) {
                      fetchStudents(value);
                      setShowDropdown(true);
                    } else {
                      setShowDropdown(false);
                    }
                  }}
                />
              </div>

              {/* Dropdown */}
              {showDropdown && studentList.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow mt-1 max-h-60 overflow-y-auto">
                  {studentList.map((student) => (
                    <li
                      key={student.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setForm({
                          ...form,
                          student_name: student.full_name,
                          entity_id: student.id,
                          entity_type: "student",
                        });
                        setShowDropdown(false);
                      }}
                    >
                      {student.full_name} ({student.registration_code})
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <FormSelect
              label="Jenis Tagihan"
              name="invoice_type" 
              value={form.invoice_type}
              onChange={handleChange}
              options={[
                { label: "Satu Kali", value: "1", selected: form.invoice_type === "1" },
                { label: "Per Semester", value: "2", selected: form.invoice_type === "2" },
                { label: "Tahunan", value: "3", selected: form.invoice_type === "3" }
              ].map(option => ({
                ...option,
                selected: option.value === form.invoice_type
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Tanggal Penerbitan" 
                type="date" 
                value={invoiceId ? form.issue_date : (form.issue_date || (() => {
                  const today = new Date().toISOString().split('T')[0];
                  setForm(prev => ({...prev, issue_date: today}));
                  return today;
                })())}
                onChange={(e) => setForm({ ...form, issue_date: e.target.value })} 
              />
              <FormInput 
                label="Tanggal Jatuh Tempo" 
                type="date" 
                value={form.due_date} 
                onChange={(e) => setForm({ ...form, due_date: e.target.value })} 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Catatan (Opsional)</label>
              <textarea
                className="min-h-[100px] w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan catatan tambahan untuk invoice ini"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Kanan: Item Tagihan */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Tambah Item Tagihan</h3>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList>
                <TabsTrigger value="package">Paket Tagihan</TabsTrigger>
                <TabsTrigger value="individual">Item Individual</TabsTrigger>
                </TabsList>

                {/* Paket Tagihan */}
                <TabsContent value="package" className="mt-2 space-y-2">
                <FormInput
                    label= "paket"
                    placeholder="Cari paket..."
                    value={searchTermPackage}
                    onChange={(e) => setSearchTermPackage(e.target.value)}
                /> <br />
                <div className="space-y-2 overflow-y-auto pr-1 max-h-[400px]">
                {filteredPackages.map(pkg => (
                  <div key={pkg.id} className="border p-2 rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{pkg.service_name}</p>
                        <p className="text-sm text-gray-500">{pkg.description}</p>
                      </div>
                      <Button size="sm" className="rounded-lg" variant="outline" onClick={() => handleAddPackage(pkg)}>Tambah</Button>
                    </div>

                    {/* Daftar Tarif Anakan */}
                    {pkg.child_rates && pkg.child_rates.length > 0 && (
                      <div className="pl-2 mt-1 border-l border-gray-300 space-y-1">
                        {pkg.child_rates.map(child => {
                          return (
                            <div key={child.id} className="flex justify-between items-center text-sm text-gray-700">
                              <span>- {child.service_name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                </div>
                </TabsContent>

                {/* Item Individual */}
                <TabsContent value="individual" className="mt-2 space-y-2">
                <FormInput
                    label= "item"
                    placeholder="Cari item..."
                    value={searchTermBilling}
                    onChange={(e) => setSearchTermBilling(e.target.value)}
                /> <br />
                <div className="space-y-2 overflow-y-auto pr-1 max-h-[400px]">
                    {filteredBillings.map(item => (
                    <div key={item.id} className="border p-2 rounded flex justify-between items-center">
                        <div>
                        <p className="font-semibold">{item.service_name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-sm">Rp {item.price.toLocaleString()}</p>
                        </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleAddItem(item)}
                          >Tambah</Button>
                    </div>
                    ))}
                </div>
                </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Item Tagihan yang Ditambahkan */}
        <div className="bg-white border rounded p-4">
          <h3 className="text-xl font-bold mb-1">Item Tagihan</h3>
          <p className="text-gray-500 mb-4">Tambahkan item tagihan ke invoice ini</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                  <tr className="text-left text-sm text-gray-500">
                  <th className="px-2 py-1">Item</th>
                  <th className="px-2 py-1">Kategori</th>
                  <th className="px-2 py-1">Deskripsi</th>
                  <th className="px-2 py-1">Subtotal</th>
                  <th className="px-2 py-1">Frekuensi</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1 text-center">Aksi</th>
                  </tr>
              </thead>
              <tbody>
                  {form.selected_items.map(item => (
                  <tr key={item.id} className="bg-white rounded shadow-sm">
                      <td className="px-2 py-2">{item.service_name}</td>
                      <td className="px-2 py-2">
                        {item.category === "1" && "Registrasi"}
                        {item.category === "2" && "Buku"}
                        {item.category === "3" && "Seragam"}
                        {item.category === "4" && "SPP"}
                        {item.category === "5" && "Uang Gedung"}
                        {item.category === "6" && "Kegiatan"}
                        {item.category === "7" && "Ujian"}
                        {item.category === "8" && "Wisuda"}
                        {item.category === "9" && "Lainnya"}
                      </td>
                      <td className="px-2 py-2">{item.description}</td>
                      <td className="px-2 py-2 whitespace-nowrap">Rp {item.price.toLocaleString()}</td>
                      <td className="px-2 py-2 text-center">{item.frequency}</td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        Rp {(item.price * item.frequency).toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => decreaseFrequency(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                  </tr>
                  ))}
                  <tr>
                      <td colSpan={4}></td>
                      <td className="font-semibold text-right pr-2">Subtotal:</td>
                      <td className="text-left pr-2">
                          Rp {form.selected_items.reduce((sum, item) => sum + item.price * item.frequency, 0).toLocaleString()}
                      </td>
                  </tr>
                  <tr>
                      <td colSpan={4}></td>
                      <td className="font-bold text-right pr-2">Total: </td>
                      <td className="font-bold text-left pr-2">
                          Rp {form.selected_items.reduce((sum, item) => sum + item.price * item.frequency, 0).toLocaleString()}
                      </td>
                  </tr>
              </tbody>
              </table>
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
        >
          Batal
        </Button>
        <Button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            onClick={handleSubmit}
          >
            {invoiceId ? 'Update Invoice' : 'Simpan Invoice'}
          </Button>
        </div>
      </div>
      {ConfirmDialog}
    </BaseLayout>
  );
};
