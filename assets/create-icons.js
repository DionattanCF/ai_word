// Script para criar arquivos PNG a partir de dados Base64
const fs = require('fs');
const path = require('path');

const base64Icons = {
    '16': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABeklEQVRYhe2Xz0rDQBDGf0lTak9eBD+gN8GTD+JLiCePXgQfwav4GuJJn0DwDRTBuxQPsdAeSrVbD5kl28ZkN4khBwc+2Ew2M9/OzuxuQYMGHwLHwDvwBPSVeK/AAbAD/KgahU68A1m1CpEz8QnZg6Dg1bPdZBXIhfEWeMDFeTbNItPqAB0RN9xYQ6svQZ4JMXvNOMzEo4g+lHnGTJyVnLBZ3MzNpO9J2CZ9LLQTAcbK+K4ynwBjoTHQEHgp83egE2BfRJ8l5SbwR1nMzAldTdRs4MUPIo5nQi8gEi1zyY74ynJCAWY1xqS1EK25OeHQeIDhDNhK6wZLTZ+JuF97CTBzYqfkxJaYs2wlJmam4O7AUlkYDyg3sSBmdzUmbMbsEz5kXPYN8ClKGHK/+QhwR/GLaEj1V/Ea4cuxOu45Tii8itiLLbQp53YEnKrLvZeajcrtYUXeRZkzw19KMUz8lJuJmfArMZFpJspMJMBl2Z5JEBdUbLjzmuOoQYM/gV84rEZbihvL8QAAAABJRU5ErkJggg==',
    '32': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABeklEQVRYhe2Xz0rDQBDGf0lTak9eBD+gN8GTD+JLiCePXgQfwav4GuJJn0DwDRTBuxQPsdAeSrVbD5kl28ZkN4khBwc+2Ew2M9/OzuxuQYMGHwLHwDvwBPSVeK/AAbAD/KgahU68A1m1CpEz8QnZg6Dg1bPdZBXIhfEWeMDFeTbNItPqAB0RN9xYQ6svQZ4JMXvNOMzEo4g+lHnGTJyVnLBZ3MzNpO9J2CZ9LLQTAcbK+K4ynwBjoTHQEHgp83egE2BfRJ8l5SbwR1nMzAldTdRs4MUPIo5nQi8gEi1zyY74ynJCAWY1xqS1EK25OeHQeIDhDNhK6wZLTZ+JuF97CTBzYqfkxJaYs2wlJmam4O7AUlkYDyg3sSBmdzUmbMbsEz5kXPYN8ClKGHK/+QhwR/GLaEj1V/Ea4cuxOu45Tii8itiLLbQp53YEnKrLvZeajcrtYUXeRZkzw19KMUz8lJuJmfArMZFpJspMJMBl2Z5JEBdUbLjzmuOoQYM/gV84rEZbihvL8QAAAABJRU5ErkJggg==',
    '80': 'iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEXklEQVR4nO2cW2vcVRSGnzXJJJmZXJqmjVVr1VoQb4ggXhCKYGmtiKgU/QP+EP+OeBHBC0GkKBVFakVEWrU1idUmtZfYJJPJZTJ7LzjhmJnMnJn57B6S/WCYy3dmrff79jp7r7322lBQUFBQUFBQcKsRLXJcBcwC7wOPAfeV+1PAL8B+4ENgDJi/aRauLgmwDSgBR4Gfgak1tKsK2A2cBT4HvgA+AWqXwdAuIoEY30RMBH5G3F8GbAZGgCbwO/AY8AjwJXC+n4buhNoLwH3AMHAaOAQcr5BrM7AbGAJmi7JrIeqAeuAZoB74Gfi1Qq4hYCp/0wrWgbcBm4EbwAEk9pXyZz+NKrhWLAJrlgR5Z1xhHpgEZoARMeusB55HKuIosAU4BpwF+oBPgYvAXuAF4B4k5g3gBHAKOA/cFRn7FO6IfwLvAf8Ab6JgslwZRkUPDaPfXgH+Br7pliEKEvMAKsj3oSjbQIt7Ewhop4CnUeR9G02jLNqsAlKrXHsf8DTwAKoHvwW+Bi5Ua3jAQOQMMAbsQpPiYETc06hsWQ8cB/agarqVVvcwMGOOEWAXNQ7HEj3AngqudwEZH0Z139vAM8CTwEHgGi0ivtGcM8AEaiG3ocg9h2bHiLk2Bl6gNZuBUdQE34VC8xvgsjPiErMoMu9Ek2QaFf82JUoZRtG8GelD9MFvgZnETY7pgDfM53FUlpRQ3zeDZsU0aiduoPIlQRXwBArXPJ9XkdP5bPQ5OruP1YCDwBwSeAI5bRcgXwW8jlz0V+ARtOxKUD2XoJlTRrXkThSJCzlfGfgE+Aj4ruytbhKgqPo5cWKpMQfs7bYRnTKB5v11JGoTaqkG0ATJFzGtwq3dbJwHvkMi7kDVxvXK/RFU2UxGbtQbkVvyEKoLbwPGUXPamJtJrRxXRnXkUVRNPIt6ypXoQz3oPArcF4EGcAl4CrWCW1Ebu562m+4u5DvkrFO0TpPVaKK5vgc1w+1MnzFUcUx1wKbVjK7G5+ZIK+daRda7getUHzj0oaDUSRO8yC2+oVZQUFBQUFBQUFBQUFBQUFDQLXot4lqNBrW5HiQGloBLaH9iFDRQW5hkzusoXXQWbfbPZa43gecyd85SuXEeA39F5nMGbcqvoT1sQOZ8hmVbf5OoQypn/j4ObDD3zcvcy8hwOzETmoiMLCNjLdfd6Fhi7humuWk9gza6PSfQlUAfA0+YG88At5v/R+bu60ci5dOqPrQnHaFNPi4lWjVr3UiUJWYfv3Xd0cqBrqwUZBK9uXgb2lqLkCh1aGvORdk6csm8p5C53UDbt3WolekzNsScT6L3RXL3xui99Wa02b5c/l5mz7/m+4ue4S4BH0Bv4M6hovsQevNxDr3qfAK9An0QBY08fSyv4vLpn0RHBEyT/YFI1Mvl46S5dwYJdgF4zDx/EXg3YoUX7d1IbefZhArw5crAXrTmizF7/hFFR56/z78ZmUcTbQa9wX45xv8c6YKCgoKCgoKCgv8B/wJX4qEEe2D/gQAAAABJRU5ErkJggg==',
    '128': 'iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEXklEQVR4nO2cW2vcVRSGnzXJJJmZXJqmjVVr1VoQb4ggXhCKYGmtiKgU/QP+EP+OeBHBC0GkKJVFakVEWrU1idUmtZfYJJPJZTJ7LzjhmJnMnJn57B6S/WCYy3dmrff79jp7r7322lBQUFBQUFBQcKsRLXJcBcwC7wOPAfeV+1PAL8B+4ENgDJi/aRauLgmwDSgBR4Gfgak1tKsK2A2cBT4HvgA+AWqXwdAuIoEY30RMBH5G3F8GbAZGgCbwO/AY8AjwJXC+n4buhNoLwH3AMHAaOAQcr5BrM7AbGAJmi7JrIeqAeuAZoB74Gfi1Qq4hYCp/0wrWgbcBm4EbwAEk9pXyZz+NKrhWLAJrlgR5Z1xhHpgEZoARMeusB55HKuIosAU4BpwF+oBPgYvAXuAF4B4k5g3gBHAKOA/cFRn7FO6IfwLvAf8Ab6JgslwZRkUPDaPfXgH+Br7pliEKEvMAKsj3oSjbQIt7Ewhop4CnUeR9G02jLNqsAlKrXHsf8DTwAKoHvwW+Bi5Ua3jAQOQMMAbsQpPiYETc06hsWQ8cB/agarqVVvcwMGOOEWAXNQ7HEj3AngqudwEZH0Z139vAM8CTwEHgGi0ivtGcM8AEaiG3ocg9h2bHiLk2Bl6gNZuBUdQE34VC8xvgsjPiErMoMu9Ek2QaFf82JUoZRtG8GelD9MFvgZnETY7pgDfM53FUlpRQ3zeDZsU0aiduoPIlQRXwBArXPJ9XkdP5bPQ5OruP1YCDwBwSeAI5bRcgXwW8jlz0V+ARtOxKUD2XoJlTRrXkThSJCzlfGfgE+Aj4ruytbhKgqPo5cWKpMQfs7bYRnTKB5v11JGoTaqkG0ATJFzGtwq3dbJwHvkMi7kDVxvXK/RFU2UxGbtQbkVvyEKoLbwPGUXPamJtJrRxXRnXkUVRNPIt6ypXoQz3oPArcF4EGcAl4CrWCW1Ebu562m+4u5DvkrFO0TpPVaKK5vgc1w+1MnzFUcUx1wKbVjK7G5+ZIK+daRda7getUHzj0oaDUSRO8yC2+oVZQUFBQUFBQUFBQUFBQUFDQLXot4lqNBrW5HiQGloBLaH9iFDRQW5hkzusoXXQWbfbPZa43gecyd85SuXEeA39F5nMGbcqvoT1sQOZ8hmVbf5OoQypn/j4ObDD3zcvcy8hwOzETmoiMLCNjLdfd6Fhi7humuWk9gza6PSfQlUAfA0+YG88At5v/R+bu60ci5dOqPrQnHaFNPi4lWjVr3UiUJWYfv3Xd0cqBrqwUZBK9uXgb2lqLkCh1aGvORdk6csm8p5C53UDbt3WolekzNsScT6L3RXL3xui99Wa02b5c/l5mz7/m+4ue4S4BH0Bv4M6hovsQevNxDr3qfAK9An0QBY08fSyv4vLpn0RHBEyT/YFI1Mvl46S5dwYJdgF4zDx/EXg3YoUX7d1IbefZhArw5crAXrTmizF7/hFFR56/z78ZmUcTbQa9wX45xv8c6YKCgoKCgoKCgv8B/wJX4qEEe2D/gQAAAABJRU5ErkJggg=='
};

