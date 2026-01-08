import React, { useRef, useEffect, KeyboardEvent } from "react";

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const inputs = Array.from({ length: numInputs }, (_, i) => value[i] || "");

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (val: string, index: number) => {
    // Only allow digits
    if (val && !/^\d$/.test(val)) return;

    const otpArray = value.split("");
    otpArray[index] = val.slice(-1); // Only last digit
    const newOtp = otpArray.join("");
    onChange(newOtp);

    // Auto-focus next input if value entered
    if (val && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, move to previous and clear it
        const otpArray = value.split("");
        otpArray[index - 1] = "";
        onChange(otpArray.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (value[index]) {
        // Clear current input
        const otpArray = value.split("");
        otpArray[index] = "";
        onChange(otpArray.join(""));
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, numInputs);

    // Only allow digits
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, numInputs - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div style={{ display: "flex", gap }}>
      {inputs.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className="border-2 border-gray-300 rounded-xl text-center text-2xl font-bold 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     transition-all duration-200 bg-white text-gray-800
                     hover:border-gray-400"
          style={{ width: inputSize, height: inputSize }}
        />
      ))}
    </div>
  );
};

export default ReusableOTP;
