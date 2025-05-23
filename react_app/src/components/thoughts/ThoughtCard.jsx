import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export function ThoughtCard({ thought, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full">
        <CardContent style={{display:"flex"}}>
        <div className="flex space-x-2">
            {/* <Button variant="ghost" size="icon" onClick={() => onEdit(thought)}>
              <Edit className="h-4 w-4" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(thought._id)}
              style={{ padding:"5px", marginTop:"10px", marginRight:"10px"}}
            >
              <Trash style={{width:"20px", height:"20px"}} />
            </Button>
          </div>
          <p className="text-sm text-gray-600">{thought.content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center space-x-2">
            {thought.categories?.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {category.name}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
