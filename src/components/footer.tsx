export default function Footer() {
    return (
        <footer className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <span className="text-muted-foreground block text-center text-sm"> © {new Date().getFullYear()} BioMatch, All rights reserved Built by <a href="https://linkedin.com/in/mikael-endale" target="_blank" rel="noopener noreferrer" className="text-primary">@ Mikael Endale</a> <a href="https://github.com/mikaelendale" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Github</a> <a href="https://twitter.com/mikael_endale" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Twitter</a></span>
            </div>
        </footer>
    );
}