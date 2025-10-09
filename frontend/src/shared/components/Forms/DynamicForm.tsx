import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  options?: (string | SelectOption)[];
}

interface AuthFormProps {
  fields: Field[];
  validationSchema: ZodSchema;
  onSubmit: (values: Record<string, unknown>) => void;
  buttonText: string;
  initialValues?: Record<string, unknown>;
}

const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  validationSchema,
  onSubmit,
  buttonText,
  initialValues,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<Record<string, string | ArrayBuffer | null>>({});

  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      // Ensure controlled inputs
      if (field.type === "file") initialData[field.name] = null;
      else if (field.type === "date") initialData[field.name] = initialValues?.[field.name] || null;
      else initialData[field.name] = initialValues?.[field.name] ?? "";
    });
    setFormData(initialData);
  }, [fields, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    console.log("Submitting formData:", formData);

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
      className="shadow-lg rounded-xl p-8 space-y-6 max-w-4xl mx-auto"
      style={{ backgroundColor: "#fbfbfb" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const colSpan = field.type === "file" ? "col-span-1 md:col-span-2" : "";

          return (
            <div key={field.name} className={`flex flex-col ${colSpan}`}>
              <label className="block font-medium mb-2" style={{ color: "#3b3b3b" }}>
                {field.label}
              </label>

              {field.type === "file" ? (
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor={field.name}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition group"
                    style={{
                      background: "linear-gradient(to bottom, #fbfbfb, #dfdcef)",
                      borderColor: "#dfdcef",
                    }}
                  >
                    <svg
                      className="w-10 h-10 text-gray-400 group-hover:text-[#009063] transition"
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
                    <span className="mt-2 text-sm transition" style={{ color: "#3b3b3b" }}>
                      Drag & drop or <span className="font-medium text-[#009063]">browse</span>
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
                    <div className="relative w-44 h-44 rounded-xl overflow-hidden shadow-lg" style={{ borderColor: "#dfdcef", borderWidth: 1 }}>
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
                        className="absolute top-2 right-2 rounded-full w-7 h-7 flex items-center justify-center text-sm transition"
                        style={{ backgroundColor: "#009063", color: "#fbfbfb" }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  className={`border rounded-lg px-4 py-2 focus:outline-none transition`}
                  style={{
                    backgroundColor: "#fbfbfb",
                    color: "#3b3b3b",
                    borderColor: errors[field.name] ? "#f87171" : "#dfdcef",
                  }}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option, idx) => {
                    if (typeof option === "string") {
                      return (
                        <option key={idx} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      );
                    }
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              ) : field.type === "date" ? (
                <DatePicker
                  selected={
                    formData[field.name]
                      ? new Date(formData[field.name] as string)
                      : null
                  }
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date?.toISOString() || null,
                    }))
                  }
                  onBlur={() => validateField(field.name)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText={`Select ${field.label}`}
                  className="border rounded-lg px-4 py-2 focus:outline-none transition"
                  style={{
                    backgroundColor: "#fbfbfb",
                    color: "#3b3b3b",
                    borderColor: errors[field.name] ? "#f87171" : "#dfdcef",
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="border rounded-lg px-4 py-2 focus:outline-none transition"
                  style={{
                    backgroundColor: "#fbfbfb",
                    color: "#3b3b3b",
                    borderColor: errors[field.name] ? "#f87171" : "#dfdcef",
                  }}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="w-full font-semibold py-3 rounded-lg shadow-md transition"
        style={{ backgroundColor: "#009063", color: "#fbfbfb" }}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
