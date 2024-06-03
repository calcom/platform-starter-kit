import { Balancer } from "react-wrap-balancer";

interface HeroProps {
  title: string;
  children?: React.ReactNode;
}

export const Hero = ({ title, children }: HeroProps) => {
  return (
    <div
      className="flex min-h-96 flex-col justify-center bg-cover bg-center bg-no-repeat py-20"
      style={{ backgroundImage: "url('/hero.jpg')" }}>
      <div className="container mt-16 flex flex-col items-center justify-center gap-12 px-4 py-6">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-white">
          <Balancer>{title}</Balancer>
        </h1>
        {children}
      </div>
    </div>
  );
};
