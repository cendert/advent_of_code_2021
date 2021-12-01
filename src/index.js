import "./styles.css";
import { sonarInput } from "./input.mjs";

const setPrevious = (prev) => (val) => ({ ...prev, ...val });
const increaseValOfKey = (prev) => (key) => ({ ...prev, [key]: prev[key] + 1 });

const countIncreases = (prev, curr) => {
  const { previousSonarValue } = prev;
  let result = setPrevious(prev)({ previousSonarValue: curr });

  if (!previousSonarValue) {
    return result;
  }

  if (previousSonarValue < curr) {
    return increaseValOfKey(result)("runningTotal");
  }

  return result;
};

class SlidingWindow {
  constructor() {
    this._list = [];
  }

  get() {
    return this._list;
  }

  set(list) {
    this._list = list;
    return this._list;
  }

  add(val) {
    if (this._list?.length === 3) {
      this._list.shift();
    }
    this._list.push(val);
  }

  total() {
    return this._list.reduce((prev, curr) => prev + curr, 0);
  }
}

const countSlidingWindowIncreases = (prev, curr, index) => {
  const { olderThree, newerThree } = prev;

  olderThree.set([...newerThree.get()]);
  newerThree.add(curr);

  if (index < 3) {
    return setPrevious(prev)({ olderThree, newerThree });
  } else {
    if (olderThree.total() < newerThree.total()) {
      return increaseValOfKey(prev)("increased");
    } else if (olderThree.total() === newerThree.total()) {
      return increaseValOfKey(prev)("unchanged");
    } else if (olderThree.total() > newerThree.total()) {
      return increaseValOfKey(prev)("decreased");
    }
  }
};

console.log(sonarInput.reduce(countIncreases, { runningTotal: 0 }));
console.log(
  sonarInput.reduce(countSlidingWindowIncreases, {
    olderThree: new SlidingWindow(),
    newerThree: new SlidingWindow(),
    increased: 0,
    unchanged: 0,
    decreased: 0
  })
);

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;
