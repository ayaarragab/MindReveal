import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { centerObj } from "../../assets/styleObjects";
import { cardStyle } from "../../assets/styleObjects";


export const RegisterationForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: ""});
  const login = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast({
        title: "Success",
        description: "Registered successfully!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card className="w-[500px]" style={cardStyle}>
      <CardHeader>
        <CardTitle style={{textAlign:"Center", fontSize:"1.4rem"}}>Welcome!</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} style={{
  display:"flex",
  flexDirection:"Column",
  alignItems: "Center",
  justifyContent:"Center",
}
}>
        <CardContent className="space-y-4" style={centerObj}>
          <div className="space-y-2">
            <Input
              type="username"
              placeholder="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}