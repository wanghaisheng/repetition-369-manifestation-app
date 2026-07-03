
import React from 'react';
import { getLocale, setLocale } from '@/paraglide/runtime';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getLocalizedPath } from '@/utils/languageUrl';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/config/routes';

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const LanguageSwitcher = () => {
  ;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as 'en' | 'zh');
    
    const newPath = getLocalizedPath(location.pathname, langCode as SupportedLanguage);
    
    navigate({ to: newPath + location.search + location.hash, replace: true });
  };

  const currentLanguage = languages.find(lang => lang.code === getLocale()) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={getLocale() === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
