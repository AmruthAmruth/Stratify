import React from "react";
import OTPInput from "react-otp-input";

interface ReusableOTPProps {
  value: string;
  onChange: (otp: string) => void;
  numInputs?: number; // default 6
  inputSize?: string; // width & height, e.g., "3rem"
  gap?: string; // spacing between inputs, e.g., "1rem"
}

const ReusableOTP: React.FC<ReusableOTPProps> = ({
  value,
  onChange,
  numInputs = 6,
  inputSize = "3rem",
  gap = "1rem",
}) => {
  return (
    <div className="flex justify-center" style={{ gap }}>
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        renderInput={(props) => (
          <input
            {...props}
            style={{
              width: inputSize,
              height: inputSize,
              textAlign: "center",
              fontSize: "1.25rem",
              borderRadius: "0.75rem",
              border: "2px solid #CBD5E0",
              backgroundColor: "#F3F4F6",
              color: "#1F2937",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3B82F6";
              e.target.style.backgroundColor = "#EFF6FF";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#CBD5E0";
              e.target.style.backgroundColor = "#F3F4F6";
            }}
          />
        )}
      />
    </div>
  );
};

export default ReusableOTP;
