const fs = require('fs');
const path = require('path');

const baseLang = require('./locales/pt.json');
const localesDir = path.join(__dirname, 'locales');

function findMissingKeys(obj, base, path = []) {
  let missing = [];
  
  for (const key in base) {
    const currentPath = [...path, key];
    
    if (typeof base[key] === 'object' && !Array.isArray(base[key])) {
      if (!obj[key]) {
        missing.push(currentPath.join('.'));
      } else {
        missing = missing.concat(findMissingKeys(obj[key], base[key], currentPath));
      }
    } else if (obj[key] === undefined || obj[key] === "") {
      missing.push(currentPath.join('.'));
    }
  }
  
  return missing;
}

// Validar todos os idiomas
fs.readdirSync(localesDir).forEach(file => {
  if (file.endsWith('.json') && file !== 'pt.json') {
    const lang = file.replace('.json', '');
    const translations = require(`./locales/${file}`);
    const missing = findMissingKeys(translations, baseLang);
    
    if (missing.length > 0) {
      console.log(`❌ ${lang}: ${missing.length} traduções faltando`);
      missing.forEach(key => console.log(`   - ${key}`));
    } else {
      console.log(`✅ ${lang}: Completo`);
    }
  }
});
