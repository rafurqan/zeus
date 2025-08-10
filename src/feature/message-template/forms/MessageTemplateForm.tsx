import { Button } from "@/core/components/ui/button";
import { MessageTemplate } from "../types/messageTemplate";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (data: MessageTemplate) => void;
  initialData?: MessageTemplate;
  onCancel: () => void;
};

export default function MessageTemplateForm({ onSubmit, initialData, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageTemplate>({
    defaultValues: initialData || {
      name: "",
      body: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nama Template
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Nama template harus diisi" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Isi Template
        </label>
        <textarea
          id="body"
          rows={5}
          {...register("body", { required: "Isi template harus diisi" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.body && (
          <p className="text-red-500 text-sm">{errors.body.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-black/90 text-white">
          {initialData ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}