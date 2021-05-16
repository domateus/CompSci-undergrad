#include <iostream>

#define GRAPH_SIZE 9

using namespace std;

int getVertexWithMinimalDistance(int distance[GRAPH_SIZE], bool includedVertices[GRAPH_SIZE]) {
  int minValue =  INT16_MAX, minIndex;
  
  // verificamos qual será o próximo nó a ser incluido, sendo sempre o de menor distancia em relação ao nó anterior dele
  for (short i = 0; i < GRAPH_SIZE; i++) {  
    if (includedVertices[i] == false && distance[i] <= minValue) {
      minValue = distance[i], minIndex = i;
    }
  }

  // pela forma da estrutura, o índice no array corresponde ao vértice que vamos incluir
  return minIndex;
}

void print(int distance[]) {
  printf("Vertex \t\t Distance from Source\n");
    for (int i = 0; i < GRAPH_SIZE; i++)
        printf("%d \t\t %d\n", i, distance[i]);
}

/**
 * O algoritimo de Dijkstra mantém duas estruturas principais de dados, uma delas com os vertices que já foram incluidos
 * e outra com a menor distância para, a partir da raiz, chegar em cada nó.
 * 
 * Seu funcionamento ocorre da seguinte forma:
 *  iniciamos a menor distancia pro vertice de origem sendo 0
 *  percorreremos todos os vertices menos um pois os caminhos entre este último para todos os outros vértices já teram sido computados
 *  |
 *  V
 *  // a parte gulosa do algoritmo, o nosso próximo nó inclusó é sempre o de menor caminho
 *  dado a estrutura de menores distâncias (caminhos), iniciaremos (incluir) o nó mais próximo (menor distância) que não tenha sido iniciado (incluso) ainda
 *    para todos os outros nós que este vertice leva, verificaremos se existe um caminho novo menor do que o já existente
 *    // esse passo garante que, para os nós anteriores que já incluimos, o menor caminho foi sempre selecionado e somado na estrutura de menores caminhos
 *  
 * Então imprimimos uma lista com a menor distância da origem para todos os outros nós
 * 
 */

void dijkstra(int graph[GRAPH_SIZE][GRAPH_SIZE], int srcVertex) {
  int distanceToSrc[GRAPH_SIZE];
  bool includedVertices[GRAPH_SIZE];

  for (int i = 0; i < GRAPH_SIZE; i++)
        distanceToSrc[i] = INT16_MAX, includedVertices[i] = false;

  distanceToSrc[srcVertex] = 0;

  for (int i = 0; i < GRAPH_SIZE - 1; i++) {

    int vertexIndex = getVertexWithMinimalDistance(distanceToSrc, includedVertices);

    includedVertices[vertexIndex] = true;

    for (int v = 0; v < GRAPH_SIZE; v++ ) {

      if (graph[vertexIndex][v] && // existe um caminho?
          !includedVertices[v] && // OPCIONAL, se caminho já for incluido, a menor distância já foi considerada e é assegurada pela próxima condição
          distanceToSrc[vertexIndex] + graph[vertexIndex][v] < distanceToSrc[v]) //novo caminho é menor do qual já existe?
          {
            // menor caminho = novo caminho
            distanceToSrc[v] = distanceToSrc[vertexIndex] + graph[vertexIndex][v];
          }
    }
  }
  print(distanceToSrc);
};



int main() {
  int graph[GRAPH_SIZE][GRAPH_SIZE] 
                      = { {0, 4, 0, 0, 0, 0, 0, 8, 0},
                          {4, 0, 8, 0, 0, 0, 0, 11, 0},
                          {0, 8, 0, 7, 0, 4, 0, 0, 2},
                          {0, 0, 7, 0, 9, 14, 0, 0, 0},
                          {0, 0, 0, 9, 0, 10, 0, 0, 0},
                          {0, 0, 4, 14, 10, 0, 2, 0, 0},
                          {0, 0, 0, 0, 0, 2, 0, 1, 6},
                          {8, 11, 0, 0, 0, 0, 1, 0, 7},
                          {0, 0, 2, 0, 0, 0, 6, 7, 0}};

  dijkstra(graph, 5);
}
