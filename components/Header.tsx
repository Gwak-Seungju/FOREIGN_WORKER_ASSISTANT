'use client'

import { useState } from "react";

const LANGUAGE = [
  "English", "한국어", "몰라1", "몰라2", "몰라3", "몰라4"
];

function LanguageDropdown () {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGE[0]);

  const toggleDropdown = () => {
    setIsDropdownOpen((state) => !state);
  }

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={toggleDropdown}>{language}</button>
      {isDropdownOpen && (
      <div className="flex flex-col absolute top-6">
        {LANGUAGE.map((lang) => (
          <button
            key={lang}
            onClick={() => selectLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
      )}
    </div>
  )
}

export default function Header() {
  return (
    <div>
      <nav className="flex justify-end gap-6 p-2">
        <LanguageDropdown />
        <button>로그인</button>
        <div>소개</div>
        <div>자주 묻는 질문</div>
      </nav>
      <header className="flex justify-between items-center h-19">
        <div className="flex gap-3">
          <div className= "w-7 h-7 bg-blue-500">로고</div>
          <div>Service Name</div>
        </div>
        <nav className="flex flex-1 justify-evenly">
          <button>소통게시판</button>
          <button>챗봇</button>
          <button>일자리 찾기</button>
        </nav>
      </header>
    </div>
  )
}