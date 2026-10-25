# Catálogo de estilos — arquivos de imagem
Repositório: leothaylor/leo-thaylor-barber
Página: /catalogo.html

O código do site já cadastra as 32 referências do ZIP "Catalogo de cortes barbearia LT.zip".

COMO PUBLICAR:
1. No GitHub, abra a branch main e entre na pasta assets/catalogo/.
2. Clique em Add file > Upload files.
3. Envie os 32 PNGs originais OU o pacote WebP otimizado entregue na conversa (não envie o ZIP como arquivo único).
4. Preserve EXATAMENTE os nomes-base, espaços, maiúsculas, acentos e sufixos "-1" e "-2". O site procura .webp primeiro e .png depois.
5. Faça o commit. A página verifica os arquivos existentes e os exibe automaticamente, sem alterar código.

Não renomear arquivos. Para imagens NOVAS além das 32 cadastradas, incluir registro em catalogo-dados.js (file/title/tags).
Categorias: cortes, barbas, bigodes, desenhos. É possível usar mais de uma categoria por referência.
O catálogo contém imagens de inspiração, não deve ser confundido com o portfólio de cortes realizados.

Observações técnicas:
- GitHub Pages é estático: cada arquivo é verificado por requisição HEAD na própria pasta.
- Imagens ausentes permanecem ocultas até serem enviadas.
- Manter o portfólio original em assets/portfolio-*.jpg independente do catálogo.
- Os PNGs originais somam aproximadamente 69 MB; o pacote WebP otimizado fornecido ao usuário possui cerca de 5 MB. O site aceita ambos e prioriza WebP.
