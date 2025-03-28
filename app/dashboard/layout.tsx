export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="es">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}