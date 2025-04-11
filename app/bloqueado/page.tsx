export default function Bloqueado() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold m-4">Acceso Bloqueado</h1>
        <p className="m-4">
          Tu acceso ha sido bloqueado. Por favor, contacta a soporte:
        </p>
        <div className="m-4 bg-gray-100 p-4 rounded-lg shadow-md font-bold">
          <ul>
            <li className="mb-2">correo@pissa.com</li>
            <li className="mb-2">+52 9999999999</li>
          </ul>
        </div>
        <p className="text-xs m-4">
          Recuerda que las solitudes de desbloqueo pueden llegar a tardar hasta
          24 horas en ser atendidas, en caso de no haber sido atendido en ese
          tiempo, por favor vuelve a contactar a soporte.
        </p>
      </div>
    </div>
  );
}
