import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";
import { fetchNotes, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(""); // значення з SearchBox
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const perPage = 12;

  const debounced = useDebouncedCallback(
    (value: string) => {
      setDebouncedSearch(value);
      setCurrentPage(1); 
    },
    500 
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounced(value);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, perPage, debouncedSearch),
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} onPageChange={setCurrentPage} />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} onSuccess={() => refetch()} />
        </Modal>
      )}
    </div>
  );
}

export default App;