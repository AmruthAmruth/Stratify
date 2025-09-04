import React, { useState, useEffect } from "react";
import { ZodSchema } from "zod";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[]; // for select fields
}

interface AuthFormProps {
  fields: Field[];
  validationSchema: ZodSchema;
  onSubmit: (values: Record<string, unknown>) => void;
  buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  validationSchema,
  onSubmit,
  buttonText,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<Record<string, string | ArrayBuffer | null>>({});

  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      initialData[field.name] = field.type === "file" ? null : "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateField = (name: string) => {
    const result = validationSchema.safeParse(formData);
    if (!result.success) {
      const formatted = result.error.format() as Record<string, { _errors?: string[] }>;
      const fieldError = formatted[name]?._errors?.[0] ?? "";
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validationSchema.safeParse(formData);

    if (!result.success) {
      const formatted = result.error.format() as Record<string, { _errors?: string[] }>;
      const fieldErrors: Record<string, string> = {};
      fields.forEach((field) => {
        fieldErrors[field.name] = formatted[field.name]?._errors?.[0] ?? "";
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-8 space-y-6 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const colSpan = field.type === "file" ? "col-span-1 md:col-span-2" : "";

          return (
            <div key={field.name} className={`flex flex-col ${colSpan}`}>
              <label className="block font-medium text-gray-600 mb-2">
                {field.label}
              </label>

              {field.type === "file" ? (
                // 📂 File Upload
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor={field.name}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 hover:border-blue-500 transition group"
                  >
                    <svg
                      className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5.001 5.001 0 0115.9 6H16a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-600 transition">
                      Drag & drop or <span className="font-medium">browse</span>
                    </span>
                    <input
                      type="file"
                      name={field.name}
                      id={field.name}
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                  {preview[field.name] && (
                    <div className="relative w-44 h-44 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                      <img
                        src={preview[field.name] as string}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview((prev) => ({ ...prev, [field.name]: null }));
                          setFormData((prev) => ({ ...prev, [field.name]: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ) : field.type === "select" ? (
                // ✅ Select Dropdown
                <select
                  name={field.name}
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  className={`border rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                // 📝 Regular Input
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  className={`border rounded-lg px-4 py-2 bg-gray-50 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
