export function Subtitle({ label, action, onAction }) {
  return (
    <div className="flex justify-between">
      <div>
        <h2 className=" font-bold text-2xl mb-2">{label}</h2>{" "}
        <div className="w-12 bg-primary rounded-sm h-2"></div>
      </div>
      {action && (
        <button
          onClick={onAction}
          className=" rounded-md text-sm px-3 py-2 bg-primary text-white hover:scale-110 transition-all duration-300"
        >
          {action}
        </button>
      )}
    </div>
  );
}
