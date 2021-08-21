#include <iostream>
#include "graph.hpp"

int main() {
    Graph a(10);
	a.addEdge(0, 1);
    a.addEdge(1, 2);
    a.addEdge(1, 4);
    a.addEdge(2, 6);
    a.addEdge(3, 0);
    a.addEdge(3, 7);
    a.addEdge(4, 3);
    a.addEdge(4, 5);
    a.addEdge(4, 8);
    a.addEdge(5, 2);
    a.addEdge(5, 9);
    a.addEdge(6, 5);
    a.addEdge(6, 9);
    a.addEdge(8, 7);
    a.addEdge(8, 9);
    a.addEdge(9, 8);


    Graph b(6);
    b.addEdge(0, 1);
    b.addEdge(0, 2);
    b.addEdge(1, 0);
    b.addEdge(2, 1);
    b.addEdge(2, 4);
    b.addEdge(3, 0);
    b.addEdge(3, 4);
    b.addEdge(3, 5);
    b.addEdge(4, 5);
    b.addEdge(5, 4);

    std::cout << "Componentes fortemente conexos da questão 1 - A)" << std::endl;
    a.sccs();
    
    std::cout << "Componentes fortemente conexos da questão 1 - B)" << std::endl;
    b.sccs();

    return 0;

}