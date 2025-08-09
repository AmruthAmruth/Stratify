import React from "react";
import { adminRegisterSchema, type AdminRegisterFormData } from "../../shared/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegisterFormData>({
    resolver: zodResolver(adminRegisterSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: AdminRegisterFormData) => {
    console.log("Registration Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Company Registration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              {...register("companyName")}
              className="w-full input"
              placeholder="ABC Pvt Ltd"
            />
            <p className="text-red-500 text-sm mt-1">{errors.companyName?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input {...register("email")} className="w-full input" placeholder="email@example.com" />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input {...register("phone")} className="w-full input" placeholder="+91 9876543210" />
            <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Industry</label>
            <input {...register("industry")} className="w-full input" placeholder="Software" />
            <p className="text-red-500 text-sm mt-1">{errors.industry?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Business Reg No</label>
            <input {...register("businessRegNo")} className="w-full input" placeholder="BR123456" />
            <p className="text-red-500 text-sm mt-1">{errors.businessRegNo?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input {...register("city")} className="w-full input" placeholder="Bangalore" />
            <p className="text-red-500 text-sm mt-1">{errors.city?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">State</label>
            <input {...register("state")} className="w-full input" placeholder="Karnataka" />
            <p className="text-red-500 text-sm mt-1">{errors.state?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input {...register("country")} className="w-full input" placeholder="India" />
            <p className="text-red-500 text-sm mt-1">{errors.country?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Zip Code</label>
            <input {...register("zipcode")} className="w-full input" placeholder="560001" />
            <p className="text-red-500 text-sm mt-1">{errors.zipcode?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full input"
              placeholder="********"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full input"
              placeholder="********"
            />
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
