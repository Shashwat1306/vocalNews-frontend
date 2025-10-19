import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/user-validations.js";
import { doLogin } from "../api/user-api.js";
import { set } from "zod";
const Login=() => {
    const [status,setStatus] = useState(false);
    const [message,setMessage] = useState("");
    const navigate=useNavigate();
    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const loginSubmit=async(userData)=>{
        console.log("form submitted",userData);
        try{
            const result = await doLogin(userData);
            if(result.data.token){
              localStorage.token=result.data.token;
              localStorage.role=result.data.role;
              setStatus(false);
              setMessage("Login successful");
              navigate("/");
            }
            else{
              setStatus(true);
              setMessage(result.data.message || "Login failed");
            }
        }
        catch(error){
            console.error("Login failed:", error);
            setStatus(true);
            setMessage(error.message || "Login failed");
        }
    };
    return(
    <div className="h-full flex items-center justify-center ">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="space-y-1 text-center">Login Here</CardTitle>
          <CardDescription className="text-center">
            VocalNews Login Form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Email"
              />
              <span className="text-red-500">
                {errors.email && errors.email.message}
              </span>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Password"
              />
              <span className="text-red-500">
                {errors.password && errors.password.message}
              </span>
            </div>

            <br />
            <div className="grid w-full max-w-sm items-center gap-3">
              <Button className="bg-green-300 hover:bg-green-400 text-black">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
