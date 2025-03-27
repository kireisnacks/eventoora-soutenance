'use client';

import  Avatar  from "../ui/MyAvatar"
import { Separator } from "../ui/separator"

import { 
    Menu, 
    Heart, 
    UserRound, 
    CircleHelp, 
    HandCoins, 
    LogOut, 
    LogIn, 
    Armchair, 
    UserRoundPlus 
  } from 'lucide-react';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import UserMenuItem from "./UserMenuItem";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

interface UserMenuProps {
    currentUser?: SafeUser | null;
}


const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen ((value) => !value);
    }, []);

    return (
        <div className ="relative">
            <div className ="flex flex-row items-center gap-3">
                <div 
                    onClick={() => {}}
                    className= "hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                    Devenir un hôte
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md: py-1 px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                
                >
                    <Menu />
                    <div className="hidden md:block">
                    <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>

            {!isOpen && (
                <div
                className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-20 text-sm"
                >
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                                <>
                                    <UserMenuItem
                                        onClick={() => router.push("/m/favorites")}
                                        label = "Mes Favoris"
                                        icon = {Heart}
                                    />
                                    <UserMenuItem
                                        onClick={() => router.push("/m/listings")}
                                        label = "Mes Annonces"
                                        icon = {Armchair}
                                    />
                                    <UserMenuItem
                                        onClick={() => router.push("/m/profile")}
                                        label = "Profil"
                                        icon = {UserRound}
                                    />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Paiements"
                                        icon = {HandCoins}
                                    />
                                    <Separator />
                                    <UserMenuItem
                                        onClick={() => {}}
                                        label = "Support"
                                        icon = {CircleHelp}
                                    />
                                    <UserMenuItem
                                        onClick={() => signOut()}
                                        label = "Se Déconnecter"
                                        color = "text-red-500"
                                        icon = {LogOut}
                                    />
                                </>

                        ) : (
                            <>
                                <UserMenuItem
                                    onClick={loginModal.onOpen}
                                    label = "Se connecter"
                                    icon = {LogIn}
                                    color = "text-eventoora"
                                />
                                <UserMenuItem
                                    onClick={registerModal.onOpen}
                                    label = "S'inscrire"
                                    icon = {UserRoundPlus}
                                    color = "text-purple-500"
                                />
                                <Separator />
                                <UserMenuItem
                                    onClick={() => {}}
                                    label = "Support"
                                    icon = {CircleHelp}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>

    );
}

export default UserMenu;