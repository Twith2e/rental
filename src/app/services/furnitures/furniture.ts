import { useQuery } from "@tanstack/react-query";
import { getAllFurnitures } from "./furniture-service";

export function useGetAllFurnitures() {
  return useQuery({
    queryKey: ["getAllFurnitures"],
    queryFn: () => getAllFurnitures(),
  });
}
