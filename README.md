
#Resolução de problemas por meio de busca

###Objetivo

O trabalho tem por objetivo analisar e implementar umas das técnicas de buscas apresentadas em sala de aula. Discutir os resultados e abordar a solução para o problema, juntamente com um interface visual.

###O problema abordado

É abordado neste trabalho o problema das oito rainhas, que consiste em posicionar oito rainhas do xadrez de forma que nenhumas delas se ataquem. Publicado por Max Bezzel em 1848, teve a sua primeira solução publicada em 1850 por Franz Nauck ,que também extendeu o quebra cabeças, onde N rainhas podem se situar em um tabuleiro de NxN posições.


![tabuleiro](/public/tabuleiro.png)


###O ambiente

O trabalho é desenvolvido em cima do ambiente WEB, criado com JavaScript e utilizando o ReactJs como framework.

![meu tabuleiro](/public/meuTabuleiro.png)

Como é possível observar na figura acima, o funcionamento do programa é bastante simples. Cada clique no botão 'Next move' irá executar a implementação realizada do algorítimo de subida de encosta, descrito na seção abaixo.O score indicado no canto superior direito da figura, é atualizado a cada clique realizado pelo usuário. 


###A aplicação do algorítmo de subida de encosta

Esta solução foi escolhida devido à sua fácil implementação e possíveis adaptações que conseguem melhorar bastante os resultados esperados. Também temos que a subida de encosta é amplamente utilizada para a resolução deste problema.

Podemos dizer que a implementação realizada neste trabalho não é ótima e nem completa, pois é possível que o mesmo fiquei preso em máximos locais. Desta forma, também não garante o retorno do melhor resultado.

Por motivos de visualização e análise, a cada vez que é feito o clique no botão 'Next Move' uma iteração do algorítimo é executada.Segue abaixo o pseudocódigo de como cada iteração é realizada.

```
hillClimbing () {
    table : matriz nxn
    queens : vetor de posicoes das rainhas 
    bestMove : melhor movimento
    
    for(queen of queens) {
        sv = verticalBestMove(queen,table);
        sh = horizontalBestMove(queen,table);
        sd = diagonalBestMove(queen,table);
        
        localBestMove = returnBestScore(sv,sh,sd)
        if (localBestMove.score  <= bestMove.score){
            bestMove = localBestMove;
        }
    }
     executeBestMove(bestMove)
}

```

O código acima procura exemplificar, no geral, o funcionamento do algorítimo e por motivos de simplicidade algumas operações foram escondidas. 

A cada iteração ele percorre o vetor de rainhas, para cada rainha são executados os algoritimos que procuram encontrar os melhores movimentos na vertical,horizontal e diagonal. É selecionado dentre estes o melhor. Assim, ele é comparado com o melhor movimento no geral, caso o score seja menor ou igual, então este movimento é selecionado.

Após ter percorrido o vetor de rainhas, o que permanecer como melhor movimento será executado.


###Conclusão

A solução para o problema não é ótima, e técnicas poderiam ser aplicadas para evitar loops causados pelos máximos locais, como a têmpera simulada, por exemplo. Contudo, um dos focos do trabalho era apresentar uma interface gráfica e didática, não a melhor técnica. Por isso, pode-se dizer que o objetivo deste trabalho foi satisfeito. 

