import { BigInteger } from "jsbn";

const a = BigInteger.ZERO;
const prime = new BigInteger("29");

const three = new BigInteger("3");
const two = new BigInteger("2");

type Point = { x: BigInteger; y: BigInteger };

const lambdaValues = new Map<string, BigInteger>();

const add = ({ p, q }: { p: Point; q: Point }) => {
  const lambda = getLambda({ p, q });
  const x = lambda.multiply(lambda).subtract(p.x).subtract(q.x).mod(prime);
  const y = lambda.multiply(p.x.subtract(x)).subtract(p.y).mod(prime);
  return { x, y };
};

const getLambda = ({ p, q }: { p: Point; q: Point }) => {
  const key = `${p.x.toString()}-${p.y.toString()}-${q.x.toString()}-${q.y.toString()}`;
  if (lambdaValues.has(key)) {
    return lambdaValues.get(key)!;
  }
  let result: BigInteger;
  if (!p.x.compareTo(q.x) && p.y.compareTo(q.y)) {
    result = three
      .multiply(p.x.pow(2))
      .add(a)
      .multiply(p.y.multiply(two).modInverse(prime));
  }
  result = q.y.subtract(p.y).multiply(q.x.subtract(p.x).modInverse(prime));
  lambdaValues.set(key, result);
  return result.mod(prime);
};
