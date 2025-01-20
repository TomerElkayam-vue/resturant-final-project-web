import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import SocialSignUp from "../components/SocialSignUp";

export type SignUpData = {
  username: string;
  password: string;
  email: string;
  photo?: File[] | null;
};

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    password: "",
    email: "",
    photo: null,
  });

  const handleInputChange = (
    field: keyof SignUpData,
    value: string | File | null
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <div className="text-center mb-2">
          <img
            src="/src/assets/logo.png"
            alt="PlantsUniverse Logo"
            style={{ width: "60px", height: "60px" }}
          />
          <h4 className="mt-2">PlantsUniverse</h4>
          <p className="text-muted">Sign Up Page</p>
        </div>
        <SignUpForm formData={formData} onInputChange={handleInputChange} />
        <SocialSignUp />
        <p className="text-center mt-1">
          Already have an account?{" "}
          <a href="/" className="text-success">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
