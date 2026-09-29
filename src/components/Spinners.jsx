import { Loader } from "lucide-react";

export function Spinner({size = "text-2xl"}) {
    return (
       <Loader className={`${size} animate-spin`}>
        
       </Loader>
    );
}