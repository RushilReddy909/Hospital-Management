import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    cnfpass: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userInfo
      );

      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          `Server Error.`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
  };

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0">
              <CardContent className="grid p-0 md:grid-cols-2">
                <div className="bg-muted relative hidden md:block">
                  <img
                    src="https://previews.123rf.com/images/ntlstudio/ntlstudio2109/ntlstudio210900313/174725861-doctor-office-visit-flat-color-vector-illustration-hospital-appointment-for-family-clinical-visit-fo.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
                <form className="p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Registration </h1>
                      <p className="text-muted-foreground text-balance">
                        Create a new account
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        required
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, username: e.target.value })
                        }
                      ></Input>
                      <p className="text-muted-foreground *:[a]:hover:text-primary text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        This is your public username
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                      <div className="grid gap-3">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center">
                          <Label htmlFor="cnfpass">Re-enter Password</Label>
                        </div>
                        <Input
                          id="cnfpass"
                          type="password"
                          required
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              cnfpass: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => handleSubmit()}
                    >
                      <span className="font-bold"> Register </span>
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                      >
                        <FaGoogle />
                        <p className="font-bold pb-0.5">Login with Google</p>
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <a href="/login" className="underline underline-offset-4">
                        Login
                      </a>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a>{" "}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={4} />
    </>
  );
};

export default SignupPage;
