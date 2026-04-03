// export function PageNavigator({ pageNo, maxPageNo, onPageChange }) {

//   const pageNoArrays = [];
//   const visiblePageNo = [];
//   for (let index = 1; index <= maxPageNo; index++) {
//     pageNoArrays.push(index);
//   }

//   if (pageNoArrays.length > 5) {
//     if (pageNo < 4) {
//       visiblePageNo.length = 0;
//       visiblePageNo.push(
//         ...[...pageNoArrays.slice(0, 4), pageNoArrays.length]
//       );
//       visiblePageNo.splice(visiblePageNo.length - 1, 0, "...");
//     } else if (
//       pageNo === pageNoArrays.length ||
//       pageNo === pageNoArrays.length - 1
//     ) {
//       visiblePageNo.length = 0;
//       visiblePageNo.push(
//         ...[
//           pageNoArrays[0],
//           ...pageNoArrays.slice(pageNoArrays.length - 4, pageNoArrays.length),
//         ]
//       );
//       visiblePageNo.splice(1, 0, "...");
//     } else {
//       visiblePageNo.length = 0;
//       visiblePageNo.push(
//         ...[
//           pageNoArrays[0],
//           pageNo - 1,
//           pageNo,
//           pageNo + 1,
//           pageNoArrays[pageNoArrays.length - 1],
//         ]
//       );
//       visiblePageNo.splice(visiblePageNo.length - 1, 0, "...");
//       visiblePageNo.splice(1, 0, "...");
//     }
//   } else {
//     visiblePageNo.push(...[...pageNoArrays]);
//   }

//   const iconClass =
//     "  text-xs h-8 w-8 flex items-center justify-center rounded-full";

//   return (
//    <div className=" flex w-full py-10">
//      <div className="flex m-auto items-center justify-between w-[50%] ">
//       <button
//         className={`fa fa-arrow-left ${
//           pageNo > 1 ? "bg-neutral-700 text-white " : "border-neutral-300 border-2"
//         } ${iconClass}`}
//         onClick={() => {
//           if (pageNo > 1) {
//             onPageChange(pageNo - 1);
//           }
//         }}
//       ></button>

//       {/* <span className="font-semibold">{`Page: ${pageNo} of ${maxPageNo}`}</span> */}

//       <div className="flex items-center gap-4 ">
//         {visiblePageNo.map((no) => {
//           if (no === "...") {
//             return "...";
//           } else {
//             return (
//               <div onClick={()=>{
//                 onPageChange(no);
//               }} className={` ${pageNo === no ? "bg-neutral-700 text-white" : "text-neutral-800 border-2 border-neutral-300"} h-8 w-8 flex items-center justify-center rounded-full cursor-pointer`}>
//                 {no}
//               </div>
//             );
//           }
//         })}
//       </div>

//       <button
//         className={`fa  fa-arrow-right ${
//           pageNo < maxPageNo ? "bg-neutral-700 text-white" : "border-neutral-300 border-2"
//         } ${iconClass}`}
//         onClick={() => {
//           if (pageNo < maxPageNo) {
//             onPageChange(pageNo + 1);
//           }
//         }}
//       ></button>
//     </div>
//    </div>
//   );
// }

function getVisiblePages(pageNo, maxPageNo) {
  if (maxPageNo <= 5) {
    return Array.from({ length: maxPageNo }, (_, i) => i + 1);
  }

  if (pageNo < 4) {
    return [1, 2, 3, 4, "...", maxPageNo];
  }

  if (pageNo >= maxPageNo - 2) {
    return [1, "...", maxPageNo - 3, maxPageNo - 2, maxPageNo - 1, maxPageNo];
  }

  return [1, "...", pageNo - 1, pageNo, pageNo + 1, "...", maxPageNo];
}

export function PageNavigator({ pageNo, maxPageNo, onPageChange }) {
  const visiblePages = getVisiblePages(pageNo, maxPageNo);

  const baseBtn =
    "h-8 w-8 flex items-center justify-center rounded-full text-xs";

  return (
    <div className="flex w-full py-10">
      <div className="flex m-auto items-center justify-between w-[50%]">

        {/* Prev Button */}
        <button
          className={`fa fa-arrow-left ${
            pageNo > 1
              ? "bg-neutral-700 text-white"
              : "border-2 border-neutral-300 cursor-not-allowed"
          } ${baseBtn}`}
          disabled={pageNo === 1}
          onClick={() => onPageChange(pageNo - 1)}
        />

        {/* Page Numbers */}
        <div className="flex items-center gap-4">
          {visiblePages.map((item, index) => {
            if (item === "...") {
              return (
                <span key={`dots-${index}`} className="px-1">
                  ...
                </span>
              );
            }

            return (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`${
                  pageNo === item
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-800 border-2 border-neutral-300"
                } ${baseBtn}`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          className={`fa fa-arrow-right ${
            pageNo < maxPageNo
              ? "bg-neutral-700 text-white"
              : "border-2 border-neutral-300 cursor-not-allowed"
          } ${baseBtn}`}
          disabled={pageNo === maxPageNo}
          onClick={() => onPageChange(pageNo + 1)}
        />
      </div>
    </div>
  );
}
