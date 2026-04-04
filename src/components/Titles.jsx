export function Subtitle({ label, action, onAction }) {
  return (
    <div className="flex justify-between">
      <div>
        <h2 className=" font-bold  md:text-2xl text-lg md:mb-2 mb-1">{label}</h2>{" "}
        <div className="md:w-12 w-8 bg-primary rounded-sm h-2"></div>
      </div>
      {action && (
        <button
          onClick={onAction}
          className=" rounded-md md:text-sm text-xs md:py-2 h-8 md:h-fit px-3 bg-primary text-white hover:scale-110 transition-all duration-300"
        >
          {action}
        </button>
      )}
    </div>
  );
}
