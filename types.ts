
export interface InfographicSection {
  header: string;
  points: string[];
}

export interface InfographicData {
  title: string;
  sections: InfographicSection[];
  quote?: string;
}

export interface ColorPalette {
  name: string;
  bg: string;
  text: string;
  title: string;
  accent: string;
  header: string;
}

export interface FontTheme {
  name: string;
  title: string;
  body: string;
}

export enum AspectRatio {
  Square = '1:1',
  Portrait = '9:16',
  Landscape = '16:9',
}

export interface Template {
  name: string;
  palette: ColorPalette;
  font: FontTheme;
  layoutClasses: string;
}
