export default function AddRecommendationForm() {
  return (
    <form className="flex flex-col space-y-4 my-4">
      <textarea placeholder="Enter recommendation"></textarea>
      <button
        type="submit"
        className="text-lg text-gray-500 hover:bg-gray-300 border border-gray-300 rounded w-fit px-4 py-2"
      >
        Add Recommendation
      </button>
    </form>
  );
}
