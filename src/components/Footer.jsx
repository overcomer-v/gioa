import { Link } from "react-router-dom";
import { generalPagePadding } from "../utils/constants";

export function Footer() {
  return ( 
    <div className={` flex mt-12 text-white w-full `}>
      {/* <div className="w-full h-8 bg-primary "></div> */}
      <div className={`${generalPagePadding} flex md:flex-row gap-8 flex-col items-center justify-between py-12 px-16 bg-primary w-full`}>
        <div className="flex items-center gap-4 [&_span]:opacity-60 [&_p]:opacity-60">
          <h1 className="font-bold text-2xl">Gioa</h1>
          <div className="flex flex-col border-l-2 border-neutral-600 pl-4 [&_span]:text-sm [&_p]:text-sm">
            <div className="flex gap-4 items-center">
              <span>About</span>
              <span>ContactUs</span>
              <span>Categories</span>
              <span>Brands</span>
            </div>
            <p>@2025 Gioa. All rights Reserved</p>
          </div>
        </div>
        <div className="opacity-80 flex md:flex-col gap-2 w-full px-6">
          <div className="flex items-center gap-2">
            <Link className="fab fa-facebook"></Link>
            <Link className="fab fa-google"></Link>
            <Link className="fab fa-whatsapp"></Link>
          </div>
          <p className="text-sm opacity-70 border-l-2 border-neutral-400 pl-3">Support:atoyejeovercomer2@gmail.com</p>
        </div>
      </div>
    </div>
  );
}