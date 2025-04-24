import React, { useEffect, useState } from "react";
import { useThoughtStore } from "@/store/thoughtStore";
import { ThoughtCard } from "./ThoughtCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cardStyle } from "../../assets/styleObjects"
import { CreateThought } from "./CreateThought";
import { authApi } from "../../lib/authApi.js"

export function ThoughtList() {
  const [isAdd, setIsAdd] = useState(false);
  const {
    thoughts,
    isLoading,
    currentPage,
    totalPages,
    fetchThoughts,
    deleteThought,
    searchThoughts,
  } = useThoughtStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchThoughts(searchQuery);
    } else {
      fetchThoughts();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteThought(id);
      toast({
        title: "Success",
        description: "Thought deleted successfully",
      });
      
      // Refresh the list after deletion
      if (searchQuery.trim()) {
        searchThoughts(searchQuery);
      } else {
        fetchThoughts(currentPage);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCreate = () => {
    setIsAdd(!isAdd); // Toggle the isAdd state
  };

  const handleThoughtCreated = () => {
    // Hide the create form after successful creation
    setIsAdd(false);
    // Refresh the thoughts list
    fetchThoughts();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4" style={cardStyle}>
      {/* Only render CreateThought when isAdd is true */}
      {isAdd ? (
        <CreateThought onCreated={handleThoughtCreated} />
      ) : (
        <>
          <form onSubmit={handleSearch} className="flex space-x-2">
            
            <Input
              type="search"
              placeholder="Search thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" style={{margin: "20px"}}>Search</Button>
          </form>
          <h1 style={{fontSize: "2rem", textAlign:"left"}}>Your Thoughts</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {thoughts.map((thought) => (
              <ThoughtCard
                key={thought._id}
                thought={thought}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center space-x-2">
        <Button
          onClick={handleCreate}
          style={{margin:"20px"}}
        >
          {isAdd ? "Cancel" : "Add"}
        </Button>
          <>
            <Button
              onClick={() => {
                 authApi.logout();
                window.location.href = "/welcome";
                }}
              style={{marginRight:"20px"}}
            >
              Logout
            </Button>
          </>
      </div>
    </div>
  );
}