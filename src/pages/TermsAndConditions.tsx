import LayoutMain from "@/components/layout/main/LayoutMain";

const TermsAndConditions = () => {
    return (
        <LayoutMain>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold mb-8">Termes et conditions</h1>
                <div className="space-y-6 text-justify">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">1. Acceptation des Conditions</h2>
                        <p>En accédant à notre plateforme et en créant un compte, vous acceptez de respecter et d'être lié par les présentes conditions d'utilisation.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">2. Inscription et Sécurité du Compte</h2>
                        <p>
                            <strong>Inscription :</strong> Pour utiliser certaines fonctionnalités de notre plateforme, vous devez vous inscrire et créer un compte. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.
                        </p>
                        <p>
                            <strong>Sécurité du Compte :</strong> Vous êtes responsable de maintenir la confidentialité de votre mot de passe et des informations de votre compte. Vous acceptez de nous notifier immédiatement toute utilisation non autorisée de votre compte.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">3. Utilisation de la Plateforme</h2>
                        <p>
                            <strong>Contenu :</strong> Vous êtes responsable du contenu que vous publiez ou partagez sur notre plateforme. Tout contenu inapproprié, offensant ou illégal est strictement interdit.
                        </p>
                        <p>
                            <strong>Comportement :</strong> Vous vous engagez à respecter les règles de conduite de notre communauté et à ne pas utiliser la plateforme pour des activités illégales ou nuisibles.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">4. Propriété Intellectuelle</h2>
                        <p>
                            <strong>Droits de Propriété :</strong> Tout le contenu, y compris les jeux, graphiques, logos et textes, est protégé par des droits d'auteur et d'autres lois sur la propriété intellectuelle.
                        </p>
                        <p>
                            <strong>Licence d'Utilisation :</strong> Nous vous accordons une licence limitée, non exclusive et non transférable pour accéder et utiliser notre plateforme conformément à ces termes et conditions.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">5. Paiements et Abonnements</h2>
                        <p>
                            <strong>Frais :</strong> Certains services ou contenus peuvent être accessibles moyennant des frais. Vous acceptez de payer tous les frais associés à votre utilisation de notre plateforme.
                        </p>
                        <p>
                            <strong>Politique de Remboursement :</strong> Les frais payés ne sont pas remboursables sauf mention contraire dans une politique de remboursement spécifique.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">6. Confidentialité</h2>
                        <p>
                            <strong>Données Personnelles :</strong> Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles conformément à notre Politique de Confidentialité.
                        </p>
                        <p>
                            <strong>Partage de Données :</strong> Nous ne partagerons pas vos informations personnelles avec des tiers sans votre consentement, sauf dans les cas prévus par la loi.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">7. Limitation de Responsabilité</h2>
                        <p>Nous ne serons pas responsables des dommages indirects, spéciaux, consécutifs ou punitifs résultant de l'utilisation ou de l'impossibilité d'utiliser notre plateforme.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">8. Modifications des Termes et Conditions</h2>
                        <p>Nous nous réservons le droit de modifier ces termes et conditions à tout moment. Les modifications seront effectives dès leur publication sur notre site. Votre utilisation continue de notre plateforme après la publication des modifications constitue votre acceptation des nouveaux termes.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">9. Résiliation</h2>
                        <p>Nous nous réservons le droit de suspendre ou de résilier votre compte et votre accès à notre plateforme à tout moment, sans préavis, pour violation de ces termes et conditions.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">10. Contact</h2>
                        <p>Si vous avez des questions ou des préoccupations concernant ces termes et conditions, veuillez nous contacter à contact@instant-playbug.com.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">11. Loi Applicable</h2>
                        <p>Ces termes et conditions sont régis et interprétés conformément aux lois du pays dans lequel notre société est enregistrée, sans égard à ses conflits de dispositions légales.</p>
                    </div>
                </div>
            </div>
        </LayoutMain>
    );
};

export default TermsAndConditions;