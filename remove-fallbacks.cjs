// Temporary Node.js script to remove CSS variable fallbacks
const fs = require('fs');
const path = require('path');

// Patterns to replace - remove fallback values from var() calls
const replacements = [
  // Common color fallbacks
  { from: /var\(--white,\s*#fff\)/g, to: 'var(--white)' },
  { from: /var\(--white,\s*#ffffff\)/gi, to: 'var(--white)' },
  { from: /var\(--theme-color,\s*#0da487\)/g, to: 'var(--theme-color)' },
  { from: /var\(--theme-color-light,\s*#[0-9a-fA-F]{6}\)/g, to: 'var(--theme-color-light)' },
  { from: /var\(--theme-color-dark,\s*#[0-9a-fA-F]{6}\)/g, to: 'var(--theme-color-dark)' },
  { from: /var\(--title-color,\s*#222\)/g, to: 'var(--title-color)' },
  { from: /var\(--title-color,\s*#222222\)/g, to: 'var(--title-color)' },
  { from: /var\(--content-color,\s*#767676\)/g, to: 'var(--content-color)' },
  { from: /var\(--content-color,\s*#666\)/g, to: 'var(--content-color)' },
  { from: /var\(--content-color,\s*#888\)/g, to: 'var(--content-color)' },
  { from: /var\(--content-color,\s*#999\)/g, to: 'var(--content-color)' },
  
  // Border colors
  { from: /var\(--border-color,\s*#[e|d][0-9a-fA-F]{2,5}\)/g, to: 'var(--border-color)' },
  { from: /var\(--border-color-light,\s*#[0-9a-fA-F]{6}\)/g, to: 'var(--border-color-light)' },
  
  // Background colors
  { from: /var\(--light-gray,\s*#[f|F][0-9a-fA-F]{5}\)/g, to: 'var(--light-gray)' },
  { from: /var\(--light-bg,\s*#[f|F][0-9a-fA-F]{5}\)/g, to: 'var(--bg-secondary)' },
  { from: /var\(--bg-color,\s*#[f|F][0-9a-fA-F]{5}\)/g, to: 'var(--bg-secondary)' },
  
  // Dark mode colors
  { from: /var\(--dark-bg,\s*#[0-2][0-9a-fA-F]{5}\)/g, to: 'var(--dark-bg)' },
  { from: /var\(--dark-bg-secondary,\s*#[0-2][0-9a-fA-F]{5}\)/g, to: 'var(--dark-bg-secondary)' },
  { from: /var\(--dark-text,\s*#fff\)/g, to: 'var(--dark-text)' },
  { from: /var\(--dark-text,\s*#ccc\)/g, to: 'var(--dark-text)' },
  { from: /var\(--dark-text-muted,\s*#[5-9][0-9a-fA-F]{2}\)/g, to: 'var(--dark-text-muted)' },
  { from: /var\(--dark-border,\s*#[3-4][0-9a-fA-F]{2}\)/g, to: 'var(--dark-border)' },
  { from: /var\(--dark-color,\s*#[0-2][0-9a-fA-F]{5}\)/g, to: 'var(--dark-color)' },
  { from: /var\(--dark-card-bg,\s*#[0-2][0-9a-fA-F]{5}\)/g, to: 'var(--dark-card-bg)' },
  
  // Toastify colors
  { from: /var\(--toastify-color-error,\s*#[0-9a-fA-F]{6}\)/gi, to: 'var(--toastify-color-error)' },
  { from: /var\(--toastify-color-success,\s*#[0-9a-fA-F]{6}\)/gi, to: 'var(--toastify-color-success)' },
  { from: /var\(--toastify-color-warning,\s*#[0-9a-fA-F]{6}\)/gi, to: 'var(--toastify-color-warning)' },
  { from: /var\(--toastify-color-info,\s*#[0-9a-fA-F]{6}\)/gi, to: 'var(--toastify-color-info)' },
];

// Hardcoded color replacements  
const hardcodedReplacements = [
  // Replace hardcoded theme green with variable
  { from: /#0da487/g, to: 'var(--theme-color)', exclude: ['_variables.scss', '_theme-variables.scss'] },
  { from: /#0b9177/g, to: 'var(--theme-color-dark)', exclude: ['_variables.scss', '_theme-variables.scss'] },
  { from: /#0a8770/g, to: 'var(--theme-color-dark)', exclude: ['_variables.scss', '_theme-variables.scss'] },
  { from: /#0b8a72/g, to: 'var(--theme-color-dark)', exclude: ['_variables.scss', '_theme-variables.scss'] },
  
  // Replace hardcoded grays
  { from: /rgba\(255,\s*255,\s*255,\s*0\.([0-9]+)\)/g, to: 'rgba(var(--theme-color-rgb), 0.$1)' },
];

// Files to process
const scssFiles = [
  'public/assets/scss/pages/_events-page.scss',
  'public/assets/scss/components/_events-card.scss',
  'public/assets/scss/components/_clinic-finder.scss',
  'public/assets/scss/components/_store-finder.scss',
  'src/components/account/orders/ReturnOrder.scss',
  'public/assets/scss/pages/_shop_page.scss',
  'public/assets/scss/pages/_herbs-page.scss',
  'public/assets/scss/pages/_cultivators-page.scss',
  'public/assets/scss/pages/_press-page.scss',
  'public/assets/scss/pages/_inner_pages.scss',
  'public/assets/scss/pages/_user-dashboard.scss',
];

function processFile(filePath) {
  const fullPath = path.join('d:/Hyplap/sdlindia', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping: ${filePath} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let changeCount = 0;
  
  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(from, to);
    }
  });
  
  // Apply hardcoded color replacements if not excluded
  const fileName = path.basename(filePath);
  hardcodedReplacements.forEach(({ from, to, exclude = [] }) => {
    if (!exclude.some(ex => fileName.includes(ex))) {
      const matches = content.match(from);
      if (matches) {
        changeCount += matches.length;
        content = content.replace(from, to);
      }
    }
  });
  
  if (changeCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ ${filePath}: ${changeCount} replacements`);
  } else {
    console.log(`- ${filePath}: No changes`);
  }
}

console.log('Removing CSS variable fallbacks...\n');
scssFiles.forEach(processFile);
console.log('\n✓ Complete!');
