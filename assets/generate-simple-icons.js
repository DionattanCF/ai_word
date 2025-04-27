const sharp = require('sharp');
const path = require('path');

const outputDir = __dirname;

const icons = [
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-64.png', size: 64 }
];

const bgColor = { r: 30, g: 58, b: 138, alpha: 1 }; // Azul escuro
const textSVG = size => `
<svg width='${size}' height='${size}' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' fill='rgb(${bgColor.r},${bgColor.g},${bgColor.b})'/>
  <text x='50%' y='60%' font-size='${Math.floor(size*0.6)}' font-family='Segoe UI, Arial, sans-serif' fill='white' text-anchor='middle' alignment-baseline='middle' font-weight='bold'>JT</text>
</svg>
`;

icons.forEach(({ name, size }) => {
  sharp(Buffer.from(textSVG(size)))
    .png()
    .toFile(path.join(outputDir, name), (err, info) => {
      if (err) {
        console.error(`Erro ao criar ${name}:`, err);
      } else {
        console.log(`Criado ${name} (${size}x${size})`);
      }
    });
}); 