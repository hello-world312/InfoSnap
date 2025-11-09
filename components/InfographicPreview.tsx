
import React from 'react';
import type { InfographicData, ColorPalette, FontTheme, AspectRatio } from '../types';

interface InfographicPreviewProps {
  infographicRef: React.RefObject<HTMLDivElement>;
  data: InfographicData | null;
  palette: ColorPalette;
  fontTheme: FontTheme;
  aspectRatio: AspectRatio;
  isLoading: boolean;
}

const getAspectRatioClass = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case '1:1':
      return 'aspect-square';
    case '9:16':
      return 'aspect-[9/16]';
    case '16:9':
      return 'aspect-[16/9]';
    default:
      return 'aspect-square';
  }
};

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0114 18.442V18.75a3.375 3.375 0 01-3.375 3.375h-.25A3.375 3.375 0 017 18.75v-.308c0-.73-.24-1.42-.668-2.003L5.63 15.01l-.707-.707m9.9 2.828l-.707.707M15 6.343A1.5 1.5 0 0116.5 4.5h.008v.008h-.008A1.5 1.5 0 0115 6.343z" />
            </svg>
        </div>
        <h2 className="mt-6 text-xl font-bold text-gray-800 dark:text-gray-200">Welcome to InfoSnap</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
            Paste your text in the panel, choose your style, and click "Generate" to create your infographic instantly.
        </p>
    </div>
);

const LoadingState: React.FC = () => (
     <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
        <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="mt-6 text-xl font-bold text-gray-800 dark:text-gray-200">Generating Your Infographic...</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Our AI is analyzing your text and bringing it to life. This might take a few seconds.</p>
    </div>
);


const InfographicPreview: React.FC<InfographicPreviewProps> = ({ infographicRef, data, palette, fontTheme, aspectRatio, isLoading }) => {
    if (isLoading) {
        return <LoadingState />;
    }
    
    if (!data) {
        return <InitialState />;
    }

    const { title, sections, quote } = data;
    const aspectClass = getAspectRatioClass(aspectRatio);

    return (
        <div ref={infographicRef} className={`w-full max-w-full overflow-hidden transition-all duration-300 ease-in-out ${aspectClass}`} style={{ backgroundColor: palette.bg }}>
            <div className={`p-8 md:p-10 lg:p-12 h-full flex flex-col ${fontTheme.body}`}>
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center ${fontTheme.title}`} style={{ color: palette.title }}>
                    {title}
                </h1>
                <div className="flex-grow space-y-6 overflow-y-auto pr-2">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-xl md:text-2xl font-semibold mb-3 flex items-center" style={{ color: palette.header }}>
                                <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: palette.accent }}></span>
                                {section.header}
                            </h2>
                            <ul className="list-none pl-6 space-y-2">
                                {section.points.map((point, pIndex) => (
                                    <li key={pIndex} className="flex items-start">
                                        <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0" style={{ color: palette.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span style={{ color: palette.text }}>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {quote && (
                    <div className="mt-auto pt-6 text-center">
                        <p className="text-lg md:text-xl italic" style={{ color: palette.text }}>
                            "{quote}"
                        </p>
                    </div>
                )}
                 <div className="text-center mt-6 text-xs" style={{color: palette.text, opacity: 0.6}}>
                    Generated with InfoSnap
                </div>
            </div>
        </div>
    );
};

export default InfographicPreview;

