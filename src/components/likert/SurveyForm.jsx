import React from "react";
import { Field } from "formik";

const SurveyForm = ({ questions }) => {
  const renderInputField = (question) => {
    const fieldProps = {
      name: question.id,
      className:
        "block w-full bg-white border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700",
    };

    switch (question.responseType) {
      case "select":
        return (
          <Field as="select" {...fieldProps}>
            <option value="">Select your option</option>
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case "text":
        return <Field type="text" {...fieldProps} />;
      case "number":
        return <Field type="number" {...fieldProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor={question.id}>
            {question.text}
          </label>
          {renderInputField(question)}
        </div>
      ))}
    </>
  );
};

export default SurveyForm;
