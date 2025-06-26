import { listNationality, listReligion, listSpecialNeed, listTransporatationMode, listCity, listProvince, listSpecialCondition, listSubDistrict, listVillage } from "@/core/service/master";
import BaseLayout from "@/core/components/baseLayout";
import { AppContext } from "@/context/AppContext";
import { MasterData } from "@/core/types/master-data";
import { useContext, useEffect, useRef, useState } from "react";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { useConfirm } from "@/core/components/confirmDialog";
import { AxiosError } from "axios";
import { updateStudent } from "@/feature/prospective-student/service/prospectiveStudentService";
import { useLocation, useNavigate } from "react-router-dom";
import { FormSelect } from "@/core/components/forms/formSelect";
import { FormInput } from "@/core/components/forms/formInput";
import { Province } from "@/core/types/province";
import { City } from "@/core/types/city";
import { Village } from "@/core/types/village";
import { SubDistrict } from "@/core/types/sub-district";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useGetRegistrationCode } from "@/feature/prospective-student/hooks/useGetRegistrationCode";
import { DocumentStudent } from "@/feature/prospective-student/types/document-student";
import { OriginSchool } from "@/feature/prospective-student/types/origin-school";
import { Parent } from "@/feature/prospective-student/types/parent";
import { Student } from "../types/student";
import TableOriginSchool from "@/feature/prospective-student/components/originSchoolTable";
import TableDocument from "@/feature/prospective-student/components/documentTable";
import StudentDocumentForm from "@/feature/prospective-student/forms/document";
import ParentTable from "@/feature/prospective-student/components/parentTable";
import StudentParentForm from "@/feature/prospective-student/forms/parent";
import StudentOriginSchoolForm from "@/feature/prospective-student/forms/originSchool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";



