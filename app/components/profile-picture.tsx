export default function ProfilePicture({ nombre }) {
    // Generar un color aleatorio
    const randomColor = () => {
      const colors = ["bg-[#FF495C]", "bg-[#AEC5EB]", "bg-[#42B883]", "bg-[#F9DC5C]", "bg-[#D55672]", "bg-[#F4A261]"];
      return colors[Math.floor(Math.random() * colors.length)];
    };
  
    // Extraer iniciales del nombre
    const getInitials = (name: string) => {
      if (!name) return "??";
      const parts = name.split(" ");
      const first = parts[0] ? parts[0][0] : "";
      return `${first}`.toUpperCase();
    };
  
    return (
      <div
        className={`w-8 h-8 ${randomColor()} rounded-full flex items-center justify-center text-white font-bold`}
      >
        {getInitials(nombre)}
      </div>
    );
  }  