import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {registerSchema} from "../validations/user-validations.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { doRegister } from "../api/user-api.js";

const Register = () => {
  const [status,setStatus] = useState(false);
  const [message,setMessage] = useState("");
  const navigate=useNavigate();
  const {register, handleSubmit, formState: { errors }} = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });
const registerSubmit=async(userData)=>{
  console.log("form submitted",userData);
  try{
    const result = await doRegister(userData);
    console.log ("Registration successful:", result);
    setStatus(true);
    setMessage("Registration successful");
    navigate("/login");
  }
  catch(error){
    console.error("Registration failed:", error);
    setStatus(false);
    setMessage(error.message || "Registration failed");
  }
}
  return(
        <div  className="h-full flex items-center justify-center">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="space-y-1 text-center">Welcome to VocalNews</CardTitle>
        <CardDescription className="text-center">
          Registration Form
        </CardDescription>
      </CardHeader>
      <CardContent> 
        <br/>
        <form onSubmit={handleSubmit(registerSubmit)}>
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
          <br></br>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <span className="text-red-500">
            {errors.password && errors.password.message}
          </span>
          <br></br>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("name")}
              type="text"
              id="name"
              placeholder="name"
            />
          </div>
          <span className="text-red-500">
            {errors.name && errors.name.message}  
          </span>
          <br />
          <br />
          <div className="grid w-full max-w-sm items-center gap-3">
            <Button className="bg-green-400 hover:bg-green-500 text-black">Register</Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
    );
};

export default Register;