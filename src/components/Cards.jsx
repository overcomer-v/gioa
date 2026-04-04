import { Link } from "react-router-dom";

export function UsersProductCard({
  id,
  imageSrc,
  label,
  category,
  price,
  brand,
  onClick,
}) {
  return (
    <Link
      onClick={onClick}
      to={`/product-details/${id}`}
      className={`flex flex-col gap-1 justify-between h-full px-3 md:px-4 py-4 cursor-pointer shadow-md bg-white border rounded-xl relative ease-in-out duration-200 hover:scale-95 transform transition-transform `}
    >
      <div className="flex gap-2 flex-col">
        <img
          className="w-[90%] mx-auto aspect-[16/15] mb-2 object-cover rounded-lg"
          src={imageSrc}
          alt=""
        />
        <h2 className="text-xs text-primary hidden md:flex">{category}</h2>
        <p className="font-semibold text-base line-clamp-2 text-primary">
          {label}
        </p>
        <div className="flex items-center gap-2 ">
          <span className="opacity-60 text-sm">Brand :</span>
          <span className=" text-sm">{brand}</span>
        </div>
      </div>
      <h2 className="font-semibold mt-2 text-base tracking-wide opacity-100 text-[rgb(133,150,21)]">
        {price}
      </h2>

      <i className="fa fa-shopping-cart shadow-sm bg-neutral-50 absolute -bottom-0 -right-0 border-[1px] hover:bg-neutral-900 hover:text-white border-neutral-300 rounded-lg h-8 w-8 text-xs flex items-center justify-center "></i>
    </Link>
  );
}

export function SecondaryProductCard({
  id,
  imageSrc,
  label,
  category,
  price,
  onClick,
}) {
  return (
    <Link to={`/product-details/${id}`}>
      {" "}
      <div
        onClick={onClick}
        className=" flex md:h-[270px] h-[240px] md:px-12 px-4 py-10 gap-4 group items-center rounded-2xl overflow-hidden border-2"
      >
        <div className="flex flex-col ">
          <p className=" text-primary text-sm">{category}</p>
          <h2 className="text-2xl font-semibold mb-1 line-clamp-2">{label}</h2>
          <span className="">{price}</span>
          <div className="flex items-center gap-2 mt-6">
            <i className="fa fa-shopping-cart bg-primary text-white h-10 w-10 flex items-center justify-center rounded-full"></i>

            <button className="bg-primary font-bold text-white py-3 px-4 w-fit rounded-full text-sm ">
              Buy Now
            </button>
          </div>
        </div>
        <img
          className=" h-40 w-40 border-2 group-hover:scale-110 border-white ease-in-out duration-200 transition-transform  object-cover rounded-full "
          src={imageSrc}
          alt=""
        />
      </div>
    </Link>
  );
}

// export function SecondaryProductCard({ imageSrc, label, category, price, onClick }) {
//   return (
//     <div className=" flex h-[280px]  relative text-white rounded-lg overflow-hidden">
//       <div className="flex flex-col absolute z-20 top-0 right-0 left-0 bottom-0 ">
//        <div className="my-auto px-6">
//          <p className="opacity-80">{category}</p>
//         <h2 className="text-3xl font-semibold mb-4 w-[70%]">{label}</h2>
//         <span>{price}</span>
//        </div>
//       </div>
//       <div className=" absolute top-0 right-0 left-0 bottom-0  bg-gradient-to-l from-black to-black opacity-70"></div>
//       <img className=" h-full w-full object-cover" src={imageSrc} alt="" />
//     </div>
//   );
// }
