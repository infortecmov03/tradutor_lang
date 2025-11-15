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
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 
