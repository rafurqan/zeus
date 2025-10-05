import React from 'react';

interface FormLabelProps {
  text: string;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ text, required }) => {
  return (
    <>
      {text} {required && <span className="text-red-500">*</span>}
    </>
  );
};