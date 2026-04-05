import { Link } from "react-router-dom";
import { generalPagePadding } from "../utils/constants";

export function Footer() {
  return ( 
    <div className={` flex mt-12 text-white w-full md:[&_span]:text-sm [&_span]:text-xs`}>
      {/* <div className="w-full h-8 bg-primary "></div> */}
      <div className={`${generalPagePadding} flex md:flex-row gap-8 flex-col md:items-center justify-between py-12 px-16 bg-primary w-full`}>
        <div className="flex items-center gap-4 [&_span]:opacity-40 [&_p]:opacity-40">
          <h1 className="font-bold text-2xl">Gioa</h1>
          <div className="flex flex-col border-l-2 border-neutral-500 border-opacity-40 pl-4 [&_span]:text-sm [&_p]:text-sm">
            <div className="flex gap-4 items-center">
              <span>About</span>
              <span>ContactUs</span>
              <span>Categories</span>
              <span>Brands</span>
            </div>
            <span>@2025 Gioa. All rights Reserved</span>
          </div>
        </div>

        <div className="opacity-80 flex md:flex-row flex-col-reverse gap-4 w-full items-center md:ml-16">
          <div className="flex items-center gap-4 md:gap-2">
            <Link className="fab fa-facebook "></Link>
            <Link className="fab fa-google"></Link>
            <Link className="fab fa-whatsapp"></Link>
          </div>
          <span className="text-sm opacity-40">atoyejeovercomer2@gmail.com</span>
        </div>
      </div>
    </div>
  );
}