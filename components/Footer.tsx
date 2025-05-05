export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="text-center">
      COPYRIGHT &copy; {currentYear} BY Service Name
    </div>
  )
}