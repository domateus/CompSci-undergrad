const input = [
    [0, 2, 0, 0, 2, 0, 0, 0, 0],
    [2, 0, 3, 1, 1, 0, 0, 0, 0],
    [0, 3, 0, 1, 0, 0, 6, 0, 0],
    [0, 1, 1, 0, 5, 3, 0, 2, 3],
    [2, 1, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 2, 0, 5],
    [0, 0, 6, 0, 0, 2, 0, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 1],
    [0, 0, 0, 3, 0, 5, 0, 1, 0]
]

const deepClone = (obj) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

const oddEdges = () => {
    let pathSum = 0;
    const oddV = [];
    input.forEach((V, i) => {
        const values = [];
        V.forEach(E => {
            if (E > 0) values.push(E);
        })
        if (values.length & 1) oddV.push(i);
        pathSum += values.reduce((prev, acc) => acc + prev, 0);

    })
    pathSum >>= 1;

    return {pathSum , oddV }
}

const { pathSum, oddV } = oddEdges();

const dijkstra = (s, input) => {
    const nextV = (vs, included) => {
        let d = Number.MAX_VALUE
        let v;
        for (let i = 0; i < vs.length; i++) {
            if (!included[i] && vs[i].d <= d) {
                d = vs[i].d
                v = i
            }
        }
        return v;
    }

    const vs = input.map((v, i) => ({
        v: i === s ? -1 : null,
        d: i === s ? 0 : Number.MAX_VALUE
    }))

    const included = vs.map(v => false)

    for(let i = 1; i < vs.length; i++) {
        const v = nextV(vs, included)
        included[v] = true;

        for (let j = 0; j < input.length; j++) {

            if (input[v][j] && !included[j] && vs[v].d + input[v][j] < vs[j].d) {
                vs[j].d = vs[v].d + input[v][j]
                vs[j].v = v
            }

        }
    }

    return vs
}

const buildCostMatrix = (input) => {
    const { oddV } = oddEdges();
    const costMatrix = []
    for (let i = 0; i < oddV.length; i++) {
        const ds = dijkstra(oddV[i], input);
        const l = []
        for (let j = 0; j < oddV.length; j++) {
            if (i === j) l.push(9999);
            else l.push(ds[oddV[j]].d);
        }
        costMatrix.push(l)
    }

    return costMatrix

}

const hungarian = (input) => {
    const subMin = (input) => {
    const transpose = []
    input[0].forEach(_ => transpose.push([]))
    for(let i = 0; i < input.length; i++) {

        let min = input[i][0];
        input[i].forEach(e => {
            if (e < min) min = e
        });

        input[i] = input[i].map((e, j) => {
            const m = e-min
            transpose[j].push(m)
            return m
        });
    }
    return transpose
}

    const leastZeroRow = (input) => {
        let min = input[0].reduce((p, c) => p+c, 0);
        if (min === 0) min = Number.MAX_SAFE_INTEGER
        let row = 0;
        for (let i = 1; i< input.length; i++) {
            const rowSum = input[i].reduce((p,c) => p+c, 0)
            if (rowSum < min && rowSum > 0) {
                row = i
                min = rowSum
            }
        }
        return {row, min}
    }

    const markElements = (input) => {
        const rows = [];
        const markedRowEls = []
        while(rows.length < input.length) {
            const { row } = leastZeroRow(input)
            rows.push(row)
        
            let flag = false;
            let col;
            for (let i = 0; i<input[row].length; i++) {
                if (input[row][i]) {
                    if (!flag){
                        col = i
                        flag = input[row][i];
                        markedRowEls.push([row, i])
                    }
                    input[row][i] = false
                }
            }


            input.forEach((r, i) => r[col] = false)
        }
        return {rows, markedRowEls}
    }

    const markMatrix = (matrix, boolMatrix) => {
        let clonedBool = boolMatrix.map(l => l.map(c => c))
        const {rows, markedRowEls} = markElements(clonedBool); 
        clonedBool = boolMatrix.map(l => l.map(c => c))
        const unmarkedRows = [];
        const cols = []
        const markedColEls = []
        for (let i = 0; i<matrix.length; i++) {
            if (!rows.includes(i)) {
                unmarkedRows.push(i)

                for (let j = 0; i<matrix[i].length; j++) {
                    if (matrix[i][j]) {
                        const isMarkedAlready = markedRowEls.find(e => e === [i, j]);

                        if (!isMarkedAlready) {
                            markedColEls.push([i,j])
                            if (!cols.find(c => c === j)) cols.push(j)
                        }
                    }
                }
            }
        }
        return {rows, markedRowEls, unmarkedRows, cols, markedColEls}
    }

    const adjustMatrix = (matrix, boolMatrix) => {
        const {rows, cols} = markMatrix(matrix, boolMatrix)

        let min = Number.MAX_SAFE_INTEGER

        for (let i = 0; i < matrix.length; i++) {
            if (!rows.includes(i)) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (!cols.includes(j)) {
                        if (matrix[i][j] < min) min = matrix[i][j]
                    }
                }
            }
        }

        for (let i = 0; i < matrix.length; i++) {
            if (!rows.includes(i)) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (!cols.includes(j)) {
                        matrix[i][j] -= min
                    }
                }
            }
        }

        for (let i = 0; i < matrix.length; i++) {
            if (rows.includes(i)) {
                cols.forEach(c => matrix[i][c] += min)
            }
        }

        return matrix
    }

    const main = (input) => {
        let matrix = input.map(l => l.map(c => c))
        const subtractedMatrix = subMin(subMin(matrix))

        const boolMatrix = subtractedMatrix.map(l => l.map(el => !el))
        const {rows, cols} = markMatrix(matrix, boolMatrix)

        while (rows + cols < matrix.length) matrix = adjustMatrix(matrix, boolMatrix)

        return markMatrix(matrix, boolMatrix).markedRowEls
    }

    return main(input)
}

