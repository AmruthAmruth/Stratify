import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Types ---------- */

interface SelectOption {
  value: string;
  label: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  multiple?: boolean;
  options?: (string | SelectOption)[];
}

interface AuthFormProps {
  fields: Field[];
  validationSchema: z.ZodTypeAny;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  buttonText: React.ReactNode;
  initialValues?: Record<string, unknown>;
  disabled?: boolean;
}

/* ---------- Animations ---------- */

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

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

    const initializeFormData = useCallback(() => {
      const initialData: Record<string, unknown> = {};

      fields.forEach((field) => {
        if (field.type === "file") initialData[field.name] = null;
        else if (field.type === "date")
          initialData[field.name] =
            typeof initialValues?.[field.name] === "string"
              ? initialValues?.[field.name]
              : null;
        else if (field.type === "select" && field.multiple)
          initialData[field.name] = initialValues?.[field.name] ?? [];
        else initialData[field.name] = initialValues?.[field.name] ?? "";
      });

      setFormData(initialData);
      setErrors({});
    }, [fields, initialValues]);

    useEffect(() => {
      initializeFormData();
    }, [initializeFormData]);

    useImperativeHandle(ref, () => ({
      resetForm: initializeFormData,
    }));

    /* ---------- Handlers ---------- */

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || "" : value,
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
      if (!result.success) {
        const formatted = result.error.format() as Record<
          string,
          { _errors?: string[] }
        >;
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

      if (result.success) {
        onSubmit(formData);
        return;
      }

      const formatted = result.error.format() as Record<
        string,
        { _errors?: string[] }
      >;

      const newErrors: Record<string, string> = {};
      fields.forEach((f) => {
        newErrors[f.name] = formatted[f.name]?._errors?.[0] ?? "";
      });
      setErrors(newErrors);
    };

    /* ---------- Render ---------- */

    return (
      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto rounded-2xl bg-bg p-8 space-y-6
                   shadow-lg border border-accent"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, i) => (
            <motion.div
              key={field.name}
              custom={i}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <label className="mb-2 text-sm font-medium text-text">
                {field.label}
              </label>

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
                      <label
                        key={value}
                        className="flex items-center gap-2 text-sm text-text"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            handleMultiSelectChange(field.name, value)
                          }
                          className="h-4 w-4 bg-bg accent-primary"
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  onBlur={() => validateField(field.name)}
                  className="rounded-lg border border-accent
                             bg-bg text-text px-3 py-2
                             focus:outline-none focus:ring-2
                             focus:ring-primary
                             focus:border-primary
                             transition-all duration-200
                             focus:scale-[1.01]"
                >
                  <option value="" disabled>
                    {field.placeholder || `Select ${field.label}`}
                  </option>
                  {field.options?.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const label = typeof opt === "string" ? opt : opt.label;
                    return (
                      <option key={value} value={value}>
                        {label}
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
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date?.toISOString() ?? null,
                    }))
                  }
                  placeholderText={field.placeholder || `Select ${field.label.toLowerCase()}`}
                  onBlur={() => validateField(field.name)}
                  className="w-full rounded-lg border border-accent
                             bg-bg text-text px-3 py-2
                             placeholder-muted
                             focus:outline-none focus:ring-2
                             focus:ring-primary
                             focus:border-primary
                             transition-all duration-200"
                />
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  rows={4}
                  className="rounded-lg border border-accent
                             bg-bg text-text px-3 py-2
                             placeholder-muted
                             focus:outline-none focus:ring-2
                             focus:ring-primary
                             focus:border-primary
                             transition-all duration-200
                             focus:scale-[1.01]
                             resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData[field.name] as string) || ""}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  onChange={handleChange}
                  onBlur={() => validateField(field.name)}
                  className="rounded-lg border border-accent
                             bg-bg text-text px-3 py-2
                             placeholder-muted
                             focus:outline-none focus:ring-2
                             focus:ring-primary
                             focus:border-primary
                             transition-all duration-200
                             focus:scale-[1.01]"
                />
              )}

              <AnimatePresence>
                {errors[field.name] && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors[field.name]}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-lg bg-primary py-3
                     text-bg font-medium
                     hover:bg-primaryHover
                     transition
                     disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          {buttonText}
        </motion.button>
      </motion.form>
    );
  }
);

AuthForm.displayName = "AuthForm";
export default AuthForm;
