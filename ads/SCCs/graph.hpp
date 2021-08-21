#include <list>
#include <stack>

class Graph {
    private:
        int V;
        std::list<int> *adj;
        void fillOrder(int, bool [], std::stack<int> &);
        void dfs(int, bool []);
        Graph transpose();

    public:
        Graph(int);
        void addEdge(int, int);
        void sccs();
};