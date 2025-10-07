import { Logo } from "../Logo";
import { Navigation } from "../Navigation";

export const Header = () => {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};