export default function UpdateStudentPage() {
    const location = useLocation();
    const { item } = location.state || {};
    const isEdit = !!item;
    const navigate = useNavigate();

    const { token, setUser } = useContext(AppContext);
    const { confirm, ConfirmDialog } = useConfirm();
    const [religionTypes, setReligionTypes] = useState<MasterData[]>([]);
    const [specialConditions, setSpecialConditions] = useState<MasterData[]>([]);
    const [nationalities, setNationalities] = useState<MasterData[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [transportationModes, setTransportationModes] = useState<MasterData[]>([]);
    const [specialNeeds, setSpecialNeeds] = useState<MasterData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DocumentStudent | null>(null);
    const [selectedOriginSchool, setSelectedOriginSchool] = useState<OriginSchool | null>(null);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(item?.photo_url ?? null);
    const {
        data: registrationCode,
        loading: registrationCodeLoading,
        getRegistrationCode: getRegistrationCode,
    } = useGetRegistrationCode();




    const [form, setForm] = useState<Student>(item || {
        id: "",
        additional_information: "",
        full_name: "",
        file: null,
        has_kps: false,
        nickname: "",
        email: "",
        phone: "",
        street: "",
        nisn: "",
        gender: "",
        birth_date: "",
        birth_place: "",
        child_order: 0,
        family_status: "",
        document_status: "",
        photo_filename: null,
        health_condition: "",
        hobby: "",
        has_kip: false,
        eligible_for_kip: false,
        created_at: "",
        updated_at: null,
        created_by_id: "",
        updated_by_id: null,
        special_need: null,
        religion: null,
        transportation_mode: null,
        documents: [],
        addresses: [],
        village: null,
        registration_code: "REG-0002",
        status: "",
        photo_url: null,
        special_condition: null,
        nationality: null,
        origin_schools: [],
        contacts: [],
        parents: [],
    });

    useEffect(() => {
        if (token) {
            if (!isEdit) {
                getRegistrationCode();
            }
            fetchReligionTypes();
            fetchTransportationModes();
            fetchSpecialConditions();
            fetchSpecialNeeds();
            fetchProvinces();
            fetchNationalities();
        }
    }, []);

    useEffect(() => {
        if (registrationCode) {
            setForm((prev) => ({
                ...prev,
                registration_code: registrationCode.registration_code,
            }));
        }
    }, [registrationCode]);

    useEffect(() => {
        if (item) {
            setForm(structuredClone(item));
            if (item?.village?.sub_district?.city?.province?.id) {
                fetchProvinces();
                setSelectedProvince(item?.village?.sub_district?.city?.province?.id);
            }
            if (item?.village?.sub_district?.city?.id) {
                fetchCities(item?.village?.sub_district?.city?.province?.id);
                setSelectedCity(item?.village?.sub_district?.city?.id);
            }
            if (item?.village?.sub_district?.id) {
                fetchSubDistrict(item?.village?.sub_district?.city?.id);
                setSelectedSubDistrict(item?.village?.sub_district?.id)
            }

            if (item?.village?.id) {
                fetchVillage(item?.village?.sub_district?.id);
            }
        }
    }, []);


    useEffect(() => {
        if (item?.file_url) {
            setPreview(item?.file_url);
        }
    }, [item?.file_url]);




    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            setForm({ ...form, file: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedCity("");
        setSelectedSubDistrict("");
        setForm({ ...form, village: null });
        fetchCities(provinceId);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setSelectedSubDistrict("");
        setForm({ ...form, village: null });
        fetchSubDistrict(cityId);
    };


    const handleSubDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedSubDistrict(id);
        setForm({ ...form, village: null });
        fetchVillage(id);
    };

    const handleVillageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = villages.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };


    const handleReligionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = religionTypes.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleNationalityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = nationalities.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleSpecialNeedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = specialNeeds.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleSpecialConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = specialConditions.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleTransportationModeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = transportationModes.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleAddDocument = (newDocument: DocumentStudent) => {
        setForm((prev) => ({
            ...prev,
            documents: [...(prev.documents || []), newDocument],
        }));
    };

    const handleUpdateDocument = (newDocument: DocumentStudent) => {
        setForm((prev) => ({
            ...prev,
            documents: (prev.documents || []).map((doc) => doc === selectedItem ? newDocument : doc),
        }));
    };


    const handleRemoveDocument = (item: DocumentStudent) => {
        setForm((prev) => ({
            ...prev,
            documents: (prev.documents || []).filter((doc) => doc !== item),
        }));
    };

    const handleAddOriginSchool = (value: OriginSchool) => {
        setForm((prev) => ({
            ...prev,
            origin_schools: [...(prev.origin_schools || []), value],
        }));
    };

    const handleUpdateOriginSchool = (value: OriginSchool) => {
        setForm((prev) => ({
            ...prev,
            origin_schools: (prev.origin_schools || []).map((doc) => doc === selectedOriginSchool ? value : doc),
        }));
    };


    const handleRemoveOriginSchool = (item: OriginSchool) => {
        setForm((prev) => ({
            ...prev,
            origin_schools: (prev.origin_schools || []).filter((doc) => doc !== item),
        }));
    };

    const handleAddParent = (newParent: Parent) => {
        setForm((prev) => ({
            ...prev,
            parents: [...(prev.parents || []), newParent],
        }));
    };

    const handleUpdateParent = (newParent: Parent) => {
        setForm((prev) => ({
            ...prev,
            parents: (prev.parents || []).map((doc) => doc === selectedParent ? newParent : doc),
        }));
    };


    const handleRemoveParent = (item: Parent) => {
        setForm((prev) => ({
            ...prev,
            parents: (prev.parents || []).filter((doc) => doc !== item),
        }));
    };


    async function fetchSpecialConditions() {
        try {
            const res = await listSpecialCondition();
            if (res.status === 401) setUser(null);
            setSpecialConditions(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchProvinces() {
        try {
            const res = await listProvince();
            if (res.status === 401) setUser(null);
            setProvinces(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchNationalities() {
        try {
            const res = await listNationality();
            if (res.status === 401) setUser(null);
            setNationalities(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchCities(id: string) {
        try {
            const res = await listCity(id);
            if (res.status === 401) setUser(null);
            setCities(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchSubDistrict(id: string) {
        try {
            const res = await listSubDistrict(id);
            if (res.status === 401) setUser(null);
            setSubDistricts(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchVillage(id: string) {
        try {
            const res = await listVillage(id);
            if (res.status === 401) setUser(null);
            setVillages(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchSpecialNeeds() {
        try {
            const res = await listSpecialNeed();
            if (res.status === 401) setUser(null);
            setSpecialNeeds(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchReligionTypes() {
        try {
            const res = await listReligion();
            if (res.status === 401) setUser(null);
            setReligionTypes(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    async function fetchTransportationModes() {
        try {
            const res = await listTransporatationMode();
            if (res.status === 401) setUser(null);
            setTransportationModes(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
            }
            console.error("Fetch failed", err);
        }
    }

    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: "Submit Data",
            message: `Apakah Anda yakin ingin menambahkan siswa ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            setLoading(true);
            try {

                const response = await updateStudent(form);

                if (!response.data) {
                    throw new Error("Gagal simpan data");
                }

                navigate("/students/student");
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.log("Fetch failed", error.response?.data.message);
                }
                alert(error instanceof AxiosError ? error.response?.data.message : "Terjadi kesalahan");
            } finally {
                setLoading(false);
            }
        }

    };


    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full">
                    <main className="p-4 mb-20">
                        {loading &&
                            <LoadingOverlay
                            />}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">{isEdit ? "Perbarui Siswa" : "Buat Siswa"}</h2>
                            </div>
                            <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>{isEdit ? "Perbarui Siswa" : "Tambah Siswa"}</span>
                                {!isEdit && (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>

                        </div>

                        <Tabs defaultValue="personal">
                            <TabsList className="grid grid-cols-7 mb-4">
                                <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                                <TabsTrigger value="school">Sekolah Asal</TabsTrigger>
                                <TabsTrigger value="family">Keluarga</TabsTrigger>
                                <TabsTrigger value="documents">Dokumen</TabsTrigger>
                                <TabsTrigger value="additional">Informasi Tambahan</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal">
                                <div className="mt-10 flex justify-between items-center mb-4">
                                    <h2 className="font-bold">Informasi Data Diri</h2>
                                </div>
                                <div className="bg-white p-6">

                                    <div className="mb-4">
                                        <FormInput
                                            label={"Kode Registrasi"}
                                            name="registration_code"
                                            value={form.registration_code}
                                            onChange={handleChange}
                                            disabled={registrationCodeLoading}
                                            placeholder={registrationCodeLoading ? "Loading..." : "REG"}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-3 mb-4">

                                        <label className="font-semibold">Foto Profil</label>

                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-30 h-30 object-cover rounded-full border-2 border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-30 h-30 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 text-2xl bg-gray-50">
                                                <Camera className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}

                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        <Button
                                            type="button"
                                            onClick={handleClick}
                                            className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                                        >
                                            Pilih Gambar
                                        </Button>
                                    </div>

                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Kolom Kiri */}
                                        <div className="space-y-4">
                                            <FormInput
                                                label="Nama Lengkap"
                                                name="full_name"
                                                value={form.full_name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                            />
                                            <FormSelect
                                                label="Jenis Kelamin"
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                options={[{ label: 'Laki Laki', value: 'male' }, { label: 'Perempuan', value: 'female' }]}
                                            />
                                            <FormInput
                                                label="Tempat Lahir"
                                                name="birth_place"
                                                value={form.birth_place}
                                                onChange={handleChange}
                                                placeholder="Masukkan tempat lahir"
                                            />
                                            <FormInput
                                                label="NISN"
                                                name="nisn"
                                                value={form.nisn}
                                                onChange={handleChange}
                                                placeholder="Masukkan nisn"
                                            />
                                            <FormSelect
                                                label="Anak ke"
                                                name="child_order"
                                                value={form.child_order.toString()}
                                                onChange={(e) => setForm({ ...form, child_order: parseInt(e.target.value) })}
                                                options={[{ label: '1', value: '1' }, { label: '2', value: '2' }]}
                                            />
                                            <FormSelect
                                                label="Kondisi Spesial"
                                                name="special_condition"
                                                value={form.special_condition?.id ?? ''}
                                                onChange={handleSpecialConditionChange}
                                                options={specialConditions.map((mode) => ({ label: mode.name, value: mode.id }))}
                                            />
                                            <FormSelect
                                                label="Memiliki KIP"
                                                name="has_kip"
                                                value={form.has_kip ? 'y' : 'n'}
                                                onChange={(e) => setForm({ ...form, has_kip: e.target.value === 'y' })}
                                                options={[{ label: 'Ya', value: 'y' }, { label: 'Tidak', value: 'n' }]}
                                            />

                                            <FormSelect
                                                label="Transportasi"
                                                name="transportation_mode"
                                                value={form.transportation_mode?.id ?? ''}
                                                onChange={handleTransportationModeChange}
                                                options={transportationModes.map((mode) => ({ label: mode.name, value: mode.id }))}
                                            />

                                        </div>

                                        {/* Kolom Kanan */}
                                        <div className="space-y-4">
                                            <FormInput
                                                label="Nama Panggilan"
                                                name="nickname"
                                                value={form.nickname}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                            />

                                            <FormSelect
                                                label="Agama"
                                                name="religion"
                                                value={form.religion?.id ?? ''}
                                                onChange={handleReligionChange}
                                                options={religionTypes.map((religion) => ({ label: religion.name, value: religion.id }))}
                                            />

                                            <FormInput
                                                label="Tanggal Lahir"
                                                name="birth_date"
                                                value={form.birth_date}
                                                onChange={handleChange}
                                                type="date"
                                            />

                                            <FormSelect
                                                label="Kewarganegaraan"
                                                name="nationality"
                                                value={form.nationality?.id ?? ''}
                                                onChange={handleNationalityChange}
                                                options={nationalities.map((nationality) => ({ label: nationality.name, value: nationality.id }))}
                                            />

                                            <FormInput
                                                label="Status dalam keluarga"
                                                name="family_status"
                                                value={form.family_status}
                                                onChange={handleChange}
                                                placeholder="Contoh : Anak"
                                            />

                                            <FormSelect
                                                label="Penerima KPS/KPH"
                                                name="has_kps"
                                                value={form.has_kps ? 'y' : 'n'}
                                                onChange={(e) => setForm({ ...form, has_kps: e.target.value === 'y' })}
                                                options={[{ label: 'Ya', value: 'y' }, { label: 'Tidak', value: 'n' }]}
                                            />

                                            <FormSelect
                                                label="Layak Mendapatkan KIP"
                                                name="eligible_for_kip"
                                                value={form.eligible_for_kip ? 'y' : 'n'}
                                                onChange={(e) => setForm({ ...form, eligible_for_kip: e.target.value === 'y' })}
                                                options={[{ label: 'Ya', value: 'y' }, { label: 'Tidak', value: 'n' }]}
                                            />

                                            <FormSelect
                                                label="Berkebutuhan Khusus"
                                                name="special_need"
                                                value={form.special_need?.id ?? ''}
                                                onChange={handleSpecialNeedChange}
                                                options={specialNeeds.map((specialNeed) => ({ label: specialNeed.name, value: specialNeed.id }))}
                                            />

                                        </div>
                                    </form>
                                    {/* Alamat Tempat Tinggal */}
                                    {
                                        <div className="mt-10">
                                            <h2 className="font-bold mb-4">Alamat Tempat Tinggal</h2>
                                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <FormSelect
                                                        label="Provinsi"
                                                        name="province_id"
                                                        value={selectedProvince}
                                                        options={provinces.map((province) => ({ label: province.name, value: province.id }))}
                                                        onChange={handleProvinceChange}
                                                    />

                                                    <FormSelect
                                                        label="Kecamatan"
                                                        name="sub_district_id"
                                                        value={selectedSubDistrict}
                                                        options={subDistricts.map((sub_district) => ({ label: sub_district.name, value: sub_district.id }))}
                                                        onChange={handleSubDistrictChange}
                                                        disabled={!selectedCity}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <FormSelect
                                                        label="Kota/Kabupaten"
                                                        name="city_id"
                                                        value={selectedCity}
                                                        options={cities.map((city) => ({ label: city.name, value: city.id }))}
                                                        onChange={handleCityChange}
                                                        disabled={!selectedProvince}
                                                    />

                                                    <FormSelect
                                                        label="Desa/Kelurahan"
                                                        name="village"
                                                        value={form.village?.id ?? ''}
                                                        options={villages.map((village) => ({ label: village.name, value: village.id }))}
                                                        onChange={handleVillageChange}
                                                        disabled={!selectedSubDistrict}
                                                    />
                                                </div>
                                            </form>
                                            <div>
                                                <label className="block font-medium mt-3 mb-1">Jalan</label>
                                                <textarea
                                                    name="street"
                                                    value={form.street}
                                                    onChange={handleChange}
                                                    placeholder="isi alamat jalan"
                                                    className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {/* Kontak */}
                                    {
                                        <div className="mt-10">
                                            <h2 className="font-bold mb-4">Kontak</h2>
                                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <FormInput
                                                        label="Nomor Telepon"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        placeholder="628XXXXX"
                                                    />


                                                </div>

                                                <div className="space-y-4">
                                                    <FormInput
                                                        label="Email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="xxx@gmail.com"
                                                    />


                                                </div>
                                            </form>
                                        </div>
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="school">
                                <div className="mt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-bold">Daftar Sekolah</h2>
                                        <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                            <span>Tambah Sekolah</span>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <TableOriginSchool
                                        items={form.origin_schools}
                                        onDeleted={handleRemoveOriginSchool}
                                        onEdit={(item) => {
                                            setSelectedOriginSchool(item);
                                            setShowModal(true);
                                        }}
                                    />

                                    {showModal && (
                                        <StudentOriginSchoolForm
                                            item={selectedOriginSchool}
                                            onClose={() => {
                                                setShowModal(false);
                                                setSelectedOriginSchool(null);
                                            }}
                                            onSuccess={(item) => {
                                                if (selectedOriginSchool === null) {
                                                    handleAddOriginSchool(item);
                                                } else {
                                                    handleUpdateOriginSchool(item);
                                                }
                                                setShowModal(false);
                                                setSelectedOriginSchool(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="family">
                                <div className="mt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-bold">Daftar Keluarga</h2>
                                        <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                            <span>Tambah Keluarga</span>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <ParentTable
                                        items={form.parents}
                                        onDeleted={handleRemoveParent}
                                        onEdit={(item) => {
                                            setSelectedParent(item);
                                            setShowModal(true);
                                        }}
                                    />

                                    {showModal && (
                                        <StudentParentForm
                                            item={selectedParent}
                                            onClose={() => {
                                                setShowModal(false);
                                                setSelectedParent(null);
                                            }}
                                            onSuccess={(item) => {
                                                if (selectedParent === null) {
                                                    handleAddParent(item);
                                                } else {
                                                    handleUpdateParent(item);
                                                }
                                                setShowModal(false);
                                                setSelectedParent(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="documents">
                                <div className="mt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-bold">Daftar Dokumen</h2>
                                        <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                            <span>Tambah Dokumen</span>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <TableDocument
                                        items={form.documents ?? []}
                                        onDeleted={handleRemoveDocument}
                                        onEdit={(item) => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                    />

                                    {showModal && (
                                        <StudentDocumentForm
                                            item={selectedItem}
                                            onClose={() => {
                                                setShowModal(false);
                                                setSelectedItem(null);
                                            }}
                                            onSuccess={(item) => {
                                                if (selectedItem === null) {
                                                    handleAddDocument(item);
                                                } else {
                                                    handleUpdateDocument(item);
                                                }
                                                setShowModal(false);
                                                setSelectedItem(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="additional">
                                <div className="mt-12">
                                    <h2 className="font-bold mb-4">Informasi Tambahan</h2>
                                    <form className="grid grid-cols-1 gap-6 bg-white pb-6 pl-6 pr-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block font-medium mt-3 mb-1">Kondisi Kesehatan</label>
                                                <textarea
                                                    name="health_condition"
                                                    value={form.health_condition}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan informasi kesehatan jika ada"
                                                    className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-medium mt-3 mb-1">Hobi dan Minat</label>
                                                <textarea
                                                    name="hobby"
                                                    value={form.hobby}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan informasi hobi dan minat"
                                                    className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-medium mt-3 mb-1">Catatan Tambahan</label>
                                                <textarea
                                                    name="additional_information"
                                                    value={form.additional_information}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan catatan tambahan"
                                                    className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </TabsContent>
                        </Tabs>


                    </main>
                    {ConfirmDialog}
                </div>
            </div>
        </BaseLayout>
    );
}
