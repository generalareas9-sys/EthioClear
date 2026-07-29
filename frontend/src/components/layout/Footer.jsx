// src/components/layout/Footer.jsx
// Simple footer shown on every page. Repeats the prototype disclaimer
// so it's always visible, consistent with the certificate PDF footer.

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500">
      <p>EthioClear — University Graduation Project Prototype. Not a real government system.</p>
      <p className="mt-1">© {year} EthioClear Academic Project</p>
    </footer>
  );
}

export default Footer;
