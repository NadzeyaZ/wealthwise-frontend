import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router";
import { useClients } from "../../context/ClientsContext";
import {
  addRecommendation,
  generateAIRecommendation,
} from "../../../api/wealthwise";

export default function AddRecommendationForm() {
  const { token, user } = useAuth();
  const { clientId } = useParams();
  const { recommendations, setRecommendations } = useClients();
  const advisorId = user?.id;

  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const onAddRecommendation = async (formData) => {
    const content = formData.get("content");
    try {
      const newRecommendation = await addRecommendation(token, {
        clientId,
        advisorId,
        content,
      });
      setRecommendations([...recommendations, newRecommendation]);
      console.log("New recommendation added:", newRecommendation);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const onGenerateWithAI = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const { draft } = await generateAIRecommendation(token, { clientId });
      setContent(draft);
    } catch (error) {
      console.error(error);
      setGenerateError(
        "Couldn't generate a draft — you can still write one manually.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form action={onAddRecommendation} className="flex flex-col space-y-3 my-4">
      <textarea
        ref={textareaRef}
        name="content"
        placeholder="Enter recommendation..."
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={1}
        className="border border-gray-200 rounded-lg px-4 py-3 text-slate-900 placeholder-gray-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 hover:border-gray-300 transition-colors resize-none overflow-hidden"
      />
      <button
        type="button"
        onClick={onGenerateWithAI}
        disabled={generating}
        className="flex items-center gap-2 bg-gray-100 text-blue-950 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors w-fit disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M12 2l1.6 4.9L18.5 8.5l-4.9 1.6L12 15l-1.6-4.9L5.5 8.5l4.9-1.6L12 2zM19 13l.9 2.6L22.5 16.5l-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13zM5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
        </svg>
        {generating ? "Generating…" : "Generate with AI"}
      </button>
      {generateError && <p className="text-sm text-red-600">{generateError}</p>}
      <button
        type="submit"
        className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors w-fit"
      >
        Add Recommendation
      </button>
    </form>
  );
}
