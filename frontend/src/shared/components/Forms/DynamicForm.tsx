import React, { useState, useEffect } from "react";
import { ZodSchema } from "zod";

interface Field {
  name: string;
  label: string;
  type: string;
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
  // Initialize form data dynamically based on the fields passed
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // generate preview
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
          // If it's a file, span full width
          const colSpan = field.type === "file" ? "col-span-1 md:col-span-2" : "";

          return (
            <div key={field.name} className={`flex flex-col ${colSpan}`}>
              <label className="block font-medium text-gray-600 mb-2">
                {field.label}
              </label>

              {field.type === "file" ? (
                <div className="flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:border-blue-500 hover:bg-gray-100 transition"
                    onClick={() => document.getElementById(field.name)?.click()}
                  >
                    <span className="text-gray-400 text-sm">
                      Drag & drop an image or click to select
                    </span>
                    <input
                      type="file"
                      name={field.name}
                      id={field.name}
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>

                  {/* Image preview */}
                  {preview[field.name] && (
                    <div className="relative mt-3 w-40 h-40">
                      <img
                        src={preview[field.name] as string}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview((prev) => ({ ...prev, [field.name]: null }));
                          setFormData((prev) => ({ ...prev, [field.name]: null }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
