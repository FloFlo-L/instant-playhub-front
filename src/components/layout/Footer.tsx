import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-muted text-secondary-foreground p-6 mt-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Games</h3>
          <ul>
            <li>Morpion</li>
            <li>Uno</li>
            <li>Puissance 4</li>
            <li>Breakout</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <ul>
            <li>Discord</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>Facebook</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Contact</h3>
          <p>123 Rue de Paris, 75001 Paris, France</p>
          <p>Email: contact@jeuxdefou.com</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p>&copy; 2024 JeuxDeFou. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
