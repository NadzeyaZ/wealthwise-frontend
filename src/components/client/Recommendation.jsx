export default function Recommendation({ rec }) {
  return (
    <div>
      <p>{rec.content}</p>
      <p>{rec.status}</p>
      <button>Accept</button>
      <button>Reject</button>
    </div>
  );
}
