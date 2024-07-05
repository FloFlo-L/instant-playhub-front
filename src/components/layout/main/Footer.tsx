import { FaDiscord, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface LinkItem {
  to: string;
  label: string;
  icon?: JSX.Element;
  disabled?: boolean;
}

interface DetailItem {
  type: 'link' | 'text';
  to?: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links?: LinkItem[];
  details?: DetailItem[];
}

const footerData: { [key: string]: FooterColumn } = {
  games: {
    title: "Games",
    links: [
      { to: "/tic-tac-toe", label: "Tic Tac Toe" },
      { to: "#", label: "Uno", disabled: true },
      { to: "#", label: "Breakout", disabled: true },
      { to: "#", label: "Connect Four", disabled: true },
    ]
  },
  followUs: {
    title: "Follow Us",
    links: [
      { to: "https://discord.com/", label: "Discord", icon: <FaDiscord size={15} className='mr-1' /> },
      { to: "https://x.com/", label: "Twitter", icon: <FaTwitter size={15} className='mr-1' /> },
      { to: "https://instagram.com/", label: "Instagram", icon: <FaInstagram size={15} className='mr-1' /> },
      { to: "https://facebook.com/", label: "Facebook", icon: <FaFacebook size={15} className='mr-1' /> },
    ]
  },
  contact: {
    title: "About",
    details: [
      { type: "link", to: "/contact-us", label: "Contact Us" },
      { type: "link", to: "/our-team", label: "Our Team" },
      { type: "text", label: "123 Rue de Paris, 75001 Paris, France" },
      { type: "text", label: "Email: contact@jeuxdefou.com" },
    ]
  }
};

const Footer = () => {
  return (
    <footer className="bg-muted text-secondary-foreground p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(footerData).map((column, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-lg mb-2">{column.title}</h3>
            <ul>
              {column.links ? (
                column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.disabled ? (
                      <span className="w-fit flex items-center cursor-not-allowed">
                        {link.label}
                      </span>
                    ) : (
                      <Link to={link.to} className="w-fit flex items-center hover:text-primary">
                        {link.icon}
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                column.details?.map((detail, detailIdx) => (
                  <li key={detailIdx}>
                    {detail.type === "link" ? (
                      <Link to={detail.to!} className="w-fit flex items-center hover:text-primary">
                        {detail.label}
                      </Link>
                    ) : (
                      detail.label
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p>&copy; 2024 InstantPlayhub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