const adjustResult = (input) => {
   let adjustedPoints = input.map(p => [oddV[p[0]], oddV[p[1]], costMatrix[p[0]][p[1]]]);

    return adjustedPoints
}

const adjustInputMatrix = (input, newVs) => {
    newVs.forEach(v => {
        input[v[0]][v[1]] = v[2]
    })

    return input
}

const costMatrix = buildCostMatrix(input);

const parseToNewMatrix = (input, newEdges) => {
    let newMatrix = []
    input.forEach((l, index) => {
        const v = index;
        const es = [];

        l.forEach((e, col) => {
            if (e) es.push({v: col, p: e})
        })

        newMatrix.push({v, es})
    })

    newEdges.forEach(ne => {
        newMatrix[ne[0]].es.push({v: ne[1], p: ne[2]})
    })

    return newMatrix
}


const main = () => {
    const {oddV} = oddEdges();

    if (!oddV.length) {
        // in this case, the graph is already eulerian
        //fleury()

    } else {
        // in here we use dijkstra on the odd vertices to build a cost matrix
        // this matrix has the weight to go from any odd vertex to any other odd vertex
        const costMatrix = buildCostMatrix(input)
        // console.log(costMatrix, "matriz de custo")

        // here we use the hungarian matching algorithm to take the minimal cost edges to add
        const newRawEdges = hungarian(costMatrix)
        // console.log(newRawEdges, "arestas do hungaro")

        // the world is a harsh place. HMA is supposed to run on bipartide graphs, but our buildCostMatrix 
        // does not generate one, so this function fix the hungarian output to select distinct edges
        // (it also remap the vertices, buildCostMatrix changes their index)
        const newEdges = adjustResult(newRawEdges)
        // console.log(newEdges, "arestas ajustadas do hungaro")
        const newMatrix = parseToNewMatrix(input, newEdges)
        // newMatrix.forEach(a => console.log(a))
        fleury(2, newMatrix)

        // now we ought to change our graph data structure representation, the simple adjacency matrix
        // does not handle multigraphs well, so we'll use a more suitable representation for them

        // const newMatrix = parseToNewMatrix(input, newEdges)

        // finally, when can use fleury's algorithm to traverse a eulerian path

        //fleury()
    }
}

// main()

const isNexBridge = (v, visited, matrix) => {
    let count = 1;

    visited[v] = true;
    matrix[v].es.forEach(e => {
        if (!visited[e.v]) {
            count += isNexBridge(e.v, visited, matrix)
        }
    })

    return count;
}

const removeEdge = (edge, matrix) => {
    matrix[edge.u].es.splice(matrix[edge.u].es.findIndex(e => e.v === edge.v), 1)
    matrix[edge.v].es.splice(matrix[edge.v].es.findIndex(e => e.v === edge.u), 1)
}

const addEdge = (edge, matrix) => {
    matrix[edge.u].es.push({v: edge.v})
    matrix[edge.v].es.push({v: edge.u})
}

const isValidEdge = (v, u, matrix) => {
    removeEdge({v, u}, matrix)
    let visited = matrix.map(l => false)
    const c1 = isNexBridge(u, visited, matrix)

    addEdge({v, u}, matrix)
    visited = matrix.map(l => false)
    const c2 = isNexBridge(u, visited, matrix)

    return c1 === c2
}

const fleury = (u, matrix) => {

    console.log(u, " ")

    if (!matrix[u].es.length) return

    if (matrix[u].es.length === 1) {
        const v = matrix[u].es[0].v
        removeEdge({u, v}, matrix)
        fleury(v, matrix)
        return;
    }

    matrix[u].es.forEach(e => {
        if (isValidEdge(u, e.v, matrix)) {
            removeEdge({u, v: e.v}, matrix)
            fleury(e.v, matrix)
            return
        }
    })

}

fleury(0, parseToNewMatrix(input, adjustResult(hungarian(buildCostMatrix(input)))))