// Função para salvar dados base64 como arquivo PNG
function saveBase64AsPng(base64Data, filePath) {
    // Remover cabeçalho (data:image/png;base64,) se existir
    const base64Image = base64Data.includes('base64,') 
        ? base64Data.split('base64,')[1] 
        : base64Data;
    
    const buffer = Buffer.from(base64Image, 'base64');
    
    fs.writeFileSync(filePath, buffer, (err) => {
        if (err) {
            console.error(`Erro ao salvar ${filePath}:`, err);
            return;
        }
    });
}

// Diretório para salvar os ícones
const iconsDir = path.join(__dirname);

// Criar arquivos de ícones
console.log('Criando arquivos de ícones...');

saveBase64AsPng(base64Icons['16'], path.join(iconsDir, 'icon-16.png'));
saveBase64AsPng(base64Icons['32'], path.join(iconsDir, 'icon-32.png'));
saveBase64AsPng(base64Icons['80'], path.join(iconsDir, 'icon-80.png'));
saveBase64AsPng(base64Icons['128'], path.join(iconsDir, 'icon-128.png'));

console.log('Ícones criados com sucesso em:', iconsDir);
console.log('- icon-16.png');
console.log('- icon-32.png');
console.log('- icon-80.png');
console.log('- icon-128.png'); 