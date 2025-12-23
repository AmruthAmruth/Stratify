import React from "react";

interface OTPProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  inputSize?: string;
  gap?: string;
}

const ReusableOTP: React.FC<OTPProps> = ({
  value,
  onChange,
  numInputs = 6,
  inputSize = "3rem",
  gap = "0.5rem",
}) => {
  const inputs = Array.from({ length: numInputs }, (_, i) => value[i] || "");

  const handleChange = (val: string, index: number) => {
    const otpArray = value.split("");
    otpArray[index] = val.slice(-1); // Only last digit
    onChange(otpArray.join(""));
  };

  return (
    <div style={{ display: "flex", gap }}>
      {inputs.map((digit, index) => (
        <input
          key={index}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          className="border border-gray-400 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ width: inputSize, height: inputSize }}
        />
      ))}
    </div>
  );
};

export default ReusableOTP;
