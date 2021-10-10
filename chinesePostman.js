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

console.log(pathSum, oddV);

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


const dijkstra = (s, input) => {
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

dijkstra(0, input)

const hungarian = () => {

}
