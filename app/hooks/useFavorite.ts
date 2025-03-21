import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  spaceId: string;
  currentUser?: SafeUser | null
}

const useFavorite = ({
  spaceId,
  currentUser
}: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(spaceId);
  }, [currentUser, spaceId]);

  const toggleFavorite = useCallback(async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if(hasFavorited) {
        request = () => axios.delete(`/api/favorites/${spaceId}`);
        await request();
        toast.success('Retirée des favoris');
      } else {
        request = () => axios.post(`/api/favorites/${spaceId}`);
        await request();
        toast.success('Ajoutée aux favoris');
      }
      
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong.');
    }
  }, [currentUser, hasFavorited, spaceId, loginModal, router]);

  return {
    hasFavorited,
    toggleFavorite
  }
}

export default useFavorite;
