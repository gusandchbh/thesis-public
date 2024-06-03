import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <div className="relative  w-full flex items-center justify-center z-10">
      <div className="absolute top-0 right-0 p-3">
        <AuthButton />
      </div>
    </div>
  );
}
