'use client';

import Image from 'next/image';
import Logo from '@/components/Logo';

export default function Footer() {
    return (
        <footer className="py-12 px-6 bg-dark-teal text-neutral">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-between gap-8">
                    <div className="max-w-xs">
                        <Logo variant="footer" className="mb-4" />
                        <p className="text-sm text-neutral text-justify">
                            Plataforma tecnológica para el saneamiento y restauración de la cuenca Lerma-Chapala-Santiago.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-cream">Colaboración</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://www.tecnm.mx/" className="text-neutral hover:text-accent transition-colors">TECNM</a></li>
                            <li><p className="text-neutral hover:text-accent transition-colors">Universidades</p></li>
                            <li><p className="text-neutral hover:text-accent transition-colors">Municipios</p></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-cream">Contacto</h4>
                        <ul className="space-y-2 text-sm text-neutral">
                            <li>info@cuencahub.mx</li>
                            <li>+52 (33) 1234-5678</li>
                            <li>Guadalajara, Jalisco</li>
                        </ul>
                    </div>

                    <div className="flex items-center backdrop-blur-sm">
                        <a href="https://www.copernicus.eu/es" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/logo/Copernicus_logo.png"
                                alt="Copernicus Logo"
                                width="200"
                                height="80"
                                className="object-contain mix-blend-multiply"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 text-center text-sm border-t text-neutral" style={{ borderTopColor: 'var(--color-teal)' }}>
                    <p>&copy; 2025 Cuenca Hub. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
