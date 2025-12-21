// components/Forms/DynamicForm.tsx
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ---------- Types ---------- */

interface SelectOption {
  value: string;
  label: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  multiple?: boolean;
  options?: (string | SelectOption)[];
}

interface ZodFormattedError {
  _errors?: string[];
}

interface SafeParseError {
  format: () => Record<string, ZodFormattedError>;
}

interface SafeParseResult {
  success: boolean;
  error?: SafeParseError;
}

interface AuthFormProps {
  fields: Field[];
  validationSchema: {
    safeParse: (data: unknown) => SafeParseResult;
  };
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  buttonText: React.ReactNode;
  initialValues?: Record<string, unknown>;
  disabled?: boolean;
}

/* ---------- Component ---------- */

const AuthForm = forwardRef<{ resetForm: () => void }, AuthFormProps>(
  (
    {
      fields,
      validationSchema,
      onSubmit,
      buttonText,
      initialValues,
      disabled = false,
    },
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ---------- Initialize Form ---------- */

    const initializeFormData = useCallback(() => {
      const initialData: Record<string, unknown> = {};

      fields.forEach((field) => {
        if (field.type === "file") {
          initialData[field.name] = null;
        } else if (field.type === "date") {
          const value = initialValues?.[field.name];
          initialData[field.name] =
            typeof value === "string" ? value : null;
        } else if (field.type === "select" && field.multiple) {
          initialData[field.name] = initialValues?.[field.name] ?? [];
        } else {
          initialData[field.name] = initialValues?.[field.name] ?? "";
        }
      });

      setFormData(initialData);
      setErrors({});
    }, [fields, initialValues]);

    useEffect(() => {
      initializeFormData();
    }, [initializeFormData]);

    useImperativeHandle(
      ref,
      () => ({
        resetForm: initializeFormData,
      }),
      [initializeFormData]
    );

    /* ---------- Handlers ---------- */

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, type, value } = e.target;
      const input = e.target as HTMLInputElement;

      if (type === "file" && input.files?.[0]) {
        const file = input.files[0];
        setFormData((prev) => ({ ...prev, [name]: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
          // Preview is generated but not used in the component
        };
        reader.readAsDataURL(file);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || null : value,
      }));
    };

    const handleMultiSelectChange = (name: string, value: string) => {
      setFormData((prev) => {
        const current = (prev[name] as string[]) || [];
        return {
          ...prev,
          [name]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    };

    const validateField = (name: string) => {
      const result = validationSchema.safeParse(formData);

      if (!result.success && result.error) {
        const formatted = result.error.format();
        setErrors((prev) => ({
          ...prev,
          [name]: formatted[name]?._errors?.[0] ?? "",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const result = validationSchema.safeParse(formData);
      if (!result.success || !result.error) {
        onSubmit(formData);
        return;
      }

      const formatted = result.error.format();
      const fieldErrors: Record<string, string> = {};

      fields.forEach((field) => {
        fieldErrors[field.name] =
          formatted[field.name]?._errors?.[0] ?? "";
      });

      setErrors(fieldErrors);
    };

    /* ---------- Render ---------- */

    return (
      <form
        onSubmit={handleSubmit}
        className="shadow-lg rounded-xl p-8 space-y-6 max-w-4xl mx-auto"
        style={{ backgroundColor: "#fbfbfb" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="font-medium mb-2">{field.label}</label>

              {field.type === "select" && field.multiple ? (
                <div className="space-y-2">
                  {field.options?.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const label = typeof opt === "string" ? opt : opt.label;
                    const selected =
                      ((formData[field.name] as string[]) || []).includes(
                        value
                      );

                    return (
                      <label key={value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            handleMultiSelectChange(field.name, value)
                          }
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
              ) : field.type === "date" ? (
                <DatePicker
                  selected={
                    formData[field.name]
                      ? new Date(formData[field.name] as string)
                      : null
                  }
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date?.toISOString() ?? null,
                    }))
                  }
                  onBlur={() => validateField(field.name)}
                  className="border px-3 py-2 rounded"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  className="border px-3 py-2 rounded"
                />
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full py-3 rounded text-white bg-[#009063]"
        >
          {buttonText}
        </button>
      </form>
    );
  }
);

AuthForm.displayName = "AuthForm";
export default AuthForm;
