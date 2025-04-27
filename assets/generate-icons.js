const sharp = require('sharp');
const path = require('path');

const baseIcon = path.join(__dirname, 'icon-80.png'); // PNG base existente

const sizes = [
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-64.png', size: 64 }
];

sizes.forEach(({ name, size }) => {
  sharp(baseIcon)
    .resize(size, size)
    .toFile(path.join(__dirname, name), (err, info) => {
      if (err) {
        console.error(`Erro ao criar ${name}:`, err);
      } else {
        console.log(`Criado ${name} (${size}x${size})`);
      }
    });
}); 