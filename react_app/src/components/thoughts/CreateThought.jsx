import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThoughtStore } from "../../store/thoughtStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { centerObj } from "../../assets/styleObjects";
import { cardStyle } from "../../assets/styleObjects";


export function CreateThought() {
  const [content, setContent] = useState({ content: "" });
  const createAThought = useThoughtStore((state) => state.createThought);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAThought(content);
      toast({
        title: "Success",
        description: "Thought created successfully!",
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
    <>
      <CardHeader>
        <CardTitle style={{textAlign:"Center", fontSize:"2rem"}}>Add a thought</CardTitle>
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
              type="content"
              placeholder="Content"
              value={content.content}
              onChange={(e) =>
                setContent({ ...content, content: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button style={{
            width: "300px"
          }} type="submit" className="w-full"z>
            Add
          </Button>
        </CardFooter>
      </form>
      </>
  );
}
