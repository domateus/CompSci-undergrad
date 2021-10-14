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
    const { pathSum, oddV } = oddEdges();
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
buildCostMatrix(input)
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
    const size = oddV.length / 2;


   let adjustedPoints = input.map(p => [oddV[p[0]], oddV[p[1]], costMatrix[p[0]][p[1]]]);

    adjustedPoints = adjustedPoints.splice(0, Math.floor(size));

    return adjustedPoints
}

const adjustInputMatrix = (input, newVs) => {
    newVs.forEach(v => {
        input[v[0]][v[1]] = v[2]
    })

    return input
}

const costMatrix = buildCostMatrix(input);
const result = adjustResult(hungarian(costMatrix))

console.log(adjustInputMatrix(input, result))
