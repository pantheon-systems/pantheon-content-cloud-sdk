import React, { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  heading: string;
  description: string;
  inputLabel: string;
  submitButtonText?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

const LeadCapture = ({
  heading,
  description,
  inputLabel,
  submitButtonText,
  onSubmit,
}: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const defaultSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      await onSubmit(e);
    } else {
      alert("Form submitted successfully");
    }

    setSubmitted(true);
  };

  return (
    <div className="not-prose w-full rounded-md p-8 shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.2)]">
      {submitted ? (
        <>
          <h1 className="mb-3 text-2xl font-bold">Thank you.</h1>
          <p>The form was submitted successfully.</p>
        </>
      ) : (
        <form onSubmit={defaultSubmitHandler}>
          <h1 className="mb-3 text-2xl font-bold">{heading}</h1>
          <p className="mb-4">{description}</p>
          <label className="mb-8 block">
            <p className="mb-1 font-bold">{inputLabel}</p>

            <input
              className="w-full rounded-md border border-neutral-400 p-2"
              required
            />
          </label>
          <Button>{submitButtonText ?? "Submit"}</Button>
        </form>
      )}
    </div>
  );
};

export default LeadCapture;
