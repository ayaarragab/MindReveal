import React, { useEffect } from "react";
import { useThoughtStore } from "@/store/thoughtStore";
import { ThoughtCard } from "./ThoughtCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cardStyle } from "../../assets/styleObjects"

export function ThoughtList() {
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
  const [searchQuery, setSearchQuery] = React.useState("");

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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4" style={cardStyle}>
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          type="search"
          placeholder="Search thoughts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {thoughts.map((thought) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          onClick={() => fetchThoughts(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => fetchThoughts(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
