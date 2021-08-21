#include <iostream>
#include <algorithm>
#include <list>
#include <stack>
#include "graph.hpp"

using namespace std;

Graph::Graph(int v) {
    this->V = v;
    this->adj = new list<int>[v];
}

void Graph::fillOrder(int v, bool visited[], stack<int> &Stack) {
    visited[v] = true;

    list<int>::iterator i;

    for (i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i])
            fillOrder(*i, visited, Stack);

    Stack.push(v);
}

Graph Graph::transpose() {
    Graph g(V);

    for (int v = 0; v < V; v++) {
        list<int>::iterator i;

        for (i = adj[v].begin(); i != adj[v].end(); ++i) {
            g.adj[*i].push_back(v);
        }
    }

    return g;
}

void Graph::addEdge(int v, int w) {
    this->adj[v].push_back(w);
}

void Graph::dfs(int v, bool visited[]) {
    visited[v] = true;
    cout << v + 1 << " ";

    list<int>::iterator i;

    for(i = adj[v].begin(); i != adj[v].end(); ++i) 
        if (!visited[*i])
            dfs(*i, visited);
}

void Graph::sccs() {
    stack<int> Stack;

    bool *visited = new bool[V];
    fill_n(visited, V, false);

    for (int k = 0; k < V; k++) 
        if (!visited[k])
            fillOrder(k, visited, Stack);

    fill_n(visited, V, false);

    Graph Rt = transpose();

    while (!Stack.empty()) {
        int v = Stack.top();
        Stack.pop();

        if (!visited[v]) {
            Rt.dfs(v, visited);
            cout << endl;
        }
    }

}