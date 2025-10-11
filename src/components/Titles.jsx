export function Subtitle({ label, action, onAction }) {
  return (
    <div className="border-l-[12px] rounded-sm border-primary pl-4 flex justify-between">
      <h2 className=" font-bold text-2xl ">{label}</h2>
     {action &&  <button
        onClick={onAction}
        className="border-[1px] rounded-md border-primary_dark text-sm px-3 py-1 text-primary_dark hover:bg-primary_dark hover:text-white"
      >
        {action}
      </button>}
    </div>
  );
}
