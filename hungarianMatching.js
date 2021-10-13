let input = [
   [10, 4, 8, 6],
   [6, 4, 9, 10],
   [6, 7, 8, 9]
]

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

    console.log(markMatrix(matrix, boolMatrix))
}

main(input)

// https://python.plainenglish.io/hungarian-algorithm-introduction-python-implementation-93e7c0890e15