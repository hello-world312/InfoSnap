import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Import AspectRatio as a value to access its members, and other definitions as types.
import { AspectRatio, type InfographicData, type ColorPalette, type FontTheme } from './types';
import { generateInfographicData } from './services/geminiService';
import InfographicPreview from './components/InfographicPreview';
import { SparklesIcon, DownloadIcon, ShareIcon, SunIcon, MoonIcon, PaletteIcon, FontIcon, AspectRatioIcon } from './components/icons';

// Add htmlToImage to the window interface
declare global {
    interface Window {
        htmlToImage: any;
    }
}

const colorPalettes: ColorPalette[] = [
  { name: 'Corporate Blue', bg: '#F3F8FF', text: '#334155', title: '#0A3D91', accent: '#0062FF', header: '#0A3D91' },
  { name: 'Forest Green', bg: '#F6FFF8', text: '#2d3748', title: '#1A535C', accent: '#4ECDC4', header: '#1A535C' },
  { name: 'Modern Dark', bg: '#1A202C', text: '#E2E8F0', title: '#FFFFFF', accent: '#6366F1', header: '#A0AEC0' },
  { name: 'Sunset Orange', bg: '#FFF5F0', text: '#4A5568', title: '#C05621', accent: '#ED8936', header: '#C05621' },
  { name: 'Royal Purple', bg: '#FAF5FF', text: '#4A5568', title: '#553C9A', accent: '#9F7AEA', header: '#553C9A' },
  { name: 'Minimalist Gray', bg: '#F7FAFC', text: '#2D3748', title: '#1A202C', accent: '#718096', header: '#1A202C' },
];

const fontThemes: FontTheme[] = [
  { name: 'Modern Sans', title: 'font-sans', body: 'font-sans' },
  { name: 'Classic Serif', title: 'font-serif', body: 'font-serif' },
  { name: 'Tech Mono', title: 'font-mono', body: 'font-mono' },
  { name: 'Mixed', title: 'font-serif', body: 'font-sans' },
];

// FIX: Use enum members for type safety instead of string literals.
const aspectRatios: AspectRatio[] = [AspectRatio.Square, AspectRatio.Portrait, AspectRatio.Landscape];


const App: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [infographicData, setInfographicData] = useState<InfographicData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(colorPalettes[0]);
    const [selectedFont, setSelectedFont] = useState<FontTheme>(fontThemes[0]);
    // FIX: Initialize useState with an AspectRatio enum member for type safety.
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(AspectRatio.Square);

    const infographicRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to generate an infographic.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setInfographicData(null);

        try {
            const data = await generateInfographicData(inputText);
            setInfographicData(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    const handleDownload = useCallback(() => {
        if (!infographicRef.current) return;
        
        window.htmlToImage.toPng(infographicRef.current, { quality: 0.95, pixelRatio: 2 })
            .then((dataUrl: string) => {
                const link = document.createElement('a');
                link.download = `infosnap-${new Date().getTime()}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err: Error) => {
                console.error('oops, something went wrong!', err);
                setError('Could not download image. Please try again.');
            });
    }, []);

    const handleShare = (platform: 'whatsapp' | 'telegram' | 'linkedin') => {
        const text = `Check out this infographic I made with InfoSnap!`;
        const url = `https://infosnap.example.com`; // Placeholder URL
        let shareUrl = '';

        switch(platform) {
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }
        window.open(shareUrl, '_blank');
        alert("Download the image first to share it on " + platform + "!");
    }

    const ControlButton = ({ onClick, children, isActive, className }: { onClick?: () => void; children: React.ReactNode; isActive?: boolean; className?: string }) => (
        <button onClick={onClick} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'} ${className}`}>
            {children}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            {/* Control Panel */}
            <aside className="w-full lg:w-1/3 xl:w-1/4 p-4 lg:p-6 flex flex-col gap-6 bg-gray-50 dark:bg-gray-800 lg:h-screen lg:overflow-y-auto">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5v4h3l-4 5z"></path></svg>
                        <h1 className="text-2xl font-bold">InfoSnap</h1>
                    </div>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                </header>

                <div>
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Text Content
                    </label>
                    <textarea
                        id="text-input"
                        rows={10}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 transition"
                        placeholder="Paste your article, notes, or data here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Customize</h3>
                    <div className="space-y-3">
                         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><PaletteIcon className="w-5 h-5" /> Color Palette</div>
                         <div className="flex flex-wrap gap-2">
                            {colorPalettes.map(p => (
                                <button key={p.name} onClick={() => setSelectedPalette(p)} title={p.name} className={`w-8 h-8 rounded-full border-2 transition ${selectedPalette.name === p.name ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: p.accent }}></button>
                            ))}
                         </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><FontIcon className="w-5 h-5" /> Font Theme</div>
                         <div className="flex flex-wrap gap-2">
                            {fontThemes.map(f => (
                                <ControlButton key={f.name} onClick={() => setSelectedFont(f)} isActive={selectedFont.name === f.name}>{f.name}</ControlButton>
                            ))}
                         </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><AspectRatioIcon className="w-5 h-5" /> Aspect Ratio</div>
                         <div className="flex flex-wrap gap-2">
                            {/* FIX: Remove unnecessary type assertion as 'r' is now correctly typed as AspectRatio. */}
                            {aspectRatios.map(r => (
                                <ControlButton key={r} onClick={() => setSelectedAspectRatio(r)} isActive={selectedAspectRatio === r}>{r}</ControlButton>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" /> Generate
                            </>
                        )}
                    </button>
                    {infographicData && (
                        <div className="grid grid-cols-2 gap-3">
                           <ControlButton onClick={handleDownload} className="w-full justify-center py-3"><DownloadIcon className="w-5 h-5" /> Download</ControlButton>
                           <div className="relative group w-full">
                                <ControlButton className="w-full justify-center py-3"><ShareIcon className="w-5 h-5" /> Share</ControlButton>
                                <div className="absolute bottom-full mb-2 w-48 right-0 p-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    <button onClick={() => handleShare('whatsapp')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">to WhatsApp</button>
                                    <button onClick={() => handleShare('telegram')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">to Telegram</button>
                                    <button onClick={() => handleShare('linkedin')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">to LinkedIn</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-200 dark:bg-gray-900/50">
                <div className="w-full max-w-4xl shadow-2xl rounded-2xl bg-white dark:bg-gray-800">
                     <InfographicPreview
                        infographicRef={infographicRef}
                        data={infographicData}
                        palette={selectedPalette}
                        fontTheme={selectedFont}
                        aspectRatio={selectedAspectRatio}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
