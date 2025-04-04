'use client';

import { SafeUser } from "@/app/types";

import Container from "../Container"
import Logo from "./Logo";
import Menu from "./Menu";
import UserMenu from "./UserMenu";

interface NavBarProps {
  currentUser?: SafeUser | null ;
}

const Navbar: React.FC<NavBarProps> = ({
  currentUser
 }) => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div
        className="
          py-4
          border-b-[1px]
        "
      >
        <Container>
          <div
            className="
              flex
              flex-row
              items-center
              justify-between
              gap-3
              md:gap-0
            "
          >
              <div className="flex items-center space-x-4">
                <Logo />
                <Menu />
              </div>
              <UserMenu currentUser={currentUser}/>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Navbar;