// scripts/generate-locales.js
const fs = require('fs');
const path = require('path');

// Conteúdo completo da estrutura base (seu JSON original)
const baseStructure = {
  auth: {
    sign_in: "Iniciar Sessão",
    sign_up: "Criar Conta",
    sign_out: "Terminar Sessão",
    // ... todo o seu conteúdo original
  },
  dashboard: {
    // ... todo conteúdo
  },
  // ... todas as categorias
};

const languages = {
  pt: "Português",
  en: "English",
  ts: "Xitsonga", 
  sw: "Swahili",
  sn: "Sena",
  nd: "Ndau",
  lomwe: "Elomwe",
  chuwabo: "Echuwabo"
};

// Criar estrutura de diretórios
const createStructure = () => {
  const directories = [
    'locales',
    'scripts', 
    '.github/workflows'
  ];

  directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Criada pasta: ${dir}`);
    }
  });
};

// Criar arquivos de locale
const createLocaleFiles = () => {
  Object.keys(languages).forEach(lang => {
    const filePath = path.join(__dirname, '..', 'locales', `${lang}.json`);
    
    let content;
    if (lang === 'pt') {
      content = baseStructure; // Português preenchido
    } else {
      // Outros idiomas vazios
      content = createEmptyStructure(baseStructure);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`✅ Criado: locales/${lang}.json`);
  });
};

function createEmptyStructure(obj) {
  const empty = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      empty[key] = createEmptyStructure(obj[key]);
    } else {
      empty[key] = "";
    }
  }
  return empty;
}

// Criar arquivo index.js do tradutor
const createIndexFile = () => {
  const indexContent = `const translations = {
${Object.keys(languages).map(lang => `  ${lang}: require('./${lang}.json')`).join(',\n')}
};

class Translator {
  constructor(defaultLang = 'pt') {
    this.currentLang = defaultLang;
    this.fallbackLang = 'pt';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
    } else {
      console.warn(\`Idioma \${lang} não encontrado. Usando \${this.fallbackLang}\`);
      this.currentLang = this.fallbackLang;
    }
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = translations[this.currentLang];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (value === undefined) {
      value = translations[this.fallbackLang];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    if (value && typeof value === 'string') {
      return value.replace(/{(\w+)}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return value || key;
  }

  getAvailableLanguages() {
    return Object.keys(translations).map(code => ({
      code,
      name: this.getLanguageName(code)
    }));
  }

  getLanguageName(code) {
    const names = {
      pt: 'Português',
      en: 'English',
      ts: 'Xitsonga',
      sw: 'Swahili',
      sn: 'Sena',
      nd: 'Ndau',
      lomwe: 'Lomwe',
      chuwabo: 'Chuwabo'
    };
    return names[code] || code;
  }
}

module.exports = new Translator();
`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'locales', 'index.js'), 
    indexContent
  );
  console.log('✅ Criado: locales/index.js');
};

// Executar
createStructure();
createLocaleFiles(); 
createIndexFile();
console.log('🎉 Estrutura criada com sucesso!');
