export function Subtitle({ label, action, onAction }) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="md:w-3 w-2 md:h-6 h-4 bg-primary rounded-sm"></div>
        <h2 className=" font-bold  md:text-2xl text-lg">
          {label}
        </h2>{" "}
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
