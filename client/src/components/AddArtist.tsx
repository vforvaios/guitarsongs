import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { createArtist } from "@/services/artists";
import { useAuth } from "@/context/AuthContext";

const AddArtist = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artists_by_category"] });

      alert("Ο καλλιτέχνης προστέθηκε επιτυχώς!");
      setName("");
    },
    onError: (error) => {
      alert(error.message || "Παρουσιάστηκε σφάλμα κατά την αποθήκευση.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Συμπλήρωσε το όνομα του καλλιτέχνη.");
      return;
    }

    mutate({ name: trimmedName, token });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-8">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-[#c6371a]"
        >
          <ArrowLeft size={20} />
          Πίσω στο Admin
        </button>

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-[#c6371a]/10 p-3 text-[#c6371a]">
              <UserPlus size={26} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#080808]">
                Εισαγωγή Καλλιτέχνη
              </h1>
              <p className="text-sm text-gray-500">
                Πρόσθεσε έναν νέο καλλιτέχνη στη λίστα.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="artist-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Όνομα καλλιτέχνη
              </label>

              <input
                id="artist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="π.χ. Νίκος Πορτοκάλογλου"
                maxLength={150}
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#c6371a] focus:ring-2 focus:ring-[#c6371a]/10"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6371a] px-5 py-3 font-semibold text-white transition hover:bg-[#a92e16] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Αποθήκευση...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Εισαγωγή Καλλιτέχνη
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArtist;
